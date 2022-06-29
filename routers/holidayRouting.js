const express = require("express");

const router = express.Router();

const { createHoliday, getHoliday } = require("../controller/holidayControl");
const { isAdmin, isAuthenticated } = require("../middleware/isAuthenticated");

router
  .route("/admin/holiday/update")
  .post(isAuthenticated, isAdmin("admin"), createHoliday);
router.route("/admin/holiday").get(isAuthenticated, getHoliday);

module.exports = router;
