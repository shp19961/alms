const Mongoose = require("mongoose");

const forgetAttendanceSchema = new Mongoose.Schema({
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
  dates: {
    type: Array,
    required: [true, "Please select the dates"],
  },
  messages: {
    type: Array,
    required: [true, "Please fill the message field"],
  },
  forgetType: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "processing...",
  },
  disabledEdit: {
    type: Number,
    default: +new Date() + 8 * 24 * 60 * 60 * 1000,
  },
  //   moveToOld: {
  //     type: Number,
  //     default: +new Date() + 7 * 24 * 60 * 60 * 1000,
  //   },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const forgetAttendanceModel = new Mongoose.model(
  "forgetAttendanceRequest",
  forgetAttendanceSchema
);

module.exports = forgetAttendanceModel;
