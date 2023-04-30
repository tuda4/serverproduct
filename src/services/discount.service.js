"use strict";

const { Types } = require("mongoose");
const {
  BadRequestErrorResponse,
  NotFoundError,
} = require("../core/error.response");

const {
  handleCreateDiscount,
  handleFindDiscount,
  handleFindDiscountById,
  handleUpdateDiscountCode,
  handleGetAllDiscountCodeInShop,
  handleDeleteDiscountCode,
  handleCancelDiscountCode,
  updateUserUsedDiscount,
} = require("../models/reposistories/discount.repo");
const {
  findAllProducts,
  findOneProduct,
} = require("../models/reposistories/product.repo");
const { removeInvalidObjects, updateNestedObjects } = require("../utils");
const { product } = require("../models/product.model");
class DiscountService {
  static async createDiscountCode({
    name,
    description,
    type,
    value,
    code,
    startDate,
    endDate,
    maxUses,
    usedCount,
    userUsed,
    maxUsesPercentUser,
    minOrderValue,
    shopId,
    isActive,
    appliedTo,
    productIds,
  }) {
    if (new Date() < new Date(startDate) || new Date(endDate) < new Date()) {
      throw new BadRequestErrorResponse("Discount Code is expired");
    }

    if (new Date(startDate) >= new Date(endDate)) {
      throw new BadRequestErrorResponse("Discount Code is not valid");
    }

    const foundDiscountCode = await handleFindDiscount({ code, shopId });

    if (foundDiscountCode && foundDiscountCode.discountIsActive) {
      throw new BadRequestErrorResponse("Discount Code is existing");
    }

    const newDiscount = await handleCreateDiscount({
      name,
      description,
      type,
      value,
      code,
      startDate,
      endDate,
      maxUses,
      usedCount,
      userUsed,
      maxUsesPercentUser,
      minOrderValue,
      shopId,
      isActive,
      appliedTo,
      productIds,
    });

    return newDiscount;
  }

  static async updateDiscountCode(id, payload) {
    if (payload.discountAppliedTo === "all") {
      payload.discountProductId = [];
    }
    if (payload.discountAppliedTo === "specific") {
      if (
        !payload.discountProductId ||
        payload.discountProductId.length === 0
      ) {
        throw new BadRequestErrorResponse(
          " if discountAppliedTo is specified, the productId is not empty"
        );
      }
    }

    return await handleUpdateDiscountCode({ id, payload });
  }

  static async getAllProductsWithDiscountCode({
    code,
    shopId,
    limit = 50,
    page = 1,
  }) {
    const foundDiscountCode = await handleFindDiscount({ code, shopId });

    if (!foundDiscountCode) {
      throw new NotFoundError("Discount Code is not found");
    }

    const { discountAppliedTo, discountProductId } = foundDiscountCode;
    let products;
    if (discountAppliedTo === "all") {
      products = await findAllProducts({
        filter: {
          productShop: new Types.ObjectId(shopId),
          isPublished: true,
          productQuantity: { $gt: 0 },
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["productName"],
      });
    }

    if (discountAppliedTo === "specific") {
      products = await findAllProducts({
        filter: {
          _id: { $in: discountProductId },
          isPublished: true,
          productQuantity: { $gt: 0 },
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["productName"],
      });
    }
    console.log(products);
    return products;
  }

  static async getAllDiscountCodeInShop({ limit = 50, page = 1, shopId }) {
    return await handleGetAllDiscountCodeInShop({
      limit: +limit,
      page: +page,
      filter: {
        discountShopId: new Types.ObjectId(shopId),
        discountIsActive: true,
      },
      unSelect: ["__v", "discountShopId"],
    });
  }

  static async getDiscountAmount({ code, shopId, userId, products }) {
    const foundDiscount = await handleFindDiscount({ code, shopId });
    if (!foundDiscount) {
      throw new NotFoundError("Discount not found");
    }
    const {
      discountIsActive,
      discountMaxUses,
      discountUsedCount,
      discountStartDate,
      discountEndDate,
      discountUsersUsed,
      discountMinOrderValue,
      discountType,
      discountValue,
    } = foundDiscount;

    if (!discountIsActive) {
      throw new BadRequestErrorResponse("Discount is expired");
    }

    if (discountMaxUses < discountUsedCount) {
      throw new BadRequestErrorResponse("Discount is out of range");
    }

    if (
      new Date() < new Date(discountStartDate) ||
      new Date(discountEndDate) < new Date()
    ) {
      throw new BadRequestErrorResponse("Discount is expired");
    }

    if (discountUsersUsed) {
      const isUserUsed = discountUsersUsed.find((user) => user.id === userId);
      if (isUserUsed) {
        throw new BadRequestErrorResponse("User used this discount");
      }
    }

    const dataProduct = await Promise.all(
      products.map((product) => {
        return findOneProduct({
          productId: product.productId,
          unSelect: ["__v", "productShop", "isDraft", "isPublished"],
        });
      })
    );

    let totalOrder;
    if (discountMinOrderValue > 0) {
      totalOrder = products.reduce((acc, product) => {
        const data = dataProduct.find(
          (prod) => prod._id.toString() === product.productId
        );
        return acc + product.productQuantity * data.productPrice;
      }, 0);

      if (totalOrder < discountMinOrderValue) {
        throw new BadRequestErrorResponse(
          "Order Value is less than discount Min Order ValFue"
        );
      }
    }

    const amount =
      discountType === "fixedAmount"
        ? discountValue
        : (discountValue * totalOrder) / 100;

    await updateUserUsedDiscount({ code, shopId, userId });

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  static async deleteDiscountCode({ code, shopId }) {
    const result = await handleDeleteDiscountCode({ code, shopId });
    return result;
  }

  static async cancelDiscountCode({ code, shopId, userId }) {
    const foundDiscount = await handleFindDiscount({ code, shopId });
    if (!foundDiscount) {
      throw new NotFoundError("Discount Code not found");
    }

    return await handleCancelDiscountCode({ id: foundDiscount._id, userId });
  }
}

module.exports = DiscountService;
