const express = require("express");
const router = express.Router();
const { isAdmin, isAuthenticated } = require("../middleware/isAuthenticated");

const {
  applyLeaves,
  userLeaves,
  updateStatusOfLeaves,
  getLeaveRequest,
  getOldLeaveRequest,
  getAllUserleaves,
} = require("../controller/leaveControl");

router.route("/leaves/apply").post(isAuthenticated, applyLeaves);
router.route("/user/leaves").get(isAuthenticated, userLeaves);
router
  .route("/leaves/request")
  .get(isAuthenticated, isAdmin("admin"), getLeaveRequest);
router
  .route("/leaves/request/old")
  .get(isAuthenticated, isAdmin("admin"), getOldLeaveRequest);
router
  .route("/leaves/update")
  .put(isAuthenticated, isAdmin("admin"), updateStatusOfLeaves);

router
  .route("/users/leaves")
  .get(isAuthenticated, isAdmin("admin"), getAllUserleaves);
router.route("/user/leaves/all").get(isAuthenticated, getAllUserleaves);

module.exports = router;
