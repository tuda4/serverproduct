'use strict';

const keyTokenModel = require("../models/keytoken.model");

class KeyTokenService {
    static createKeyToken = async({userId, publicKey, privateKey,refreshToken }) => {
       
           
            // const token = await keyTokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })
            // return token ? token.publicKey : null
            const filter = {user: userId}
            const update = {publicKey, privateKey, refreshTokensUsed: [], refreshToken}
            const options = {upsert: true, new: true}
            const token = await keyTokenModel.findOneAndUpdate(filter, update, options) 

            return token ? token.publicKey : null
       
    }
}

module.exports = KeyTokenService