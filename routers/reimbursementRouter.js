const express = require("express");
const router = express.Router();
const { isAdmin, isAuthenticated } = require("../middleware/isAuthenticated");

const {
  postReimbursement,
  userReimbursement,
  usersReimbursementRequest,
  updateStatusOfReimbursement,
  usersReimbursementRequestForUpdate,
  userReimbursementReq,
} = require("../controller/reimbursementControl");

router.route("/reimbursement/new").post(isAuthenticated, postReimbursement);
router.route("/reimbursement/leave").get(isAuthenticated, userReimbursement);
router
  .route("/reimbursement/leave/request")
  .get(isAuthenticated, usersReimbursementRequest);
router
  .route("/reimbursement/admin/leave/request")
  .get(isAuthenticated, usersReimbursementRequestForUpdate);
router
  .route("/reimbursement/user/leave/request")
  .get(isAuthenticated, userReimbursementReq);
router
  .route("/reimbursement/leave/request/update")
  .put(isAuthenticated, isAdmin("admin"), updateStatusOfReimbursement);

module.exports = router;
