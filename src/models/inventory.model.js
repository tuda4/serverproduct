'use strict';

const {Schema, model} = require('mongoose')

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'
const inventoryModel = new Schema({
    inventoryProductId : {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    inventoryStock: {
        type: Number,
        required: true
    },
    inventoryProductShop: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    inventoryLocation: {
        type: String,
        default: 'unKnown'
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, inventoryModel)