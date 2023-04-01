'use strict';

const express = require('express');

const router = express.Router()

router.use('/api/v1', require('./access/index'))
// router.get('', (req, res, next) => {
//     return res.status(200).json({
//         messages: 'Welcome back!'
//     })
// })

module.exports = router