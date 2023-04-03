'use strict';
const express = require('express')
const accessController = require('../../controllers/access.controller')
const router = express.Router()
const {asyncHandler} = require('../../auth/checkAuth')
// path SignUp 
router.post('/shop/signup', asyncHandler(accessController.signUp))
module.exports = router