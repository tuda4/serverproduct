"use strict";

const {
  NotFoundError,
  BadRequestErrorResponse,
} = require("../core/error.response");
const orderModel = require("../models/order.model");
const { findCartById } = require("../models/reposistories/cart.repo");
const {
  checkoutProductsByServer,
} = require("../models/reposistories/product.repo");
const { getDiscountAmount } = require("./discount.service");
const { acquireKeyLock } = require("./redis.service");

class CheckoutService {
  /*
    payload: {cartId, userId, productsOrders = {shopId, shopDiscount, productIds}}
    */

  static async checkoutReview({ cartId, userId, productsOrder = [] }) {
    // check cart is existing
    const foundCart = await findCartById(cartId);
    if (!foundCart) {
      throw new NotFoundError("cart not found");
    }

    console.log({ foundCart });

    const checkoutOrder = {
      totalPrice: 0,
      freeShip: 0,
      discountPrice: 0,
      totalCheckoutPrice: 0,
    };
    const productsNewOrder = [];
    const productsOrderCount = productsOrder.length;
    for (let i = 0; i < productsOrderCount; i++) {
      const { shopId, shopDiscount = {}, productIds = [] } = productsOrder[i];
      const foundProductsByServer = await checkoutProductsByServer(productIds);
      if (!foundProductsByServer[0]) {
        throw new BadRequestErrorResponse("Order is error");
      }
      // total price order

      const totalPriceOrder = await foundProductsByServer.reduce(
        (acc, product) => {
          return (acc += product.productPrice * product.productQuantity);
        },
        0
      );

      checkoutOrder.totalPrice += totalPriceOrder;

      const itemProductCheckout = {
        shopId,
        shopDiscount,
        priceRaw: totalPriceOrder,
        priceApplyDiscount: totalPriceOrder,
        itemProducts: foundProductsByServer,
      };
      if (shopDiscount && shopDiscount.codeId) {
        console.log(1111)
        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          code: shopDiscount.codeId,
          products: foundProductsByServer,
          shopId: shopDiscount.shopId,
          userId,
        });
        checkoutOrder.discountPrice += discount;

        if (discount > 0) {
          itemProductCheckout.priceApplyDiscount = totalPrice - discount;
        }
      }
      checkoutOrder.totalCheckoutPrice +=
        itemProductCheckout.priceApplyDiscount;
      productsNewOrder.push(itemProductCheckout);
    }
    return {
      productsOrder,
      productsNewOrder,
      checkoutOrder,
    };
  }

  static async orderByUser({
    productsOrder,
    cartId,
    userId,
    userAddress = {},
    userPayment = {}
  }) {
    const { productsNewOrder, checkoutOrder } = await CheckoutService.checkoutReview({
      cartId,
      userId,
      productsOrder
    })

    // inspect the products
    const products = productsNewOrder.flatMap(order => order.itemProducts)
    console.log('[checkoutService]', products)
    let acquireProduct = [];
    for (let i = 0; i < products.length; i++) {
      const { productId, productQuantity } = products[i]
      const keyLock = await acquireKeyLock(productId, productQuantity, cartId)
      acquireKeyLock.push(keyLock ? 'success' : 'fail')
    }
    if (acquireProduct.some(item => item === 'fail')) {
      throw new BadRequestErrorResponse('A lot of products updated, please returned your cart')
    }

    const newOrder = await orderModel.create({
      orderUserId: userId,
      orderCheckout: checkoutOrder,
      orderShipping: userAddress,
      orderPayment: userPayment,
      orderProducts: productsNewOrder
    })
    // if success, remove product in user cart
    if (newOrder) {

    }
    return newOrder
  }

  static async getOrderByUser() {

  }

  static async cancelOrderByUser() {

  }

  static async updatedOrderStatusByShop () {
    
  }
}

module.exports = CheckoutService;
