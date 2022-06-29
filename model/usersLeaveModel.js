const Mongoose = require("mongoose");

const leavesSchema = new Mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  fName: {
    type: String,
    required: true,
  },
  lName: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: [true, "date is required of sick leave"],
  },
  endDate: {
    type: String,
    required: [true, "date is required of sick leave"],
  },
  typeOfLeave: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
    default: "No data",
  },
  status: {
    type: String,
    required: true,
    default: "processing...",
  },
  typeOfDay: {
    type: String,
    required: true,
    default: "fullDay",
  },
  employeeShift: {
    type: String,
  },
  employeeHalf: {
    type: String,
  },
  disabledEdit: {
    type: Number,
    default: +new Date() + 8 * 24 * 60 * 60 * 1000,
  },
  moveToOld: {
    type: Number,
    default: +new Date() + 7 * 24 * 60 * 60 * 1000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const leavesModel = new Mongoose.model("userLeave", leavesSchema);

module.exports = leavesModel;
