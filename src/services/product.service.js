'use strict';

const { BadRequestErrorResponse } = require('../core/error.response');
const {product,perfume, cosmetic} = require('../models/product.model')

class ProductFactory {
    // optimal project with factory and strategy pattern
    static productRegister = {} // type: string, classRef: any 

    static registerProductTypes (type, classRef)  {
        ProductFactory.productRegister[type] = classRef
    }

    static async createProductFactory (type, payload) {
        const productClass = ProductFactory.productRegister[type]
        if(!productClass){
            throw new BadRequestErrorResponse(`Invalid type ${type}`)
        }

        return new productClass(payload).createProduct()
    }

    // static createProductFactory(type, payload) {
    //     switch(type) {
    //         case 'Perfume':
    //             return new  Perfume(payload).createProduct()
    //         case 'Cosmetic':
    //             return new Cosmetic(payload).createProduct()
    //         default:
    //             throw new BadRequestErrorResponse(`Invalid type ${type}`)
    //     }
    // }
}

// define a class Product

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

    async createProduct(productId) {
        return await product.create({...this, _id: productId})
    }
}

// defined subclasses for different products type of Perfume

class Perfume extends Product {
    async createProduct() {

        const newPerfume = await  perfume.create({
            ...this.productAttribute,
            productShop: this.productShop
        })
        if (!newPerfume) throw new BadRequestErrorResponse('create new perfume error') 

        const newProduct = await super.createProduct(newPerfume._id)
        if(!newProduct) throw new BadRequestErrorResponse('create new Product error')

        return newProduct
    }
}

class Cosmetic extends Product {
    async createProduct() {
        const newCosmetic = await  cosmetic.create({...this.productAttribute,  productShop: this.productShop})
        if(!newCosmetic) throw new BadRequestErrorResponse('create new cosmetic error') 

        const newProduct = await super.createProduct(newCosmetic._id)
        if(!newProduct) throw new BadRequestErrorResponse('create new Product error') 

        return newProduct
    }
}

ProductFactory.registerProductTypes('Cosmetic', Cosmetic)
ProductFactory.registerProductTypes('Perfume', Perfume)

module.exports = ProductFactory