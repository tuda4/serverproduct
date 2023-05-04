"use strict";
const express = require("express");
const CartController = require("../../controllers/cart.controller");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");


// authentication middleware
router.use(authentication);
// handle create new Product
router.post("/add", asyncHandler(CartController.addToCart));
router.post("/update", asyncHandler(CartController.updateToCartExists));
router.delete("/delete", asyncHandler(CartController.deleteProductOnCart));
router.get("/getOne", asyncHandler(CartController.getUserCart));


//
module.exports = router;
