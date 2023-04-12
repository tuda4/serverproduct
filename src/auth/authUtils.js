'use strict';

const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler');
const {HEADER} = require('./checkAuth');
const { AuthenticationErrorResponse, NotFoundError } = require('../core/error.response');
const keytokenModel = require('../models/keytoken.model');
const { findUserById } = require('../services/key.service');
const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // accessToken 
        const accessToken = await JWT.sign(payload, publicKey, {
            algorithm: 'HS256',
            expiresIn: '3 days'
        })

        const refreshToken = await JWT.sign(payload, privateKey, {
            algorithm: 'HS256',
            expiresIn: '7 days'
        })

        JWT.verify(accessToken, publicKey, (error, decode) => {
            if(error) {
                console.error('error verifying access token')
            } else {
                console.log(`token verified:`, decode)
            }
        } )

        return {
            accessToken, 
            refreshToken
        }
    } catch (error) {
        console.log('[createTokenPair]', error)
    }
}
/*
    1. check userId missing
    2. get accessToken
    3. verify accessToken
    4. check user in database
    5. check keyStore with userId
    6. all Ok => next()
*/ 
const authentication = asyncHandler(async(req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId) throw new AuthenticationErrorResponse('Invalid userId')

    const keyStore = await findUserById(userId)
    if(!keyStore) throw new NotFoundError('Not found user')

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthenticationErrorResponse('Invalid accessToken')

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if(userId !== decodeUser.userId) throw new AuthenticationErrorResponse('Invalid User')
        req.keyStore = keyStore
        return next()
    } catch (error) {
        throw error
    }
})

module.exports = {
    createTokenPair,
    authentication
}

