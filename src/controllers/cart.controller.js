"use strict";

const CartService = require("../services/cart.service");
const { SuccessResponse } = require("../core/success.response");

class CartController {

  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: ` create user cart is successfully`,
      metadata: await CartService.addProductToCart(req.body),
    }).send(res);
  };

  updateToCartExists = async (req, res, next) => {
    new SuccessResponse({
      message: ` update product into cart is successfully`,
      metadata: await CartService.updateProductToExistingCart(req.body),
    }).send(res);
  }

  deleteProductOnCart = async (req, res, next) => {
    new SuccessResponse({
      message: ` delete product into cart is successfully`,
      metadata: await CartService.deleteProductOnCart(req.body),
    }).send(res);
  }

  getUserCart = async (req, res, next) => {
    new SuccessResponse({
      message: ` delete product into cart is successfully`,
      metadata: await CartService.getListProductsOnCart(req.query),
    }).send(res);
  }
}

module.exports = new CartController();
