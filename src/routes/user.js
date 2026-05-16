const express = require("express");
const userController = require("../controller/userController");
const authController = require("../middleware/authMiddleware");
const router = express.Router();

router
  .route("/")
  .get(
    authController.protect,
    authController.restricTo("user"),
    userController.getAllUser,
  );

module.exports = router;
