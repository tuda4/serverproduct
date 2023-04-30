"use strict";
const express = require("express");
const DiscountController = require("../../controllers/discount.controller");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

router.get("/getAll", asyncHandler(DiscountController.getAllDiscountInShop));
router.get(
  "/listProductWithDiscount",
  asyncHandler(DiscountController.getAllProductsWithDiscount)
);
router.post(
  "/amount",
  asyncHandler(DiscountController.getDiscountAmountProducts)
);
router.post('/cancel', asyncHandler(DiscountController.cancelDiscount))
// authentication middleware
router.use(authentication);
// handle create new Product
router.post("/create", asyncHandler(DiscountController.createDiscount));
router.patch(
  "/update/:codeId",
  asyncHandler(DiscountController.updateDiscount)
);
router.post("/delete", asyncHandler(DiscountController.handleDeleteDiscount))

//
module.exports = router;
