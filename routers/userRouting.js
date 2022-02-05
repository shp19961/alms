const express = require("express");
const router = express.Router();
const {
  userRegister,
  loginUser,
  getAllUser,
  getSingleUser,
  updateLeaves,
} = require("../controller/userControl");
const { isAdmin, isAuthenticated } = require("../middleware/isAuthenticated");

router.route("/register").post(userRegister);
router.route("/login").post(loginUser);
router.route("/users").get(isAuthenticated, getAllUser);
router.route("/leaves").put(isAuthenticated, updateLeaves);

module.exports = router;
