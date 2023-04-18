'use strict';

const express = require('express');
const { checkApiKey, checkPermissions } = require('../auth/checkAuth');
const router = express.Router()

// check apiKey
router.use(checkApiKey)
// check permissions
router.use(checkPermissions('0000'))
router.use('/api/v1', require('./access/index'))
router.use('/api/v1/product', require('./product/index'))


module.exports = router