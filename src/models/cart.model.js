'use strict'

const {Schema, models, model} = require('mongoose')

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'

const cartSchema = new Schema({
    cartStatus: {
        type: String,
        required: true,
        enum: ['active', 'completed', 'pending', 'failed'],
        default: 'active'
    },
    cartProducts: {
        type: [],
        required: true,
        default: []
    },
    cartCountProducts: {
        type: Number,
        default: 0
    },
    cartUserId: {
        type: String,
        required: true
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports = model(DOCUMENT_NAME, cartSchema)
