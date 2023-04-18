'use strict';

const {model, Schema} = require('mongoose');

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productionSchema = new Schema({
    productName: {type: String, required: true},
    productPrice: {type: Number, required: true},
    productThumbnail: {type: String, required: true},
    productDescription: {type: String},
    productQuantity: {type: Number, required: true},
    productType: {type: String, required: true, enum: ['Perfume', 'Cosmetics']},
    productShop: {type: Schema.Types.ObjectId, ref: 'Shop'},
    productAttribute: {type: Schema.Types.Mixed, required: true}
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

// define the production type Perfume

const perfumeSchema = new Schema({
    brand: {type: String, required: true},
    volume: {type: Number, required: true},
}, {
    collection: 'Perfumes',
    timestamps: true
})

const cosmeticsSchema = new Schema({
    brand: {type: String, required: true},
    model: {type: String, required: true}
}, {
    collection: 'Cosmetics',
    timestamps: true
})

module.exports =  {
    product: model(DOCUMENT_NAME, productionSchema),
    perfume: model('Perfume', perfumeSchema),
    cosmetic: model('Cosmetic', cosmeticsSchema)
}


