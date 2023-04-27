'use strict';

const ProductFactory  = require('../services/product.service')
const {SuccessResponse} = require('../core/success.response')

class ProductController {
    createProduct = async(req, res, next) => {
         new SuccessResponse({
            message: 'Product created successfully',
            metadata: await ProductFactory.createProductFactory(req.body.productType, {
                ...req.body,
                productShop: req.user.userId
            })
         }).send(res)   
    }
    /**
     * @description update product
     * @param {String}  productType 
     * @param {String} productId
     * @param {Object} payload
     * @return {JSON}
     */

    updateProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Product updated successfully',
            metadata: await ProductFactory.updateProduct(req.body.productType, req.params.productId, {
                ...req.body,
                productShop: req.user.userId
            })
         }).send(res)   
    }

    /**
     * @description Set published and unpublish product 
     * @param {any} productShop 
     * @param {any} productId
     * @return { JSON } 
     */

    // PUT 
    setPublishedProductInShop = async(req, res, next) => {
        new SuccessResponse({
            message: 'Set published product successfully',
            metadata: await ProductFactory.setPublishedProductInShop({
                productShop: req.user.userId,
                productId: req.params.id,
            })
        }).send(res)
    }

    setUnPublishedProductInShop = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Set unPublished product successfully',
            metadata: await ProductFactory.setUnPublishedProductInShop({
                productShop: req.user.userId,
                productId: req.params.id,
            })
        }).send(res)
    }
    // QUERY
    /**
     * @description Get all  draft products in shop
     * @param {Number} limit
     * @param {Number} skip
     * @return {JSON}
     */

    getAllDraftProducts = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get list draft products successfully',
            metadata: await ProductFactory.getDraftProductInShop({
                productShop: req.user.userId
            })
        }).send(res)
    }

    /**
     * @description get all published products in shop
     * @param {String} productShop 
     * @return {JSON}
     */

    getAllPublishedProducts = async(req, res, next) => {
        new SuccessResponse({
            message: "Get list published product successfully",
            metadata: await ProductFactory.getPublishedProductInShop({
                productShop: req.user.userId
            })
        }).send(res)
    }
    /**
     * @description handle search product by user
     * @param {String} keySearch 
     * @return {JSON}
     */
    getSearchListProduct = async(req, res, next) => {
        new SuccessResponse({
            message: "Search list product successfully",
            metadata: await ProductFactory.getSearchListProduct({
                keySearch: req.params.keySearch
            })
        }).send(res)
    }

    /**
     * @description get all products
     * @param {*} req 
     * @return {JSON}
     */

    getAllProducts = async(req, res, next) => {
        new SuccessResponse({
            message: "Search list getAllProducts successfully",
            metadata: await ProductFactory.getAllProductsInShop(req.query)
        }).send(res)
    }

    /**
     * @description get one product
     * @param {String} productId
     * @return {JSON}
     */

    getOneProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Search list get one Product successfully",
            metadata: await ProductFactory.getOneProductInShop({
                productId: req.params.id
            })
        }).send(res)
    }
    
}

module.exports = new ProductController();