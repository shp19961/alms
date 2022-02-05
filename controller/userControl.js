const User = require("../model/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAysncError = require("../middleware/catchAsyncError");
const sendToken = require("../utils/sendToken");

exports.home = catchAysncError((req, res, next) => {
  res.status(200).render("index.hub");
});

exports.userRegister = catchAysncError(async (req, res, next) => {
  const { fName, lName, email, password, cPassword, salary } = req.body;
  if (!fName || !lName || !email || !password || !cPassword || !salary) {
    return next(new ErrorHandler("please fill all the field", 400));
  }
  const user = await User.create({
    fName,
    lName,
    email,
    password,
    salary,
  });
  sendToken(user, 201, res);
});

//user login
exports.loginUser = catchAysncError(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

// Get all users(admin)
exports.getAllUser = catchAysncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Get single user (admin)
exports.getSingleUser = catchAysncError(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new ErrorHandler(`please provide email id`));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with email: ${req.body.email}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Logout User
exports.logout = catchAysncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
});

exports.updateLeaves = catchAysncError(async (req, res, next) => {
  const { email, startDate, endDate, typeOfLeave, message } = req.body;
  if (!email || !startDate || !endDate || !typeOfLeave || !message) {
    return next(new ErrorHandler("fill all the field please", 400));
  }

  let user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("user not found", 400));
  }
  user.leaves = {
    startDate,
    endDate,
    message,
    typeOfLeave,
  };
  // const updateData = {
  //   leaves: {
  //     startDate,
  //     endDate,
  //     typeOfLeave,
  //     message,
  //   },
  // };
  updateUser = await User.findOneAndUpdate(
    { email },
    {
      $push: {
        leaves: {
          startDate,
          endDate,
          message,
          typeOfLeave,
        },
      },
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  await updateUser.save();
  // console.log(upd);
  res.status(200).json({
    success: true,
  });
});
