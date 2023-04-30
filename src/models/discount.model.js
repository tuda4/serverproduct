"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

const discountSchema = new Schema(
  {
    discountName: { type: String, required: true },
    discountDescription: { type: String, required: true },
    discountType: {
      type: String,
      default: "fixedAmount",
      enum: ["fixedAmount", "fixedPercent"],
    },
    discountValue: { type: Number, required: true },
    discountCode: { type: String, required: true },
    discountStartDate: { type: Date, required: true },
    discountEndDate: { type: Date, required: true },
    discountMaxUses: { type: Number, required: true }, // so luong discount duoc su dung
    discountUsedCount: { type: Number, required: true }, // so luong discount da su dung
    discountUsersUsed: { type: Array, required: true }, // ai da su dung
    discountMaxUsesPercentUser: { type: Number, required: true }, // so luong discount/user
    discountMinOrderValue: { type: Number, required: true },
    discountShopId: { type: Schema.Types.ObjectId, ref: "Shop" },
    discountIsActive: { type: Boolean, default: true },
    discountAppliedTo: {
      type: String,
      default: "all",
      enum: ["all", "specific"],
    },
    discountProductId: { type: Array, default: [] },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, discountSchema);
