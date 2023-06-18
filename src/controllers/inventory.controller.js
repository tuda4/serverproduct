'use strict';

const InventoryService = require('../services/inventory.service')
const {SuccessResponse} = require('../core/success.response')

class InventoryController {
    updateStockToInventory = async (req, res, next) => {
        new SuccessResponse({
            message: 'successfully update stock to inventory',
            metadata: await InventoryService.addStockToInventory(req.body)
         }).send(res)   
    }

   
}

module.exports = new InventoryController();