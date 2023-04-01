'use strict';

const JWT = require('jsonwebtoken');

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

module.exports = {
    createTokenPair
}

