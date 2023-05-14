"use strict";
const express = require("express");
const CheckoutController = require("../../controllers/checkout.controller");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

router.post("/review", asyncHandler(CheckoutController.checkoutOrderReview));
// authentication middleware
router.use(authentication);
// handle create new Product




//
module.exports = router;
