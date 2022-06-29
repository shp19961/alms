const catchAsyncError = require("./catchAsyncError");
const User = require("../model/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
  if (req.session.isAuth) {
    req.user = await User.findById(req.session.userId);
    next();
  } else {
    return next(new ErrorHandler(`please login first`, 400));
  }
});

exports.isAdmin = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`Role: ${req.user.role} cannot use this resouce`, 400)
      );
    }
    next();
  };
};
