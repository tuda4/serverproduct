'use strict';

const DiscountService  = require('../services/discount.service')
const {SuccessResponse} = require('../core/success.response')

class DiscountController {
    createDiscount = async (req, res, next) => {
        new SuccessResponse({
            message: 'Discount created successfully',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
         }).send(res)   
    }

    updateDiscount = async (req, res, next) => {
        new SuccessResponse({
            message: 'Discount updated successfully',
            metadata: await DiscountService.updateDiscountCode(req.params.codeId, {...req.body, shopId: req.user.userId })
         }).send(res)   
    }

    getAllDiscountInShop = async (req, res, next) => {
        new SuccessResponse({
            message: ` get all Discount in shop is successfully`,
            metadata: await DiscountService.getAllDiscountCodeInShop({...req.query})
         }).send(res)
    }


    getAllProductsWithDiscount = async (req, res, next) => {
        new SuccessResponse({
            message: ` get all Product with Discount is successfully`,
            metadata: await DiscountService.getAllProductsWithDiscountCode({...req.query})
         }).send(res)
    }

    getDiscountAmountProducts = async (req, res, next) => {
        new SuccessResponse({
            message: ` get all Product with Discount is successfully`,
            metadata: await DiscountService.getDiscountAmount({...req.body})
         }).send(res)
    }

    handleDeleteDiscount = async (req, res, next) => {
        new SuccessResponse({
            message: ` Delete Discount is successfully`,
            metadata: await DiscountService.deleteDiscountCode({...req.body, shopId: req.user.userId})
         }).send(res)
    }
    
    cancelDiscount = async (req, res, next) => {
        new SuccessResponse({
            message: ` Cancel Discount is successfully`,
            metadata: await DiscountService.cancelDiscountCode({...req.body})
         }).send(res)
    }
}

module.exports = new DiscountController();