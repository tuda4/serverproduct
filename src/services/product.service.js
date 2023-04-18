'use strict';

const { BadRequestErrorResponse } = require('../core/error.response');
const {product,perfume, cosmetic} = require('../models/product.model')

class ProductFactory {
    static createProductFactory(type, payload) {
        switch(type) {
            case 'Perfume':
                return new  Perfume(payload).createProduct()
            case 'Cosmetic':
                return new Cosmetic(payload).createProduct()
            default:
                throw new BadRequestErrorResponse(`Invalid type ${type}`)
        }
    }
}

// define a class Product
/**
 * productName: {type: String, required: true},
    productPrice: {type: Number, required: true},
    productThumbnail: {type: String, required: true},
    productDescription: {type: String},
    productQuantity: {type: Number, required: true},
    productType: {type: String, required: true, enum: ['Perfume', 'Cosmetics']},
    productShop: {type: Schema.Types.ObjectId, ref: 'Shop'},
    productAttribute: {type: Schema.Types.Mixed, required: true}
 */

class Product {
    constructor({productName, productPrice, productThumbnail, productDescription, productQuantity, productType, productShop, productAttribute}) {
        this.productName = productName;
        this.productPrice = productPrice;
        this.productThumbnail = productThumbnail;
        this.productDescription = productDescription;
        this.productQuantity = productQuantity;
        this.productType = productType;
        this.productShop = productShop;
        this.productAttribute = productAttribute;
    }

    async createProduct() {
        return await product.create(this)
    }
}

// defined subclasses for different products type of Perfume

class Perfume extends Product {
    async createProduct() {

        const newPerfume = await  perfume.create(this.productAttribute)
        if (!newPerfume) throw new BadRequestErrorResponse('create new perfume error') 

        const newProduct = await super.createProduct()
        if(!newProduct) throw new BadRequestErrorResponse('create new Product error')

        return newProduct
    }
}

class Cosmetic extends Product {
    async createProduct() {
        const newCosmetic = await  cosmetic.create(this.productAttribute)
        if(!newCosmetic) throw new BadRequestErrorResponse('create new cosmetic error') 

        const newProduct = await super.createProduct()
        if(!newProduct) throw new BadRequestErrorResponse('create new Product error') 

        return newProduct
    }
}

module.exports = ProductFactory