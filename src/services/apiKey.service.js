'use strict';

const apikeyModel = require("../models/apikey.model");
const crypto = require('crypto')
const findById = async (key) => {
    // const newApiKey = apikeyModel.create({key: crypto.randomBytes(64).toString('hex'), permissions: ['0000']})
    // console.log({newApiKey})
    const objectKey = apikeyModel.findOne({key, status: true}).lean()
    return objectKey
}

module.exports = {
    findById
}