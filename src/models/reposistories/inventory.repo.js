"use strict";

const inventoryModel = require("../inventory.model");
const { Types } = require('mongoose')
const insertProductToInventory = async ({
  productId,
  stock,
  productShop,
  location = "unKnown",
}) => {
  return await inventoryModel.create({
    inventoryProductId: productId,
    inventoryStock: stock,
    inventoryProductShop: productShop,
    inventoryLocation: location,
  });
};

const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
    inventoryProductId: Types.ObjectId(productId),
    inventoryStock: { $gte: quantity },
  }
  const update = {
    $inc: {
      inventoryStock: -quantity
    },
    $push: {
      inventoryReservations: {
        quantity,
        cartId,
        createdAt: new Date()
      }
    }
  }
  const options = {upsert: true, new: true}

  return await inventoryModel.updateOne(query, update, options)
}



module.exports = {
  insertProductToInventory,
  reservationInventory
};
