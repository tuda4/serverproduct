'use strict'

const {product, cosmetic, perfume} = require('../product.model')
const {Types} = require('mongoose')
const findAllDraftProduct = async ({query, skip, limit}) => {
    return queryProduct({query, skip, limit})
}

const findAllPublishProduct = async ({query, skip, limit}) => {
    return queryProduct({query, skip, limit})
}

const searchPublishProduct = async ({keySearch} ) => {
    const keySearchRegex = new RegExp(keySearch)
    const results = await product.find({
        isPublished: true,
        $text: {$search: keySearchRegex}
    }, {
        score: {$meta: 'textScore'}
    })
    .sort({score: {$meta: 'textScore'}})
    .lean()
    return results
}
const setPublishedProductInShop = async ({productShop, productId}) =>  {
    const query = { productShop: new Types.ObjectId(productShop), _id: new Types.ObjectId(productId) }
    const foundProduct = await product.findOne(query)
    if(!foundProduct) {
        return null
    }
    foundProduct.isDraft = false
    foundProduct.isPublished = true
    try {
        const { modifiedCount } = await product.updateOne(query, foundProduct);
        return modifiedCount;
      } catch (error) {
        console.error(error);
        return null;
      }
}

const setUnPublishedProductInShop = async ({productShop, productId}) => {
    const query = { productShop: new Types.ObjectId(productShop), _id: new Types.ObjectId(productId) }
    const foundProduct = await product.findOne(query)
    if(!foundProduct) {
        return null
    }
    foundProduct.isDraft = true
    foundProduct.isPublished = false
    try {
        const { modifiedCount } = await product.updateOne(query, foundProduct);
        return modifiedCount;
      } catch (error) {
        console.error(error);
        return null;
      }
}

const queryProduct = async({query, skip, limit}) => {
    return await product.find(query).
    populate('productShop', 'name email -_id')
    .sort({updatedAt: -1})
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}

module.exports = {
    findAllDraftProduct,
    findAllPublishProduct,
    setPublishedProductInShop,
    setUnPublishedProductInShop,
    searchPublishProduct
}