"use strict";

const {
  NotFoundError,
  BadRequestErrorResponse,
} = require("../core/error.response");
const { findCartById } = require("../models/reposistories/cart.repo");
const {
  checkoutProductsByServer,
} = require("../models/reposistories/product.repo");
const { getDiscountAmount } = require("./discount.service");

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
}

module.exports = CheckoutService;
