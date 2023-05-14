"use strict";
const cartModel = require("../cart.model");
const { Types } = require("mongoose");
const findCartById = async (cartId) => {
  return await cartModel
    .findOne({ _id: new Types.ObjectId(cartId), cartStatus: "active" })
    .lean();
};

module.exports = {
  findCartById,
};
