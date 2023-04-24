'use strict';

const { BadRequestErrorResponse } = require('../core/error.response');
const {product,perfume, cosmetic} = require('../models/product.model');
const { findAllDraftProduct, setPublishedProductInShop, findAllPublishProduct, setUnPublishedProductInShop, searchPublishProduct, findAllProducts, findOneProduct } = require('../models/reposistories/product.repo');
const { getSelectedData } = require('../utils');

class ProductFactory {
    // optimal project with factory and strategy pattern
    static productRegister = {} // type: string, classRef: any 

    static registerProductTypes (type, classRef)  {
        ProductFactory.productRegister[type] = classRef
    }

    // create a new product

    static async createProductFactory (type, payload) {
        const productClass = ProductFactory.productRegister[type]
        if(!productClass){
            throw new BadRequestErrorResponse(`Invalid type ${type}`)
        }

        return new productClass(payload).createProduct()
    }
    // get all draft products in shop
    static async getDraftProductInShop ({productShop, skip = 0, limit = 20}) {
        const query = {productShop, isDraft: true}
        return await findAllDraftProduct({query, skip, limit})
    }

    // get all published products in shop
    static async getPublishedProductInShop ({productShop, skip = 0, limit = 20 }) {
        const query = {productShop, isPublished: true}
        return await findAllPublishProduct({query, skip, limit})
    }

    // set published product
    static async setPublishedProductInShop ({productShop, productId}) {
        return await setPublishedProductInShop({productShop, productId})
    }
    // set unpublished product
    static async setUnPublishedProductInShop ({productShop, productId}) {
        return await setUnPublishedProductInShop({productShop, productId})
    }

    static async getSearchListProduct ({keySearch}) {
        return await searchPublishProduct({keySearch})
    }
    // user get all products when they on website
    static async getAllProductsInShop ({limit = 50, sort = 'ctime', page = 1, filter = {isPublished: true}}) {
        return await findAllProducts({limit, sort, page, filter, 
        select: ['productName', 'productPrice', 'productThumbnail', 'productAttribute', 'productRatings']
        })
    }

    // user get one product
    static async getOneProductInShop ({productId}) {
        return await findOneProduct({productId, 
        unSelect: ['__v', 'isDraft', 'isPublished']
        })
    }

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