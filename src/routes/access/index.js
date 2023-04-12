'use strict';
const express = require('express')
const accessController = require('../../controllers/access.controller')
const router = express.Router()
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
// path SignUp 
router.post('/shop/signup', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.login))
// authentication middleware
router.use(authentication)
// handle logout
router.post('/shop/logout', asyncHandler(accessController.logout))
module.exports = router