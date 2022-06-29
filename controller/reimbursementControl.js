const Reimbursement = require("../model/reimbursementModel");
const Leaves = require("../model/usersLeaveModel");
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

//post reimbursement request
exports.postReimbursement = catchAysncError(async (req, res, next) => {
  const { holidayDate, leaveTakenDate } = req.body;
  if (!holidayDate || !leaveTakenDate) {
    return next(new ErrorHandler("Please fill all field", 400));
  }
  // for reimbursement check
  const reimbursement = await Reimbursement.find({ email: req.user.email });
  let compareStartDate = new Date(holidayDate);
  let compareEndDate = new Date(leaveTakenDate);
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
            `You already applied for ${holidayDate} for Comp-Off`,
            400
          )
        );
      } else if (
        reimHolidayDate.toDateString() === compareEndDate.toDateString() ||
        reimTakenDate.toDateString() === compareEndDate.toDateString()
      ) {
        return next(
          new ErrorHandler(
            `You already applied for ${leaveTakenDate} for Comp-Off`,
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
      const saveDates = dateRange(leave[i].startDate, leave[i].endDate);
      if (saveDates.indexOf(compareStartDate.toDateString()) !== -1) {
        return next(
          new ErrorHandler(
            `You already applied for ${holidayDate} for ${leave[i].typeOfLeave}`,
            400
          )
        );
      } else if (saveDates.indexOf(compareEndDate.toDateString()) !== -1) {
        return next(
          new ErrorHandler(
            `You already applied for ${leaveTakenDate} for ${leave[i].typeOfLeave}`,
            400
          )
        );
      }
    }
  }

  const data = {
    email: req.user.email,
    fName: req.user.fName,
    lName: req.user.lName,
    holidayDate,
    leaveTakenDate,
  };

  await Reimbursement.create(data);
  res.status(201).json({ success: true });
});

//user all reimbursement reuqest --- (user req page)
exports.userReimbursementReq = catchAysncError(async (req, res, next) => {
  const resultPerPage = 10;
  const reimbursementCount = await Reimbursement.countDocuments({
    email: req.user.email,
  });
  const apiFeature = new ApiFeatures(
    Reimbursement.find({ clone: false, email: req.user.email }),
    req.query
  )
    .search()
    .filter();

  apiFeature.paginationLeaves(resultPerPage);

  let reimbursement = await apiFeature.query;
  let filteredUsersCount = reimbursement.length;
  res.status(200).json({
    reimbursement,
    resultPerPage,
    filteredUsersCount,
    reimbursementCount,
  });
});

//users all reimbursement reuqest --- (admin req page)
exports.usersReimbursementRequestForUpdate = catchAysncError(
  async (req, res, next) => {
    const resultPerPage = 10;
    const reimbursementCount = await Reimbursement.countDocuments();
    const apiFeature = new ApiFeatures(
      Reimbursement.find({ clone: false }),
      req.query
    )
      .search()
      .filter();

    apiFeature.paginationLeaves(resultPerPage);

    let reimbursement = await apiFeature.query;
    let filteredUsersCount = reimbursement.length;
    res.status(200).json({
      reimbursement,
      resultPerPage,
      filteredUsersCount,
      reimbursementCount,
    });
  }
);

//user all reimbursement reuqest
exports.userReimbursement = catchAysncError(async (req, res, next) => {
  const reimbursement = await Reimbursement.find({ email: req.user.email });
  reimbursement.reverse();
  res.status(200).json(reimbursement);
});

//user all reimbursement reuqest
exports.usersReimbursementRequest = catchAysncError(async (req, res, next) => {
  const reimbursement = await Reimbursement.find();
  reimbursement.reverse();
  res.status(200).json(reimbursement);
});

//update status of reimbursement request
exports.updateStatusOfReimbursement = catchAysncError(
  async (req, res, next) => {
    const { id, status, disabledEdit, matchDisabledEdit } = req.body;
    let reimbursement = await Reimbursement.findById(id);
    if (!reimbursement) {
      return next(new ErrorHandler("Leave not found", 400));
    }

    if (
      reimbursement.status === "confirm" ||
      reimbursement.status === "denied"
    ) {
      if (reimbursement.disabledEdit === Number(matchDisabledEdit)) {
        reimbursement.status = status;
      }
    } else {
      reimbursement.status = status;
      reimbursement.disabledEdit = disabledEdit;
    }

    const holidayD = new Date(reimbursement.holidayDate);
    const leaveTakenD = new Date(reimbursement.leaveTakenDate);
    let Hkey = `${months[holidayD.getMonth()]}${holidayD.getFullYear()}`;
    let key = `${months[leaveTakenD.getMonth()]}${leaveTakenD.getFullYear()}`;
    let user = await User.findOne({ email: reimbursement.email });
    let attendanceMonth = [];
    for (let k = 0; k < user.attendance.length; k++) {
      attendanceMonth.push(...Object.keys(user.attendance[k]));
    }

    for (let j = 0; j < attendanceMonth.length; j++) {
      if (reimbursement.status === "confirm") {
        //for holiday date
        if (Hkey === attendanceMonth[j]) {
          for (let i = 0; i < user.attendance[j][Hkey].length; i++) {
            if (user.attendance[j][Hkey][holidayD.getDate() - 1] === false) {
              user.attendance[j][Hkey][holidayD.getDate() - 1] = true;
            }
          }
        }

        //for leavetaken date
        if (key === attendanceMonth[j]) {
          for (let i = 0; i < user.attendance[j][key].length; i++) {
            if (user.attendance[j][key][leaveTakenD.getDate() - 1] === true) {
              user.attendance[j][key][leaveTakenD.getDate() - 1] = false;
            }
          }
        }
      } else if (reimbursement.status === "denied") {
        //for holiday date
        if (Hkey === attendanceMonth[j]) {
          for (let i = 0; i < user.attendance[j][Hkey].length; i++) {
            if (user.attendance[j][Hkey][holidayD.getDate() - 1] === true) {
              user.attendance[j][Hkey][holidayD.getDate() - 1] = false;
            }
          }
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
    // }
    await reimbursement.save();
    res.status(200).json("Leave granted");
  }
);
