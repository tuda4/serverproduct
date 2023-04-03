'use strict';

const { findById } = require("../services/apiKey.service");

const HEADER = {
    API_KEY : 'x-api-key',
    AUTHORIZATION: 'authorization',
}

const checkApiKey  = async (req, res, next) => {
    try {
        const keyHeader = req.headers[HEADER.API_KEY]?.toString()
        console.log(keyHeader)
        if(!keyHeader) {
            return res.status(403).json({
                message: 'Forbidden error'
            })
        }
        // check apiKey
        const objectKey = await findById(keyHeader)
        if(!objectKey) {
            return res.status(403).json({
                message: 'objectKey denied'
            })
        }
        req.objectKey= objectKey
        return next()
    } catch(error) {

    }
}

const checkPermissions =(permissions) => {
    return (req, res, next) => {
        if(!req.objectKey.permissions) {
            return res.status(403).json({
                message: 'permissions denied'
            })
        }
        console.log('[permissions]', req.objectKey.permissions)
        const validPermissions = req.objectKey.permissions.includes(permissions)
        if(!validPermissions) {
            return res.status(403).json({
                message: 'permissions denied'
            })
        }
        return next()
    }
}

const asyncHandler = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next)
    }
}
module.exports = {
    checkApiKey,
    checkPermissions,
    asyncHandler
}