"use strict";

const { NotFoundError } = require("../core/error.response");
const cartModel = require("../models/cart.model");
const { findProductById } = require("../models/reposistories/product.repo");

class CartService {
  // create user cart if not existing
  static async createUserCart({ userId, product }) {
    const query = { cartUserId: userId, cartStatus: "active" },
      update = { $addToSet: { cartProducts: product } },
      options = { upsert: true, new: true };
    return await cartModel.findOneAndUpdate(query, update, options);
  }

  static async updateUserCart({ userId, product }) {
    const { productId, quantity } = product;
    const query = {
        cartUserId: userId,
        cartStatus: "active",
        "cartProducts.productId": productId,
      },
      update = { $inc: { "cartProducts.$.quantity": quantity } },
      options = { upsert: true, new: true };

    return await cartModel.findOneAndUpdate(query, update, options);
  }

  static async addProductToCart({ userId, product = {} }) {
    const userCart = await cartModel.findOne({ cartUserId: userId });
    const { productId } = product;
    const foundProduct = await findProductById(productId);
    if (!foundProduct) {
      throw new NotFoundError("Product is not exist");
    }
    const { productName, productPrice } = foundProduct;
    if (!userCart) {
      return await CartService.createUserCart({
        userId,
        product: {
          ...product,
          name: productName,
          price: productPrice,
        },
      });
    }

    //  user cart is existing but it is empty
    if (!userCart.cartProducts && !userCart.cartProducts.length) {
      userCart.cartProducts = [product];
      return await userCart.save();
    }

    // user cart is existing and it has some product => update quantity
    return await CartService.updateUserCart({ userId, product });
  }

  static async updateProductToExistingCart({ userId, shopProductIds = [] }) {
    const { quantity, productId } = shopProductIds[0]?.itemProducts?.[0];
    const foundProduct = await findProductById(productId);
    if (!foundProduct) {
      throw new NotFoundError("Product is not exist");
    }
    if (foundProduct.productShop.toString() !== shopProductIds[0]?.shopId) {
      throw new NotFoundError("Product do not belong to the shop");
    }

    if (quantity === 0) {
      // delete product
      deleteProductOnCart({ userId, productId });
    }

    const existProductIntoCart = await cartModel.findOne({
      cartUserId: userId,
      cartProducts: { $elemMatch: { productId } },
    });
    if (!existProductIntoCart) {
      throw new NotFoundError("Product is not updated");
    }

    const prevQuantity = existProductIntoCart.cartProducts.find(
      (el) => el.productId === productId
    ).quantity;
    return await CartService.updateUserCart({
      userId,
      product: {
        productId,
        quantity: quantity - prevQuantity,
      },
    });
  }

  static async deleteProductOnCart({ userId, productId }) {
    const query = { cartUserId: userId, cartStatus: "active" },
      update = {
        $pull: {
          cartProducts: { productId },
        },
      },
      options = { upsert: true, new: true };

    const deleteProduct = await cartModel.updateOne(query, update, options);
    return deleteProduct;
  }

  static async getListProductsOnCart({ userId }) {
    return await cartModel.findOne({ cartUserId: userId.toString() }).lean();
  }
}

module.exports = CartService;
