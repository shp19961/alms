const Leaves = require("../model/usersLeaveModel");
const Reimbursement = require("../model/reimbursementModel");
const User = require("../model/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAysncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");
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

//get all date beetween 2 dates
function dateRange(startDate, endDate, steps = 1) {
  const dateArray = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dateArray.push(new Date(currentDate).toDateString());
    // Use UTC date to prevent problems with time zones and DST
    currentDate.setUTCDate(currentDate.getUTCDate() + steps);
  }

  return dateArray;
}

//apply for leave
exports.applyLeaves = catchAysncError(async (req, res, next) => {
  const {
    startDate,
    endDate,
    typeOfLeave,
    message,
    typeOfDay,
    employeeShift,
    employeeHalf,
  } = req.body;
  if (!startDate || !endDate || !typeOfLeave || !message) {
    return next(new ErrorHandler("Fill all the field please", 400));
  }
  if (!employeeShift) {
    return next(new ErrorHandler("Please select the shift", 400));
  }
  //for leaves check
  const leave = await Leaves.find({ email: req.user.email });
  let compareStartDate = new Date(startDate);
  let compareEndDate = new Date(endDate);
  for (let i = 0; i < leave.length; i++) {
    if (leave[i].status === "confirm" || leave[i].status === "processing...") {
      const saveDates = dateRange(leave[i].startDate, leave[i].endDate);
      if (saveDates.indexOf(compareStartDate.toDateString()) !== -1) {
        return next(
          new ErrorHandler(
            `You already applied for ${startDate} for ${leave[i].typeOfLeave}`,
            400
          )
        );
      } else if (saveDates.indexOf(compareEndDate.toDateString()) !== -1) {
        return next(
          new ErrorHandler(
            `You already applied for ${endDate} for ${leave[i].typeOfLeave}`,
            400
          )
        );
      }
    }
  }
  // for reimbursement check
  const reimbursement = await Reimbursement.find({ email: req.user.email });
  for (let j = 0; j < reimbursement.length; j++) {
    if (
      reimbursement[j].status === "confirm" ||
      reimbursement[j].status === "processing..."
    ) {
      const reimHolidayDate = new Date(reimbursement[j].holidayDate);
      const reimTakenDate = new Date(reimbursement[j].leaveTakenDate);
      if (
        reimHolidayDate.toDateString() === compareStartDate.toDateString() ||
        reimTakenDate.toDateString() === compareStartDate.toDateString()
      ) {
        return next(
          new ErrorHandler(
            `You already applied for ${startDate} for Comp-Off`,
            400
          )
        );
      } else if (
        reimHolidayDate.toDateString() === compareEndDate.toDateString() ||
        reimTakenDate.toDateString() === compareEndDate.toDateString()
      ) {
        return next(
          new ErrorHandler(
            `You already applied for ${endDate} for Comp-Off`,
            400
          )
        );
      }
    }
  }
  const leavesData = {
    email: req.user.email,
    fName: req.user.fName,
    lName: req.user.lName,
    startDate,
    endDate,
    message,
    typeOfLeave,
    typeOfDay,
    employeeShift,
  };
  if (typeOfDay === "halfday") {
    leavesData.employeeHalf = employeeHalf;
  }
  await Leaves.create(leavesData);
  res.status(200).json({
    success: true,
  });
});

exports.userLeaves = catchAysncError(async (req, res, next) => {
  const resultPerPage = 10;
  const leavesCount = await Leaves.countDocuments({ email: req.user.email });
  const apiFeature = new ApiFeatures(
    Leaves.find({ clone: false, email: req.user.email }),
    req.query
  )
    .search()
    .filter();

  apiFeature.paginationLeaves(resultPerPage);

  let leaves = await apiFeature.query;
  let filteredUsersCount = leaves.length;
  res
    .status(200)
    .json({ leaves, filteredUsersCount, resultPerPage, leavesCount });
});

exports.getLeaveRequest = catchAysncError(async (req, res, next) => {
  const date = +new Date();
  req.query.moveToOld = { gte: date };
  const resultPerPage = 10;
  let leaves = await Leaves.find();
  leavesCount = 0;
  for (let j = 0; j < leaves.length; j++) {
    if (leaves[j].moveToOld > date) {
      leavesCount += 1;
    }
  }
  const apiFeature = new ApiFeatures(Leaves.find({ clone: false }), req.query)
    .search()
    .filter();

  apiFeature.paginationLeaves(resultPerPage);

  leaves = await apiFeature.query;
  let filteredUsersCount = leaves.length;
  let adminReq = [];
  for (let i = 0; i < leaves.length; i++) {
    if (leaves[i].moveToOld > date) {
      adminReq.push(leaves[i]);
    }
  }
  res
    .status(200)
    .json({ adminReq, filteredUsersCount, resultPerPage, leavesCount });
});

//get all old request
exports.getOldLeaveRequest = catchAysncError(async (req, res, next) => {
  const date = +new Date();
  req.query.moveToOld = { lte: date };
  const resultPerPage = 10;
  let leaves = await Leaves.find();
  leavesCount = 0;
  for (let j = 0; j < leaves.length; j++) {
    if (leaves[j].moveToOld < date) {
      leavesCount += 1;
    }
  }
  const apiFeature = new ApiFeatures(Leaves.find({ clone: false }), req.query)
    .search()
    .filter();

  apiFeature.paginationLeaves(resultPerPage);

  leaves = await apiFeature.query;
  let filteredUsersCount = leaves.length;

  let adminReq = [];
  for (let i = 0; i < leaves.length; i++) {
    if (leaves[i].moveToOld < date) {
      adminReq.push(leaves[i]);
    }
  }
  res
    .status(200)
    .json({ adminReq, filteredUsersCount, resultPerPage, leavesCount });
});

exports.updateStatusOfLeaves = catchAysncError(async (req, res, next) => {
  const { id, status, disabledEdit, matchDisabledEdit } = req.body;
  let leavesId = await Leaves.findById(id);
  if (!leavesId) {
    return next(new ErrorHandler("Leave not found", 400));
  }

  if (leavesId.status === "confirm" || leavesId.status === "denied") {
    if (leavesId.disabledEdit === Number(matchDisabledEdit)) {
      leavesId.status = status;
    }
  } else {
    leavesId.status = status;
    leavesId.disabledEdit = disabledEdit;
  }
  //user attendance details
  let user = await User.findOne({ email: leavesId.email });
  const startDate = new Date(leavesId.startDate);
  const endDate = new Date(leavesId.endDate);
  if (leavesId.status === "confirm") {
    let key = `${months[startDate.getMonth()]}${startDate.getFullYear()}`;
    const attendanceMonth = Object.keys(
      user.attendance[user.attendance.length - 1]
    );
    if (key === attendanceMonth[0]) {
      for (
        let i = 0;
        i < user.attendance[user.attendance.length - 1][key].length;
        i++
      ) {
        if (
          user.attendance[user.attendance.length - 1][key][
            startDate.getDate() - 1
          ] === true
        ) {
          user.attendance[user.attendance.length - 1][key][
            startDate.getDate() - 1
          ] = false;
        }
      }
    }

    await User.findByIdAndUpdate(
      { _id: user._id },
      { attendance: user.attendance },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  }
  await leavesId.save();
  res.status(200).json("Leave updated");
});

//get all users leaves
exports.getAllUserleaves = catchAysncError(async (req, res, next) => {
  let leaves = await Leaves.find({ status: "confirm" });
  res.status(200).json(leaves);
});

//get single user leaves
exports.getUserleaves = catchAysncError(async (req, res, next) => {
  let leaves = await Leaves.find({ email: req.user.email });
  res.status(200).json(leaves);
});
