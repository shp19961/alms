const ForgetAttendance = require("../model/forgetAttendanceModel");
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

var getDateArray = function (start, end) {
  var arr = new Array();
  var dt = new Date(start);
  while (dt <= end) {
    if (dt.getDay() !== 0) {
      if (dt.getDay() !== 6) {
        arr.push(new Date(dt));
      }
    }
    dt.setDate(dt.getDate() + 1);
  }
  return arr;
};

//apply for leave
exports.applyforgetAttendance = catchAysncError(async (req, res, next) => {
  const { forgetType, dates, messages } = req.body;
  if (!forgetType || !dates || !messages) {
    return next(new ErrorHandler("Fill all the field please", 400));
  }

  let AllForgotDate = [];
  if (forgetType === "Multiple") {
    dates.forEach((perDate) => {
      AllForgotDate.push(new Date(perDate).toDateString());
    });
  } else if (forgetType === "Sequential") {
    const startDate = new Date(dates[0]);
    const endDate = new Date(dates[1]);
    let applyDates = getDateArray(startDate, endDate);
    applyDates.forEach((perDate) => {
      AllForgotDate.push(new Date(perDate).toDateString());
    });
  }

  //for leaves check
  const forgotAttendance = await ForgetAttendance.find({
    email: req.user.email,
  });

  //for forgot Attendance check
  for (let x = 0; x < forgotAttendance.length; x++) {
    if (
      forgotAttendance[x].status === "confirm" ||
      forgotAttendance[x].status === "processing..."
    ) {
      let ForgotDateArray = [];
      if (forgotAttendance[x].forgetType === "Multiple") {
        forgotAttendance[x].dates.forEach((perDate) => {
          ForgotDateArray.push(new Date(perDate).toDateString());
        });
      } else if (forgotAttendance[x].forgetType === "Sequential") {
        const startDate = new Date(forgotAttendance[x].dates[0]);
        const endDate = new Date(forgotAttendance[x].dates[1]);
        let applyDates = getDateArray(startDate, endDate);
        applyDates.forEach((perDate) => {
          ForgotDateArray.push(new Date(perDate).toDateString());
        });
      }
      let isExist = false;
      ForgotDateArray.forEach((perDate) => {
        if (AllForgotDate.indexOf(new Date(perDate).toDateString()) >= 0) {
          isExist = new Date(perDate).toDateString();
        }
      });
      if (isExist) {
        return next(
          new ErrorHandler(
            `You already applied on ${isExist} for attendance`,
            400
          )
        );
      }
    }
  }

  //for leaves check
  const leave = await Leaves.find({ email: req.user.email });
  for (let i = 0; i < leave.length; i++) {
    if (leave[i].status === "confirm" || leave[i].status === "processing...") {
      const leaveDateArray = getDateArray(
        new Date(leave[i].startDate),
        new Date(leave[i].endDate)
      );
      let isExist = false;
      leaveDateArray.forEach((perDate) => {
        if (AllForgotDate.indexOf(new Date(perDate).toDateString()) >= 0) {
          isExist = new Date(perDate).toDateString();
        }
      });
      if (isExist) {
        return next(
          new ErrorHandler(
            `You already applied for ${isExist} for ${leave[i].typeOfLeave}`,
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
      const compareReimHolidayDate = AllForgotDate.indexOf(
        new Date(reimbursement[j].holidayDate).toDateString()
      );
      const compareReimTakenDate = AllForgotDate.indexOf(
        new Date(reimbursement[j].leaveTakenDate).toDateString()
      );

      if (compareReimHolidayDate >= 0) {
        return next(
          new ErrorHandler(
            `You already applied on ${reimbursement[j].holidayDate} for Comp-Off`,
            400
          )
        );
      } else if (compareReimTakenDate > 0) {
        return next(
          new ErrorHandler(
            `You already taken leave on ${reimbursement[j].leaveTakenDate} for Comp-Off`,
            400
          )
        );
      }
    }
  }
  const forgetAttendanceData = {
    email: req.user.email,
    fName: req.user.fName,
    lName: req.user.lName,
    forgetType,
    dates,
    messages,
  };
  await ForgetAttendance.create(forgetAttendanceData);
  res.status(200).json({
    success: true,
  });
});

exports.userForgetAttendance = catchAysncError(async (req, res, next) => {
  const resultPerPage = 10;
  const forgetAttendanceCount = await ForgetAttendance.countDocuments({
    email: req.user.email,
  });
  const apiFeature = new ApiFeatures(
    ForgetAttendance.find({ clone: false, email: req.user.email }),
    req.query
  )
    .search()
    .filter();

  apiFeature.paginationLeaves(resultPerPage);

  let forgetAttendance = await apiFeature.query;
  let filteredForgotAttendaceCount = forgetAttendance.length;
  res.status(200).json({
    forgetAttendance,
    filteredForgotAttendaceCount,
    resultPerPage,
    forgetAttendanceCount,
  });
});

exports.getforgetAttendanceRequest = catchAysncError(async (req, res, next) => {
  // const date = +new Date();
  // req.query.moveToOld = { gte: date };
  const resultPerPage = 10;
  let forgetAttendance = await ForgetAttendance.find();
  forgetAttendanceCount = forgetAttendance.length;
  // for (let j = 0; j < forgetAttendance.length; j++) {
  //   if (forgetAttendance[j].moveToOld > date) {
  //     forgetAttendanceCount += 1;
  //   }
  // }
  const apiFeature = new ApiFeatures(
    ForgetAttendance.find({ clone: false }),
    req.query
  )
    .search()
    .filter();

  apiFeature.paginationLeaves(resultPerPage);

  forgetAttendance = await apiFeature.query;
  let filteredForgetAttendanceCount = forgetAttendance.length;
  // let adminReq = [];
  // for (let i = 0; i < forgetAttendance.length; i++) {
  //   if (forgetAttendance[i].moveToOld > date) {
  //     adminReq.push(forgetAttendance[i]);
  //   }
  // }
  res.status(200).json({
    forgetAttendance,
    filteredForgetAttendanceCount,
    resultPerPage,
    forgetAttendanceCount,
  });
});

// //get all old request
// exports.getOldLeaveRequest = catchAysncError(async (req, res, next) => {
//   const date = +new Date();
//   req.query.moveToOld = { lte: date };
//   const resultPerPage = 10;
//   let leaves = await Leaves.find();
//   leavesCount = 0;
//   for (let j = 0; j < leaves.length; j++) {
//     if (leaves[j].moveToOld < date) {
//       leavesCount += 1;
//     }
//   }
//   const apiFeature = new ApiFeatures(Leaves.find({ clone: false }), req.query)
//     .search()
//     .filter();

//   apiFeature.paginationLeaves(resultPerPage);

//   leaves = await apiFeature.query;
//   let filteredUsersCount = leaves.length;

//   let adminReq = [];
//   for (let i = 0; i < leaves.length; i++) {
//     if (leaves[i].moveToOld < date) {
//       adminReq.push(leaves[i]);
//     }
//   }
//   res
//     .status(200)
//     .json({ adminReq, filteredUsersCount, resultPerPage, leavesCount });
// });

exports.updateStatusOfForgetAttendance = catchAysncError(
  async (req, res, next) => {
    const { id, status, disabledEdit, matchDisabledEdit } = req.body;
    let forgetAttendanceId = await ForgetAttendance.findById(id);
    if (!forgetAttendanceId) {
      return next(new ErrorHandler("Leave not found", 400));
    }
    // return;

    if (
      forgetAttendanceId.status === "confirm" ||
      forgetAttendanceId.status === "denied"
    ) {
      if (forgetAttendanceId.disabledEdit === Number(matchDisabledEdit)) {
        forgetAttendanceId.status = status;
      }
    } else {
      forgetAttendanceId.status = status;
      forgetAttendanceId.disabledEdit = disabledEdit;
    }

    //user attendance details
    let user = await User.findOne({ email: forgetAttendanceId.email });
    let applyDates;

    //set loop dates
    if (forgetAttendanceId.forgetType === "Multiple") {
      applyDates = forgetAttendanceId.dates;
    } else if (forgetAttendanceId.forgetType === "Sequential") {
      const startDate = new Date(forgetAttendanceId.dates[0]);
      const endDate = new Date(forgetAttendanceId.dates[1]);
      applyDates = getDateArray(startDate, endDate);
    }

    applyDates.forEach((fd) => {
      const forgetDate = new Date(fd);
      let key = `${months[forgetDate.getMonth()]}${forgetDate.getFullYear()}`;
      let monthObj = [];
      for (let i = 0; i < user.attendance.length; i++) {
        monthObj.push(...Object.keys(user.attendance[i]));
      }
      let indexOfMonth = monthObj.indexOf(key);
      if (indexOfMonth === -1) {
        user.attendance.push({
          [key]: new Array(
            new Date(
              forgetDate.getFullYear(),
              forgetDate.getMonth() + 1,
              0
            ).getDate()
          ).fill(false),
        });
        user.attendance[user.attendance.length - 1][key][
          forgetDate.getDate() - 1
        ] = forgetAttendanceId.status === "confirm" ? true : false;
      } else if (indexOfMonth > -1) {
        user.attendance[indexOfMonth][key][forgetDate.getDate() - 1] =
          forgetAttendanceId.status === "confirm" ? true : false;
      }
    });

    await User.findByIdAndUpdate(
      { _id: user._id },
      { attendance: user.attendance },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
    await forgetAttendanceId.save();
    res.status(200).json("Leave updated");
  }
);

// //get all users leaves
// exports.getAllUserleaves = catchAysncError(async (req, res, next) => {
//   let leaves = await Leaves.find({ status: "confirm" });
//   res.status(200).json(leaves);
// });

// //get single user leaves
// exports.getUserleaves = catchAysncError(async (req, res, next) => {
//   let leaves = await Leaves.find({ email: req.user.email });
//   res.status(200).json(leaves);
// });
