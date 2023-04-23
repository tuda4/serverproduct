'use strict';

const {model, Schema} = require('mongoose');
const slugify = require('slugify');
const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productionSchema = new Schema({
    productName: {type: String, required: true},
    productPrice: {type: Number, required: true},
    productThumbnail: {type: String, required: true},
    productDescription: {type: String},
    productSlug: {type: String},
    productQuantity: {type: Number, required: true},
    productType: {type: String, required: true, enum: ['Perfume', 'Cosmetic']},
    productShop: {type: Schema.Types.ObjectId, ref: 'Shop'},
    productAttribute: {type: Schema.Types.Mixed, required: true},
    productRatings: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating is gt 1.0'],
        max: [5, 'Rating is lt 5.0'],
        set: (val) => Math.round(val)
    },
    productVariations: {type: Array, default: []},
    isDraft: {type: Boolean, default: true, index: true, select: false},
    isPublished: {type: Boolean, default: false, index: true, select: false},
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

// create index for search results

productionSchema.index({productName: 'text', productDescription: 'text'})

//  create slug
productionSchema.pre('save', function(next) {
    this.productSlug = slugify(this.productName, {lower: true})
    next()
})

// define the production type Perfume

const perfumeSchema = new Schema({
    brand: {type: String, required: true},
    volume: {type: Number, required: true},
    productShop: {type: Schema.Types.ObjectId, ref: 'Shop'},
}, {
    collection: 'Perfumes',
    timestamps: true
})

const cosmeticsSchema = new Schema({
    brand: {type: String, required: true},
    model: {type: String, required: true},
    productShop: {type: Schema.Types.ObjectId, ref: 'Shop'},
}, {
    collection: 'Cosmetics',
    timestamps: true
})

module.exports =  {
    product: model(DOCUMENT_NAME, productionSchema),
    perfume: model('Perfume', perfumeSchema),
    cosmetic: model('Cosmetic', cosmeticsSchema)
}


