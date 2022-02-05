const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  fName: {
    type: String,
    required: [true, "please Enter Your fName"],
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
  password: {
    type: String,
    required: [true, "please Enter Your password"],
    minLength: [8, "password must be grater than 8 charecter"],
    select: false,
  },
  salary: {
    required: true,
    type: Number,
  },
  role: {
    type: String,
    default: "user",
  },
  // previousMonthData:[
  //   {}
  // ],
  leaves: [
    {
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
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//genrate token
userSchema.methods.generateToken = async function () {
  const token = jwt.sign({ id: this.id }, process.env.TOKEN_SECRATE, {
    expiresIn: process.env.EXPAIRE_TOKEN,
  });
  return token;
};

//compare password
userSchema.methods.comparePassword = async function (enterPassword) {
  const pass = await bcrypt.compare(enterPassword.toString(), this.password);
  return pass;
};
const userModel = new mongoose.model("employee", userSchema);

module.exports = userModel;
