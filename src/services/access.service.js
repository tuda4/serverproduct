'use strict';

const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt')
const crypto = require('crypto');
const KeyTokenService = require("./key.service");
const { createTokenPair } = require("../auth/authUtils");
const { getData } = require("../utils");
const RoleShop = {
    SHOP: 'shop',
    WRITER: 'writer',
    EDITOR: 'editor',
    BUYER: 'buyer',
    ADMIN: 'admin',
}
class accessService {
    static singUp = async ({name, email, password}) => {
        try {
            // step1: check email exists ?
            const holderEmail = await shopModel.findOne({email}).lean()
            if(holderEmail) {
                return {
                    code: 'xxx1',
                    message: 'Shop already registered!'
                }
            }

            const passwordHash = await bcrypt.hash(password, 10)
            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            })
            if(newShop) {
                // created private key and public key
                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')

                const keyTokenShop = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })
              

                if(!keyTokenShop) {
                    return {
                        code: 'xxx02',
                        message: 'publicKeyString error'
                    }
                }
                // create token pair

                const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)
                return {
                    code: 201,
                    metadata: {
                        shop: getData({fields: ['_id', 'name', 'email'], object: newShop}),
                        tokens
                    }
                }
                
            }
            return{
                code: 201,
                metadata: null
            }
        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }

    }
}

module.exports = accessService