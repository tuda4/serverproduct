"use strict";

const { getSelectedData, getUnSelectedData } = require("../../utils");
const { product, cosmetic, perfume } = require("../product.model");
const { Types } = require("mongoose");
const findAllDraftProduct = async ({ query, skip, limit }) => {
  return queryProduct({ query, skip, limit });
};

const findAllPublishProduct = async ({ query, skip, limit }) => {
  return queryProduct({ query, skip, limit });
};

const searchPublishProduct = async ({ keySearch }) => {
  const keySearchRegex = new RegExp(keySearch);
  const results = await product
    .find(
      {
        isPublished: true,
        $text: { $search: keySearchRegex },
      },
      {
        score: { $meta: "textScore" },
      }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();
  return results;
};
const setPublishedProductInShop = async ({ productShop, productId }) => {
  const query = {
    productShop: new Types.ObjectId(productShop),
    _id: new Types.ObjectId(productId),
  };
  const foundProduct = await product.findOne(query);
  if (!foundProduct) {
    return null;
  }
  foundProduct.isDraft = false;
  foundProduct.isPublished = true;
  try {
    const { modifiedCount } = await product.updateOne(query, foundProduct);
    return modifiedCount;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const setUnPublishedProductInShop = async ({ productShop, productId }) => {
  const query = {
    productShop: new Types.ObjectId(productShop),
    _id: new Types.ObjectId(productId),
  };
  const foundProduct = await product.findOne(query);
  if (!foundProduct) {
    return null;
  }
  foundProduct.isDraft = true;
  foundProduct.isPublished = false;
  try {
    const { modifiedCount } = await product.updateOne(query, foundProduct);
    return modifiedCount;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const findAllProducts = async ({ limit, page, filter, sort, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectedData(select))
    .lean();

  return products;
};

const findOneProduct = async ({ productId, unSelect }) => {
  return await product
    .findById({ _id: new Types.ObjectId(productId) })
    .select(getUnSelectedData(unSelect))
    .lean();
};

const updateProductById = async ({
  model,
  productId,
  payload,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate(productId, payload, { new: isNew });
};

const findProductById = async (productId) => {
  return await product.findById(new Types.ObjectId(productId)).lean();
};

const queryProduct = async ({ query, skip, limit }) => {
  return await product
    .find(query)
    .populate("productShop", "name email -_id")
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const checkoutProductsByServer = async (productsOrders = []) => {
  return await Promise.all(
    productsOrders.map(async (productsOrder) => {
      const foundProduct = await product.findById({
        _id: new Types.ObjectId(productsOrder.productId),
      });
      if (foundProduct) {
        return {
          productId: productsOrder.productId,
          productPrice: foundProduct.productPrice,
          productQuantity: productsOrder.productQuantity,
        };
      }
    })
  );
};

module.exports = {
  findAllDraftProduct,
  findAllPublishProduct,
  setPublishedProductInShop,
  setUnPublishedProductInShop,
  searchPublishProduct,
  findAllProducts,
  findOneProduct,
  updateProductById,
  findProductById,
  checkoutProductsByServer,
};
