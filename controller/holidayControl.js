const Holiday = require("../model/holidayModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
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

exports.createHoliday = catchAsyncError(async (req, res, next) => {
  const holidayArray = req.body;
  holidayData = {};
  holidayData[new Date().getFullYear()] = {
    January: [],
    February: [],
    March: [],
    April: [],
    May: [],
    June: [],
    July: [],
    August: [],
    September: [],
    October: [],
    November: [],
    December: [],
  };
  const holidayDataObj = Object.getOwnPropertyNames(
    holidayData[new Date().getFullYear()]
  );
  for (let i = 0; i < holidayArray.length; i++) {
    const date = new Date(holidayArray[i].date);
    if (date.getFullYear() === new Date().getFullYear()) {
      for (let j = 0; j < holidayDataObj.length; j++) {
        if (`${months[date.getMonth()]}` === holidayDataObj[j]) {
          holidayData[new Date().getFullYear()][holidayDataObj[j]].push({
            date: date.getDate(),
            occasion: holidayArray[i].occasion,
          });
        }
      }
    } else {
      return next(new ErrorHandler("Only want current year dates"));
    }
  }
  let holiday = await Holiday.find();
  if (holiday.length > 0) {
    for (let m = 0; m < holiday.length; m++) {
      const yearObj = Object.keys(holiday[m].holidayData);
      const reqYearObj = Object.keys(holidayData);
      if (yearObj[0] === reqYearObj[0]) {
        await Holiday.deleteOne({ _id: holiday[m]._id });
        holiday = await Holiday.create({ holidayData });
      } else if (m === holiday.length - 1) {
        holiday = await Holiday.create({ holidayData });
      }
    }
  } else {
    holiday = await Holiday.create({ holidayData });
  }

  res.status(400).json({ success: true });
});

exports.getHoliday = catchAsyncError(async (req, res, next) => {
  const holiday = await Holiday.find();
  res.status(200).json(holiday);
});
