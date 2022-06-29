const mongoose = require("mongoose");

const holidaySchema = new mongoose.Schema({
  holidayData: {
    type: Object,
  },
});

const holidayModel = new mongoose.model("holiday", holidaySchema);

module.exports = holidayModel;
