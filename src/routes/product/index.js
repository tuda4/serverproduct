'use strict';
const express = require('express')
const productController = require('../../controllers/product.controller')
const router = express.Router()
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');

// authentication middleware
router.use(authentication)
// handle create new Product
router.post('/create', asyncHandler(productController.createProduct))
module.exports = router