const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  fName: {
    type: String,
    required: [true, "Please enter Your fName"],
    maxLength: [30, "name cannot exceed 30 character"],
    minLenght: [4, "name should have more than 4 character"],
  },
  lName: {
    type: String,
    required: [true, "please Enter Your lName"],
    maxLength: [30, "name cannot exceed 30 character"],
    minLenght: [4, "name should have more than 4 character"],
  },
  email: {
    type: String,
    required: [true, "plase Enter Your Email Id"],
    unique: true,
    validate: [validator.isEmail, "Please Enter Valid Email"],
  },
  joiningDate: {
    type: String,
    required: [true, "plase Enter employee joining date"],
  },
  leavingDate: {
    type: String,
  },
  shiftTiming: {
    type: String,
    required: [true, "Plase Enter employee Shift Timing"],
  },
  tempPassword: {
    type: String,
    minLength: [8, "Password must be grater than 8 charecter"],
    select: false,
  },
  password: {
    type: String,
    minLength: [8, "Password must be grater than 8 charecter"],
    select: false,
  },
  active: {
    required: true,
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    default: "user",
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female"],
  },
  designation: {
    type: String,
    required: [true, "Please fill the designation field"],
  },
  attendance: {
    type: Array,
  },
  archiveBy: {
    type: String,
  },
  archiveDate: {
    type: String,
  },
  validTime: {
    type: Number,
    default: +new Date() + 60 * 60 * 1000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//hash password
userSchema.pre("save", async function (next) {
  if (this.password !== undefined) {
    if (!this.isModified("password")) {
      return next();
    } else {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
  if (this.tempPassword !== undefined) {
    if (!this.isModified("tempPassword")) {
      return next();
    } else {
      this.tempPassword = await bcrypt.hash(this.tempPassword, 10);
    }
  }
});

//compare temp password
userSchema.methods.compareTempPassword = async function (enterPassword) {
  const pass = await bcrypt.compare(
    enterPassword.toString(),
    this.tempPassword
  );
  return pass;
};

//compare password
userSchema.methods.comparePassword = async function (enterPassword) {
  const pass = await bcrypt.compare(enterPassword.toString(), this.password);
  return pass;
};
const userModel = new mongoose.model("employee", userSchema);

module.exports = userModel;
