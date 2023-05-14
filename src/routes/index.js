'use strict';

const express = require('express');
const { checkApiKey, checkPermissions } = require('../auth/checkAuth');
const router = express.Router()

// check apiKey
router.use(checkApiKey)
// check permissions
router.use(checkPermissions('0000'))
router.use('/api/v1/checkout', require('./checkout/index'))
router.use('/api/v1/discount', require('./discount/index'))
router.use('/api/v1/product', require('./product/index'))
router.use('/api/v1/cart', require('./cart/index'))
router.use('/api/v1', require('./access/index'))


module.exports = router