"use strict";
const express = require("express");
const InventoryController = require("../../controllers/inventory.controller");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

router.use(authentication);
router.post("/add", asyncHandler(InventoryController.updateStockToInventory));
// authentication middleware


module.exports = router;
