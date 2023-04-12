'use strict';

const keyTokenModel = require("../models/keytoken.model");
const {Types} = require('mongoose')
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

    static findUserById = async(userId) => {
        return await keyTokenModel.findOne({user: new Types.ObjectId(userId)}).lean()
    }

    static removeKeyById = async(id) => {
        return await keyTokenModel.findOneAndRemove(id)
    }
}

module.exports = KeyTokenService