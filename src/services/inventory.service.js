'use strict';

const { BadRequestErrorResponse } = require("../core/error.response");
const inventoryModel = require("../models/inventory.model");
const { findProductById } = require("../models/reposistories/product.repo");

class InventoryService {
    static async addStockToInventory({
        stock, productId, shopId, location = ''
    }) {
        const product = await findProductById(productId);
        if(!product) {
            throw new BadRequestErrorResponse('Product not found')
        }

        const query = {inventoryShopId: shopId, inventoryProductId: productId}
        const update = {$inc: {inventoryStock: stock}, $set: {inventoryLocation: location}}
        const options = {upsert: true, new: true}

        return await inventoryModel.findByIdAndUpdate(query, update, options)
    }
}

module.exports = InventoryService;