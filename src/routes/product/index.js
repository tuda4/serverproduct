'use strict';
const express = require('express')
const productController = require('../../controllers/product.controller')
const router = express.Router()
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');

router.get('/search/:keySearch', asyncHandler(productController.getSearchListProduct))
router.get('/', asyncHandler(productController.getAllProducts))
router.get('/:id', asyncHandler(productController.getOneProduct))
// authentication middleware
router.use(authentication)
// handle create new Product
router.post('/create', asyncHandler(productController.createProduct))
// handle set published product
router.post('/publish/:id', asyncHandler(productController.setPublishedProductInShop))
//  handle set unpublished product
router.post('/unpublish/:id', asyncHandler(productController.setUnPublishedProductInShop))
// handle get all draft products
router.get('/draft/all', asyncHandler(productController.getAllDraftProducts))
router.get('/publish/all', asyncHandler(productController.getAllPublishedProducts))

// 
module.exports = router