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
}

module.exports = new ProductController();