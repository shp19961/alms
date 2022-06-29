const Mongoose = require("mongoose");

const reimbursementSchema = new Mongoose.Schema({
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
  holidayDate: {
    type: String,
    required: [true, "date is required of sick leave"],
  },
  leaveTakenDate: {
    type: String,
    required: [true, "date is required of sick leave"],
  },
  status: {
    type: String,
    required: true,
    default: "processing...",
  },
  disabledEdit: {
    type: Number,
    default: +new Date() + 7 * 24 * 60 * 60 * 1000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const reimbursementModel = new Mongoose.model(
  "reimbursement",
  reimbursementSchema
);

module.exports = reimbursementModel;
