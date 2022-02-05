const catchAsyncError = require("./catchAsyncError");
const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");

exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = await req.cookies;
  if (!token) {
    return next(new ErrorHandler("please login first", 401));
  }
  const verifyToken = await jwt.verify(token, process.env.TOKEN_SECRATE);
  let id = verifyToken.id;
  req.user = await User.findById(id);
  next();
});

exports.isAdmin = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`Role: ${req.user.role} cannot use this resouce`)
      );
    }
    next();
  };
};
