'use strict';

const CheckoutService  = require('../services/checkout.service');
const {SuccessResponse} = require('../core/success.response')

class CheckoutController {
    checkoutOrderReview = async (req, res, next) => {
        new SuccessResponse({
            message: 'Checkout Review created successfully',
            metadata: await CheckoutService.checkoutReview(req.body)
         }).send(res)   
    }

   
}

module.exports = new CheckoutController();