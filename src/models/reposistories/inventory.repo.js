"use strict";

const inventoryModel = require("../inventory.model");

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

module.exports = {
  insertProductToInventory,
};
