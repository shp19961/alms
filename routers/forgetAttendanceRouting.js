const express = require("express");
const router = express.Router();
const { isAdmin, isAuthenticated } = require("../middleware/isAuthenticated");

const {
  applyforgetAttendance,
  userForgetAttendance,
  getforgetAttendanceRequest,
  updateStatusOfForgetAttendance,
} = require("../controller/forgetAttendanceControl");

router
  .route("/attendance/forget/apply")
  .post(isAuthenticated, applyforgetAttendance);
router
  .route("/user/attendace/forget/list")
  .get(isAuthenticated, userForgetAttendance);
router
  .route("/user/attendace/forget/request")
  .get(isAuthenticated, isAdmin("admin"), getforgetAttendanceRequest);
// router
//   .route("/leaves/request/old")
//   .get(isAuthenticated, isAdmin("admin"), getOldLeaveRequest);
router
  .route("/user/attendance/forget/update")
  .put(isAuthenticated, isAdmin("admin"), updateStatusOfForgetAttendance);

// router
//   .route("/users/leaves")
//   .get(isAuthenticated, isAdmin("admin"), getAllUserleaves);
// router.route("/user/leaves/all").get(isAuthenticated, getAllUserleaves);

module.exports = router;
