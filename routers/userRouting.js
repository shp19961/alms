const express = require("express");
const router = express.Router();
const {
  userRegister,
  loginUser,
  createPassword,
  getUserDetails,
  getAllUser,
  updateAttendance,
  getAttendance,
  getAllUserAttendance,
  getSingleUser,
  logout,
  getArchivePageData,
  updateUserStatus,
  checkEmail,
  dashboard,
  getUserDashboardData,
} = require("../controller/userControl");
const { isAdmin, isAuthenticated } = require("../middleware/isAuthenticated");

router.route("/register").post(userRegister);
router.route("/login").post(loginUser);
router.route("/password/new").put(createPassword);
router.route("/user/me").get(isAuthenticated, getUserDetails);
router.route("/user/logout").get(isAuthenticated, logout);
router.route("/users").get(isAuthenticated, isAdmin("admin"), getAllUser);
router
  .route("/admin/user")
  .post(isAuthenticated, isAdmin("admin"), getSingleUser);
router.route("/user/attendance/update").post(isAuthenticated, updateAttendance);
router.route("/user/attendance").get(isAuthenticated, getAttendance);
router
  .route("/users/attendance")
  .get(isAuthenticated, isAdmin("admin"), getAllUserAttendance);
router
  .route("/archive/users")
  .get(isAuthenticated, isAdmin("admin"), getArchivePageData);
router
  .route("/archive/user/update")
  .put(isAuthenticated, isAdmin("admin"), updateUserStatus);

router
  .route("/users/check/:id")
  .get(isAuthenticated, isAdmin("admin"), checkEmail);
router.route("/admin/dashboard").get(dashboard);

router.route("/user/dashboard").get(isAuthenticated, getUserDashboardData);

module.exports = router;
