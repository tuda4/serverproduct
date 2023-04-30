"use strict";

const { getSelectedData, getUnSelectedData } = require("../../utils");
const discount = require("../discount.model");
const { Types } = require("mongoose");
const handleFindDiscount = async ({ code, shopId }) => {
  return await discount
    .findOne({
      discountCode: code,
      discountShopId: new Types.ObjectId(shopId),
    })
    .lean();
};

const handleFindDiscountById = async (id) => {
  return await discount.findById(id).lean();
};

const handleCreateDiscount = async ({
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
}) => {
  const newDiscountCode = await discount.create({
    discountName: name,
    discountDescription: description,
    discountType: type,
    discountValue: value,
    discountStartDate: startDate,
    discountEndDate: endDate,
    discountMaxUses: maxUses,
    discountMaxUsesPercentUser: maxUsesPercentUser,
    discountCode: code,
    discountShopId: shopId,
    discountUsersUsed: userUsed,
    discountUsedCount: usedCount,
    discountMinOrderValue: minOrderValue,
    discountIsActive: isActive,
    discountAppliedTo: appliedTo,
    discountProductId: appliedTo === "all" ? [] : productIds,
  });
  return newDiscountCode;
};

const handleUpdateDiscountCode = async ({ id, payload, isNew = true }) => {
  return await discount.findByIdAndUpdate(id, payload, { new: isNew });
};

const handleGetAllDiscountCodeInShop = async ({
  limit,
  sort = "ctime",
  page,
  filter,
  unSelect,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const discountCodes = await discount
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getUnSelectedData(unSelect))
    .lean();

  return discountCodes;
};

const handleGetAllDiscountCodeInShopSelect = async ({
  limit = 50,
  sort = "ctime",
  page = 1,
  filter,
  select,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const discountCodes = await discount
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectedData(select))
    .lean();

  return discountCodes;
};

const handleDeleteDiscountCode = async ({ code, shopId }) => {
  return await discount.findOneAndDelete({
    discountCode: code,
    discountShopId: new Types.ObjectId(shopId),
  });
};

const updateUserUsedDiscount = async({code, shopId, userId}) => {
    const result = await discount.findOneAndUpdate( {
        discountCode: code,
        discountShopId: shopId
    },{
        $push: {
            discountUsersUsed: userId,
        },
        $inc: {
          discountMaxUses: -1,
          discountUsedCount: +1,
        },
      });
      return result;
}

const handleCancelDiscountCode = async ({ id, userId }) => {
  const result = await discount.findByIdAndUpdate(id, {
    $pull: {
      discountUsersUsed: userId,
    },
    $inc: {
      discountMaxUses: 1,
      discountUsedCount: -1,
    },
  });
  return result;
};

module.exports = {
  handleFindDiscount,
  handleCreateDiscount,
  handleFindDiscountById,
  handleUpdateDiscountCode,
  handleGetAllDiscountCodeInShop,
  handleGetAllDiscountCodeInShopSelect,
  handleDeleteDiscountCode,
  handleCancelDiscountCode,
  updateUserUsedDiscount
};
