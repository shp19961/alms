const User = require("../model/userModel");
const Leaves = require("../model/usersLeaveModel");
const Reimbursement = require("../model/reimbursementModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAysncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");
const date = new Date();
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let key = `${months[date.getMonth()]}${date.getFullYear()}`;

//without weekend
function getBusinessDateCount(startDate, endDate) {
  var elapsed, daysBeforeFirstSaturday, daysAfterLastSunday;
  var ifThen = function (a, b, c) {
    return a == b ? c : a;
  };

  elapsed = endDate - startDate;
  elapsed /= 86400000;

  daysBeforeFirstSaturday = (7 - startDate.getDay()) % 7;
  daysAfterLastSunday = endDate.getDay();

  elapsed -= daysBeforeFirstSaturday + daysAfterLastSunday;
  elapsed = (elapsed / 7) * 5;
  elapsed +=
    ifThen(daysBeforeFirstSaturday - 1, -1, 0) +
    ifThen(daysAfterLastSunday, 6, 5);

  return Math.ceil(elapsed);
}

exports.userRegister = catchAysncError(async (req, res, next) => {
  const {
    fName,
    lName,
    email,
    gender,
    joiningDate,
    shiftTiming,
    designation,
    tempPassword,
    cTempPassword,
  } = req.body;
  if (
    !fName ||
    !lName ||
    !email ||
    !gender ||
    !joiningDate ||
    !shiftTiming ||
    !designation ||
    !tempPassword ||
    !cTempPassword
  ) {
    return next(new ErrorHandler("Please fill all the field", 400));
  }
  if (tempPassword !== cTempPassword) {
    return next(new ErrorHandler("Password not matched", 400));
  }
  await User.create({
    fName,
    lName,
    email,
    gender,
    tempPassword,
    joiningDate,
    designation,
    shiftTiming,
  });
  res.status(200).json({ success: true });
});

//user login
exports.loginUser = catchAysncError(async (req, res, next) => {
  let startDate = new Date();
  let endDate = new Date();
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }

  const user = await User.findOne({ email }).select("+password +tempPassword");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  if (user.active === false) {
    return next(new ErrorHandler("Please contact with HR Department", 401));
  }

  if (user.tempPassword !== undefined) {
    const isPasswordMatched = await user.compareTempPassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }
    await user.save();
    res.status(200).json({ valid: user.email });
  } else {
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }
    req.session.isAuth = true;
    req.session.userId = user._id;
    if (user.shiftTiming === "FirstShift") {
      startDate.setHours(11, 0, 0);
      endDate.setHours(11, 30, 0);
      if (
        +new Date(startDate) < +new Date() &&
        +new Date() < +new Date(endDate)
      ) {
        user.validTime =
          new Date(user.validTime).toDateString() !== new Date().toDateString()
            ? +new Date() + 30 * 60 * 1000
            : user.validTime;
      }
    } else if (user.shiftTiming === "SecondShift") {
      startDate.setHours(14, 0, 0);
      endDate.setHours(14, 30, 0);
      if (
        +new Date(startDate) < +new Date() &&
        +new Date() < +new Date(endDate)
      ) {
        user.validTime =
          new Date(user.validTime).toDateString() !== new Date().toDateString()
            ? +new Date() + 30 * 60 * 1000
            : user.validTime;
      }
    }
    await user.save();
    res.status(200).json({ success: true });
  }
});

//create New Login Password
exports.createPassword = catchAysncError(async (req, res, next) => {
  const { employeeId: email, password } = req.body;
  let user = await User.findOne({ email }).select("+password +tempPassword");
  if (!user) {
    return next(new ErrorHandler("Invalid User", 401));
  } else if (user.password !== undefined) {
    return next(new ErrorHandler("Invalid User", 401));
  } else {
    user.password = password;
    user.tempPassword = undefined;
    await user.save();
    res.status(200).json({ success: true });
  }
});

//get user detail
exports.getUserDetails = catchAysncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

// Get all users(admin)
exports.getAllUser = catchAysncError(async (req, res, next) => {
  const resultPerPage = 10;
  req.query.active = true;
  const usersCount = await User.count({ active: true });
  const apiFeature = new ApiFeatures(User.find(), req.query).search().filter();
  let users = await apiFeature.query;
  let filteredUsersCount = users.length;

  apiFeature.pagination(resultPerPage);
  users = await apiFeature.query.clone().sort({ fName: 1 });

  res.status(200).json({
    success: true,
    users,
    usersCount,
    filteredUsersCount,
    resultPerPage,
  });
});

// Get single user (admin)
exports.getSingleUser = catchAysncError(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new ErrorHandler(`Please provide email id`, 400));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with email: ${req.body.email}`, 400)
    );
  }

  let attendanceMonthObj = [];
  if (user.active === true) {
    for (let i = 0; i < user.attendance.length; i++) {
      attendanceMonthObj.push(
        ...Object.getOwnPropertyNames(user.attendance[i])
      );
      if (attendanceMonthObj[i] === key) {
        user.attendance.splice(i, 1);
      }
    }
  }
  const allLeaves = await Leaves.find({ email });
  const AllReimbursement = await Reimbursement.find({ email });

  res.status(200).json({
    success: true,
    user,
    allLeaves,
    AllReimbursement,
  });
});

// Logout User
exports.logout = catchAysncError(async (req, res, next) => {
  req.session.destroy();
  res.status(200).json({
    success: true,
    message: "Logout successfully",
  });
});

//update attendance
exports.updateAttendance = catchAysncError(async (req, res, next) => {
  let user = await User.findById(req.user.id);
  if (user.validTime > +new Date()) {
    let p = [];
    let r = Object.getOwnPropertyNames(req.body);
    for (i = 0; i < user.attendance.length; i++) {
      p.push(Object.getOwnPropertyNames(user.attendance[i]));
    }
    for (i = 0; i < p.length; i++) {
      if (p[i][0] === r[0]) {
        user.attendance.splice(i, 1);
      }
    }
    await user.save();
    user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $push: {
          attendance: req.body,
        },
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
    res.status(200).json("Attendace updated");
  } else {
    res.status(400).json("Can't update attendance");
  }
});

//get single user attendance
exports.getAttendance = catchAysncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  let attendance = {};
  attendance[key] = [];
  let p = [];
  for (let i = 0; i < user.attendance.length; i++) {
    p.push(Object.getOwnPropertyNames(user.attendance[i]));
    if (p[i][0] === key) {
      attendance = user.attendance[i];
    }
  }
  res.status(200).json(attendance);
});

//get all attendance
exports.getAllUserAttendance = catchAysncError(async (req, res, next) => {
  const resultPerPage = 10;
  req.query.active = true;

  const apiFeature = new ApiFeatures(User.find({ clone: false }), req.query)
    .search()
    .filter();

  apiFeature.pagination(resultPerPage);

  let users = await apiFeature.query;
  let p = [];
  let usersAttendance = {};
  for (let i = 0; i < users.length; i++) {
    usersAttendance[users[i].email] = [];
    for (let j = 0; j < users[i].attendance.length; j++) {
      p.push(Object.getOwnPropertyNames(users[i].attendance[j]));
      for (let a = 0; a < p.length; a++) {
        if (p[a][0] === key) {
          if (users[i].attendance[j][key]) {
            usersAttendance[users[i].email] = [...users[i].attendance[j][key]];
          }
        }
      }
    }
  }
  res.status(200).json(usersAttendance);
});

//single user details
exports.getArchivePageData = catchAysncError(async (req, res, next) => {
  const resultPerPageArchive = 10;
  req.query.active = false;
  const archiveCount = await User.count({ active: false });
  const apiFeature = new ApiFeatures(User.find({ clone: false }), req.query)
    .search()
    .filter();

  apiFeature.pagination(resultPerPageArchive);

  let archiveUsers = await apiFeature.query;
  let filteredArchiveCount = archiveUsers.length;

  res.status(200).json({
    success: true,
    archiveUsers,
    archiveCount,
    filteredArchiveCount,
    resultPerPageArchive,
  });
});

//update User Status
exports.updateUserStatus = catchAysncError(async (req, res, next) => {
  const date = new Date();
  const { email, status, leaveDate } = req.body;
  let user = await User.findOne({ email });
  user.active = status;
  user.archiveBy = `${req.user.fName} ${req.user.lName}`;
  if (leaveDate) {
    user.leavingDate = leaveDate;
  }
  user.archiveDate = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  await user.save();
  res.status(200).json("Status updated");
});

exports.checkEmail = catchAysncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.params.id });
  if (user) {
    success = true;
  } else {
    success = false;
  }
  res.status(200).json({ success });
});

exports.dashboard = catchAysncError(async (req, res, next) => {
  const user = await User.find({ active: true });
  const leaves = await Leaves.find();

  const weeklyPresentData = {};
  const dates = [];
  const genderData = {
    male: 0,
    female: 0,
  };
  for (let i = 0; i < 7; i++) {
    let d = new Date();
    d.setDate(d.getDate() - i);
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      weeklyPresentData[days[d.getDay()]] = 0;
      dates.push(d);
    }
  }
  dates.forEach((date) => {
    let findMonth = `${months[date.getMonth()]}${date.getFullYear()}`;
    for (let j = 0; j < user.length; j++) {
      let p = [];
      let score;
      for (i = 0; i < user[j].attendance.length; i++) {
        p.push(Object.getOwnPropertyNames(user[j].attendance[i]));
      }
      for (i = 0; i < p.length; i++) {
        if (p[i][0] === findMonth) {
          score = user[j].attendance[i][findMonth];
        }
      }
      if (score !== undefined) {
        if (score[date.getDate() - 1] === true) {
          weeklyPresentData[days[date.getDay()]] += 1;
        }
      }
    }
  });
  user.forEach((data) => {
    if (data.gender === "Male") {
      genderData["male"] += 1;
    } else {
      genderData["female"] += 1;
    }
  });
  // count of total employee
  const total_user = user.length;

  //count leave of individual employee
  let userLeavesData = [];
  let AllUser = [];
  for (let k = 0; k < user.length; k++) {
    userLeavesData.push({
      [user[k].email]: {
        "sick leave": 0,
        "casual leave": 0,
        "privilege leave": 0,
      },
    });
    AllUser.push(user[k].email);
  }
  for (let m = 0; m < leaves.length; m++) {
    if (leaves[m].status === "confirm") {
      if (AllUser.indexOf(leaves[m].email)) {
        if (leaves[m].typeOfDay === "fullday") {
          userLeavesData[AllUser.indexOf(leaves[m].email)][leaves[m].email][
            leaves[m].typeOfLeave
          ] += getBusinessDateCount(
            new Date(leaves[m].startDate),
            new Date(leaves[m].endDate)
          );
        } else if (leaves[m].typeOfDay === "halfday") {
          userLeavesData[AllUser.indexOf(leaves[m].email)][leaves[m].email][
            leaves[m].typeOfLeave
          ] +=
            getBusinessDateCount(
              new Date(leaves[m].startDate),
              new Date(leaves[m].endDate)
            ) / 2;
        }
      }
    }
  }
  res
    .status(200)
    .json({ total_user, weeklyPresentData, genderData, userLeavesData });
});

//employee dashboard
// Get single user (admin)
exports.getUserDashboardData = catchAysncError(async (req, res, next) => {
  const email = req.user.email;
  const user = await User.findOne({ email });

  // let attendanceMonthObj = [];
  // if (user.active === true) {
  //   for (let i = 0; i < user.attendance.length; i++) {
  //     attendanceMonthObj.push(
  //       ...Object.getOwnPropertyNames(user.attendance[i])
  //     );
  //     if (attendanceMonthObj[i] === key) {
  //       user.attendance.splice(i, 1);
  //     }
  //   }
  // }
  const allLeaves = await Leaves.find({ email });

  res.status(200).json({
    success: true,
    user,
    allLeaves,
  });
});
