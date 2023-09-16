"use strict";
const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers");
const path = require("path");

router.get("/:id", userControllers.articleDetailPage);

module.exports = router;
