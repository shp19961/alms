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
const logoutUser = async () => {
  const res = await fetch("/api/v2/user/logout");
  const data = await res.json();
  window.location.href = "/login";
};

const user = async () => {
  const data = await fetch("/api/v2/user/me");
  const { user } = await data.json();
  return user;
};

const userDetail = async () => {
  const res = await fetch("/api/v2/user/dashboard");
  const { error, user, allLeaves } = await res.json();
  return { error, user, allLeaves };
};

const setHeaders = async () => {
  const userUl = document.querySelector(".navbar-nav");
  const userName = document.querySelector(".navbar-brand .user-name-span");
  const userr = await user();

  userName.innerHTML = `${userr.fName} ${userr.lName}`;

  //showing active button
  for (let j = 0; j < userUl.children.length; j++) {
    userUl.children[j].classList.remove("active");
    if (userUl.children[j].children[1]) {
      for (let i = 0; i < userUl.children[j].children[1].children.length; i++) {
        if (
          userUl.children[j].children[1].children[i].children[0].href ===
          window.location.href
        ) {
          userUl.children[j].children[1].children[i].classList.add("active");
          userUl.children[j].classList.add("active");
        }
      }
    } else {
      if (userUl.children[j].children[0].href === window.location.href) {
        userUl.children[j].classList.add("active");
      }
    }
  }
};

setHeaders();

//miss day function
function getMissedDay(array, condition) {
  return array.filter((v) => v === condition).length;
}

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

async function fixDate(date, arrayOfDate) {
  const firstDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ).getDay();
  let weekendDate = [];
  let allAbsent = [];

  let x, y;
  if (firstDate === 0) {
    x = 6;
    y = 0;
  } else if (firstDate === 1) {
    x = 5;
    y = 6;
  } else if (firstDate === 2) {
    x = 4;
    y = 5;
  } else if (firstDate === 3) {
    x = 3;
    y = 4;
  } else if (firstDate === 4) {
    x = 2;
    y = 3;
  } else if (firstDate === 5) {
    x = 1;
    y = 2;
  } else if (firstDate === 6) {
    x = 0;
    y = 1;
  } else {
    console.log("there is some error");
  }
  if (typeof arrayOfDate[0] === "number") {
    for (let i = x; i < arrayOfDate.length; i++) {
      weekendDate.push(arrayOfDate[i]);
      i += 6;
    }
    for (let j = y; j < arrayOfDate.length; j++) {
      weekendDate.push(arrayOfDate[j]);
      j += 6;
    }
  } else {
    for (let i = x; i < arrayOfDate.length; i++) {
      weekendDate.push(i + 1);
      i += 6;
    }
    for (let j = y; j < arrayOfDate.length; j++) {
      weekendDate.push(j + 1);
      j += 6;
    }
  }
  if (typeof arrayOfDate[0] === "number") {
    allAbsent = arrayOfDate;
  } else {
    for (let m = 0; m < arrayOfDate.length; m++) {
      if (arrayOfDate[m] === false) {
        allAbsent.push(m + 1);
      }
    }
  }
  for (var m = allAbsent.length - 1; m >= 0; m--) {
    for (var n = 0; n < weekendDate.length; n++) {
      if (allAbsent[m] === weekendDate[n]) {
        allAbsent.splice(m, 1);
      }
    }
  }
  return allAbsent;
}

const diviedLeaveInMonths = async (fstart, fend) => {
  let date = {};
  const start = new Date(fstart);
  const end = new Date(fend);
  if (start.getFullYear() === end.getFullYear()) {
    if (start.getMonth() === end.getMonth()) {
      date[`${months[start.getMonth()]}${start.getFullYear()}`] = [];
      for (let i = start.getDate(); i < end.getDate() + 1; i++) {
        date[`${months[start.getMonth()]}${start.getFullYear()}`].push(i);
      }
      //remove weekend
      await fixDate(
        start,
        date[`${months[start.getMonth()]}${start.getFullYear()}`]
      );
    } else {
      let newEnd = new Date(start.getFullYear(), start.getMonth() + 1, 0);
      let newStart = new Date(end.getFullYear(), end.getMonth(), 1);
      date[`${months[start.getMonth()]}${start.getFullYear()}`] = [];
      date[`${months[end.getMonth()]}${end.getFullYear()}`] = [];
      for (let m = start.getDate(); m <= newEnd.getDate(); m++) {
        date[`${months[start.getMonth()]}${start.getFullYear()}`].push(m);
      }
      //remove weekend
      await fixDate(
        start,
        date[`${months[start.getMonth()]}${start.getFullYear()}`]
      );
      for (let n = newStart.getDate(); n <= end.getDate(); n++) {
        date[`${months[end.getMonth()]}${end.getFullYear()}`].push(n);
      }
      //remove weekend
      await fixDate(
        newStart,
        date[`${months[end.getMonth()]}${end.getFullYear()}`]
      );
    }
  }
  //year not equal
  else if (start.getFullYear() < end.getFullYear()) {
    if (start.getMonth() > end.getMonth()) {
      let newEnd = new Date(start.getFullYear(), start.getMonth() + 1, 0);
      let newStart = new Date(end.getFullYear(), end.getMonth(), 1);
      date[`${months[start.getMonth()]}${start.getFullYear()}`] = [];
      date[`${months[end.getMonth()]}${end.getFullYear()}`] = [];
      for (let m = start.getDate(); m < newEnd.getDate() + 1; m++) {
        date[`${months[start.getMonth()]}${start.getFullYear()}`].push(m);
      }
      //remove weekend
      await fixDate(
        start,
        date[`${months[start.getMonth()]}${start.getFullYear()}`]
      );
      for (let n = newStart.getDate(); n < end.getDate() + 1; n++) {
        date[`${months[end.getMonth()]}${end.getFullYear()}`].push(n);
      }
      //remove weekend
      await fixDate(
        newStart,
        date[`${months[end.getMonth()]}${end.getFullYear()}`]
      );
    }
  }
  return date;
};

const arrayOfLeavesDate = async () => {
  const data = await userDetail();
  const leaves = data.allLeaves;
  let start, end;
  let sickDates = [],
    casualDates = [],
    privilegeDates = [],
    firstSickDates = [],
    firstCasualDates = [],
    firstPrivilegeDates = [],
    secondSickDates = [],
    secondCasualDates = [],
    secondPrivilegeDates = [];
  for (let i = 0; i < leaves.length; i++) {
    if (
      leaves[i].typeOfLeave === "sick leave" &&
      leaves[i].status === "confirm"
    ) {
      start = new Date(leaves[i].startDate);
      end = new Date(leaves[i].endDate);
      sickDates.push(await diviedLeaveInMonths(start, end));
      if (
        leaves[i].typeOfDay === "halfday" &&
        leaves[i].employeeHalf === "firstHalf"
      ) {
        firstSickDates.push(await diviedLeaveInMonths(start, end));
      } else if (
        leaves[i].typeOfDay === "halfday" &&
        leaves[i].employeeHalf === "secondHalf"
      ) {
        secondSickDates.push(await diviedLeaveInMonths(start, end));
      }
    } else if (
      leaves[i].typeOfLeave === "casual leave" &&
      leaves[i].status === "confirm"
    ) {
      start = new Date(leaves[i].startDate);
      end = new Date(leaves[i].endDate);
      casualDates.push(await diviedLeaveInMonths(start, end));
      if (
        leaves[i].typeOfDay === "halfday" &&
        leaves[i].employeeHalf === "firstHalf"
      ) {
        firstCasualDates.push(await diviedLeaveInMonths(start, end));
      } else if (
        leaves[i].typeOfDay === "halfday" &&
        leaves[i].employeeHalf === "secondHalf"
      ) {
        secondCasualDates.push(await diviedLeaveInMonths(start, end));
      }
    } else if (
      leaves[i].typeOfLeave === "privilege leave" &&
      leaves[i].status === "confirm"
    ) {
      start = new Date(leaves[i].startDate);
      end = new Date(leaves[i].endDate);
      privilegeDates.push(await diviedLeaveInMonths(start, end));
      if (
        leaves[i].typeOfDay === "halfday" &&
        leaves[i].employeeHalf === "firstHalf"
      ) {
        firstPrivilegeDates.push(await diviedLeaveInMonths(start, end));
      } else if (
        leaves[i].typeOfDay === "halfday" &&
        leaves[i].employeeHalf === "secondHalf"
      ) {
        secondPrivilegeDates.push(await diviedLeaveInMonths(start, end));
      }
    }
  }
  for (let k = 1; k < sickDates.length; k++) {
    let data = Object.keys(sickDates[0]);
    let nextData = Object.keys(sickDates[k]);
    for (let m = 0; m < data.length; m++) {
      for (let n = 0; n < nextData.length; n++) {
        if (data[m] === nextData[n]) {
          sickDates[0][nextData[n]].push(...sickDates[k][nextData[n]]);
        }
        if (data.indexOf(nextData[n]) === -1) {
          sickDates[0][nextData[n]] = sickDates[k][nextData[n]];
        }
      }
    }
  }

  for (let k = 1; k < firstSickDates.length; k++) {
    let data = Object.keys(firstSickDates[0]);
    let nextData = Object.keys(firstSickDates[k]);
    for (let m = 0; m < data.length; m++) {
      for (let n = 0; n < nextData.length; n++) {
        if (data[m] === nextData[n]) {
          firstSickDates[0][nextData[n]].push(
            ...firstSickDates[k][nextData[n]]
          );
        }
        if (data.indexOf(nextData[n]) === -1) {
          firstSickDates[0][nextData[n]] = firstSickDates[k][nextData[n]];
        }
      }
    }
  }
  for (let k = 1; k < secondSickDates.length; k++) {
    let data = Object.keys(secondSickDates[0]);
    let nextData = Object.keys(secondSickDates[k]);
    for (let m = 0; m < data.length; m++) {
      for (let n = 0; n < nextData.length; n++) {
        if (data[m] === nextData[n]) {
          secondSickDates[0][nextData[n]].push(
            ...secondSickDates[k][nextData[n]]
          );
        }
        if (data.indexOf(nextData[n]) === -1) {
          secondSickDates[0][nextData[n]] = secondSickDates[k][nextData[n]];
        }
      }
    }
  }
  for (let k = 1; k < casualDates.length; k++) {
    let data = Object.keys(casualDates[0]);
    let nextData = Object.keys(casualDates[k]);
    for (let m = 0; m < data.length; m++) {
      for (let n = 0; n < nextData.length; n++) {
        if (data[m] === nextData[n]) {
          casualDates[0][nextData[n]].push(...casualDates[k][nextData[n]]);
        }
        if (data.indexOf(nextData[n]) === -1) {
          casualDates[0][nextData[n]] = casualDates[k][nextData[n]];
        }
      }
    }
  }
  for (let k = 1; k < firstCasualDates.length; k++) {
    let data = Object.keys(firstCasualDates[0]);
    let nextData = Object.keys(firstCasualDates[k]);
    for (let m = 0; m < data.length; m++) {
      for (let n = 0; n < nextData.length; n++) {
        if (data[m] === nextData[n]) {
          firstCasualDates[0][nextData[n]].push(
            ...firstCasualDates[k][nextData[n]]
          );
        }
        if (data.indexOf(nextData[n]) === -1) {
          firstCasualDates[0][nextData[n]] = firstCasualDates[k][nextData[n]];
        }
      }
    }
  }
  for (let k = 1; k < secondCasualDates.length; k++) {
    let data = Object.keys(secondCasualDates[0]);
    let nextData = Object.keys(secondCasualDates[k]);
    for (let m = 0; m < data.length; m++) {
      for (let n = 0; n < nextData.length; n++) {
        if (data[m] === nextData[n]) {
          secondCasualDates[0][nextData[n]].push(
            ...secondCasualDates[k][nextData[n]]
          );
        }
        if (data.indexOf(nextData[n]) === -1) {
          secondCasualDates[0][nextData[n]] = secondCasualDates[k][nextData[n]];
        }
      }
    }
  }
  for (let k = 1; k < privilegeDates.length; k++) {
    let data = Object.keys(privilegeDates[0]);
    let nextData = Object.keys(privilegeDates[k]);
    for (let m = 0; m < data.length; m++) {
      for (let n = 0; n < nextData.length; n++) {
        if (data[m] === nextData[n]) {
          privilegeDates[0][nextData[n]].push(
            ...privilegeDates[k][nextData[n]]
          );
        }
        if (data.indexOf(nextData[n]) === -1) {
          privilegeDates[0][nextData[n]] = privilegeDates[k][nextData[n]];
        }
      }
    }
  }
  for (let k = 1; k < firstPrivilegeDates.length; k++) {
    let data = Object.keys(firstPrivilegeDates[0]);
    let nextData = Object.keys(firstPrivilegeDates[k]);
    for (let m = 0; m < data.length; m++) {
      for (let n = 0; n < nextData.length; n++) {
        if (data[m] === nextData[n]) {
          firstPrivilegeDates[0][nextData[n]].push(
            ...firstPrivilegeDates[k][nextData[n]]
          );
        }
        if (data.indexOf(nextData[n]) === -1) {
          firstPrivilegeDates[0][nextData[n]] =
            firstPrivilegeDates[k][nextData[n]];
        }
      }
    }
  }
  for (let k = 1; k < secondPrivilegeDates.length; k++) {
    let data = Object.keys(secondPrivilegeDates[0]);
    let nextData = Object.keys(secondPrivilegeDates[k]);
    for (let m = 0; m < data.length; m++) {
      for (let n = 0; n < nextData.length; n++) {
        if (data[m] === nextData[n]) {
          secondPrivilegeDates[0][nextData[n]].push(
            ...secondPrivilegeDates[k][nextData[n]]
          );
        }
        if (data.indexOf(nextData[n]) === -1) {
          secondPrivilegeDates[0][nextData[n]] =
            secondPrivilegeDates[k][nextData[n]];
        }
      }
    }
  }
  sickDates = Object.assign({}, sickDates[0]);
  firstSickDates = Object.assign({}, firstSickDates[0]);
  secondSickDates = Object.assign({}, secondSickDates[0]);
  casualDates = Object.assign({}, casualDates[0]);
  firstCasualDates = Object.assign({}, firstCasualDates[0]);
  secondCasualDates = Object.assign({}, secondCasualDates[0]);
  privilegeDates = Object.assign({}, privilegeDates[0]);
  firstPrivilegeDates = Object.assign({}, firstPrivilegeDates[0]);
  secondPrivilegeDates = Object.assign({}, secondPrivilegeDates[0]);

  return {
    sickDates,
    firstSickDates,
    secondSickDates,
    casualDates,
    firstCasualDates,
    secondCasualDates,
    privilegeDates,
    firstPrivilegeDates,
    secondPrivilegeDates,
  };
};

const main = async () => {
  const nameField = document.querySelector("#name");
  const emailField = document.querySelector("#email");
  const shiftField = document.querySelector("#shift");
  const designationField = document.querySelector("#designation");
  const leavesDate = await arrayOfLeavesDate();
  const res = await fetch("/api/v2/admin/holiday");
  const holli = await res.json();
  let holiday = {};
  for (let a = 0; a < holli.length; a++) {
    holiday[Object.keys(holli[a].holidayData)[0]] =
      holli[a].holidayData[Object.keys(holli[a].holidayData)[0]];
  }
  let sickLeave = [],
    firstSickDates = [],
    secondSickDates = [],
    casualLeave = [],
    firstCasualDates = [],
    secondCasualDates = [],
    privilegeLeave = [],
    firstPrivilegeDates = [],
    secondPrivilegeDates = [],
    totalLeaves = [],
    totalSickInYear = 0;
  totalCasualInYear = 0;
  totalPrivilegeInYear = 0;
  const { error, user } = await userDetail();

  //set personal detail
  nameField.innerHTML = `${user.fName} ${user.lName}`;
  emailField.innerHTML = user.email;
  shiftField.innerHTML = user.shiftTiming;
  designationField.innerHTML = user.designation;
  const monthRef = [];
  const totalPresent = [];
  const totalAbsent = [];
  for (let i = 0; i < user.attendance.length; i++) {
    const monthsKey = Object.keys(user.attendance[i])[0];
    const attendanceMonth = monthsKey.slice(0, monthsKey.length - 4);
    const attendanceYear = monthsKey.slice(monthsKey.length - 4);
    const monthStartDate = new Date(
      attendanceYear,
      months.indexOf(attendanceMonth),
      1
    );
    const monthEndDate = new Date(
      attendanceYear,
      months.indexOf(attendanceMonth) + 1,
      0
    );
    //get all month
    monthRef.push(...Object.keys(user.attendance[i]));
    const monthPresent = getMissedDay(
      user.attendance[i][Object.keys(user.attendance[i])],
      true
    );
    //get total present
    totalPresent.push(monthPresent);

    // related to holiday
    const countHoliday = holiday[attendanceYear][attendanceMonth].length;
    let HolidayDate = [];
    for (let b = 0; b < holiday[attendanceYear][attendanceMonth].length; b++) {
      HolidayDate.push(holiday[attendanceYear][attendanceMonth][b].date);
    }

    //updating leave date here

    if (leavesDate.sickDates !== undefined) {
      sickLeave = leavesDate.sickDates;
    }
    if (leavesDate.firstSickDates !== undefined) {
      firstSickDates = leavesDate.firstSickDates;
    }
    if (leavesDate.secondSickDates !== undefined) {
      secondSickDates = leavesDate.secondSickDates;
    }
    if (leavesDate.casualDates !== undefined) {
      casualLeave = leavesDate.casualDates;
    }
    if (leavesDate.firstCasualDates !== undefined) {
      firstCasualDates = leavesDate.firstCasualDates;
    }
    if (leavesDate.secondCasualDates !== undefined) {
      secondCasualDates = leavesDate.secondCasualDates;
    }
    if (leavesDate.privilegeDates !== undefined) {
      privilegeLeave = leavesDate.privilegeDates;
    }
    if (leavesDate.firstPrivilegeDates !== undefined) {
      firstPrivilegeDates = leavesDate.firstPrivilegeDates;
    }
    if (leavesDate.secondPrivilegeDates !== undefined) {
      secondPrivilegeDates = leavesDate.secondPrivilegeDates;
    }

    // remove holiday from sickLeave dates
    const sickObj = Object.getOwnPropertyNames(sickLeave);
    for (let q = 0; q < sickObj.length; q++) {
      if (sickObj[q] === monthsKey) {
        for (var m = sickLeave[sickObj[q]].length - 1; m >= 0; m--) {
          for (var n = 0; n < HolidayDate.length; n++) {
            if (sickLeave[sickObj[q]][m] === HolidayDate[n]) {
              sickLeave[sickObj[q]].splice(m, 1);
            }
          }
        }
      }
    }
    // remove holiday from first Half sickLeave dates
    const firstSickObj = Object.getOwnPropertyNames(firstSickDates);
    for (let q = 0; q < firstSickObj.length; q++) {
      if (firstSickObj[q] === monthsKey) {
        for (var m = sickLeave[firstSickObj[q]].length - 1; m >= 0; m--) {
          for (var n = 0; n < HolidayDate.length; n++) {
            if (sickLeave[firstSickObj[q]][m] === HolidayDate[n]) {
              sickLeave[firstSickObj[q]].splice(m, 1);
            }
          }
        }
      }
    }
    // remove holiday from second Half sickLeave dates
    const secondSickObj = Object.getOwnPropertyNames(secondSickDates);
    for (let q = 0; q < secondSickObj.length; q++) {
      if (secondSickObj[q] === monthsKey) {
        for (var m = sickLeave[secondSickObj[q]].length - 1; m >= 0; m--) {
          for (var n = 0; n < HolidayDate.length; n++) {
            if (sickLeave[secondSickObj[q]][m] === HolidayDate[n]) {
              sickLeave[secondSickObj[q]].splice(m, 1);
            }
          }
        }
      }
    }
    // remove holiday from casualLeave dates
    const casualObj = Object.getOwnPropertyNames(casualLeave);
    for (let q = 0; q < casualObj.length; q++) {
      if (casualObj[q] === monthsKey) {
        for (var m = casualLeave[casualObj[q]].length - 1; m >= 0; m--) {
          for (var n = 0; n < HolidayDate.length; n++) {
            if (casualLeave[casualObj[q]][m] === HolidayDate[n]) {
              casualLeave[casualObj[q]].splice(m, 1);
            }
          }
        }
      }
    }
    // remove holiday from first Half casualLeave dates
    const firstCasualObj = Object.getOwnPropertyNames(firstCasualDates);
    for (let q = 0; q < firstCasualObj.length; q++) {
      if (firstCasualObj[q] === monthsKey) {
        for (var m = casualLeave[firstCasualObj[q]].length - 1; m >= 0; m--) {
          for (var n = 0; n < HolidayDate.length; n++) {
            if (casualLeave[firstCasualObj[q]][m] === HolidayDate[n]) {
              casualLeave[firstCasualObj[q]].splice(m, 1);
            }
          }
        }
      }
    }
    // remove holiday from second Half casualLeave dates
    const secondCasualObj = Object.getOwnPropertyNames(secondCasualDates);
    for (let q = 0; q < secondCasualObj.length; q++) {
      if (secondCasualObj[q] === monthsKey) {
        for (var m = casualLeave[secondCasualObj[q]].length - 1; m >= 0; m--) {
          for (var n = 0; n < HolidayDate.length; n++) {
            if (casualLeave[secondCasualObj[q]][m] === HolidayDate[n]) {
              casualLeave[secondCasualObj[q]].splice(m, 1);
            }
          }
        }
      }
    }
    // remove holiday from privilegeLeave dates
    const privilegeObj = Object.getOwnPropertyNames(privilegeLeave);
    for (let q = 0; q < privilegeObj.length; q++) {
      if (privilegeObj[q] === monthsKey) {
        for (var m = privilegeLeave[privilegeObj[q]].length - 1; m >= 0; m--) {
          for (var n = 0; n < HolidayDate.length; n++) {
            if (privilegeLeave[privilegeObj[q]][m] === HolidayDate[n]) {
              privilegeLeave[privilegeObj[q]].splice(m, 1);
            }
          }
        }
      }
    }
    // remove holiday from first Half privilegeLeave dates
    const firstPrivilegeObj = Object.getOwnPropertyNames(firstPrivilegeDates);
    for (let q = 0; q < firstPrivilegeObj.length; q++) {
      if (firstPrivilegeObj[q] === monthsKey) {
        for (
          var m = privilegeLeave[firstPrivilegeObj[q]].length - 1;
          m >= 0;
          m--
        ) {
          for (var n = 0; n < HolidayDate.length; n++) {
            if (privilegeLeave[firstPrivilegeObj[q]][m] === HolidayDate[n]) {
              privilegeLeave[firstPrivilegeObj[q]].splice(m, 1);
            }
          }
        }
      }
    }
    // remove holiday from second Half privilegeLeave dates
    const secondPrivilegeObj = Object.getOwnPropertyNames(secondPrivilegeDates);
    for (let q = 0; q < secondPrivilegeObj.length; q++) {
      if (secondPrivilegeObj[q] === monthsKey) {
        for (
          var m = privilegeLeave[secondPrivilegeObj[q]].length - 1;
          m >= 0;
          m--
        ) {
          for (var n = 0; n < HolidayDate.length; n++) {
            if (privilegeLeave[secondPrivilegeObj[q]][m] === HolidayDate[n]) {
              privilegeLeave[secondPrivilegeObj[q]].splice(m, 1);
            }
          }
        }
      }
    }
    //if any month not have a leave
    if (sickLeave[monthsKey] === undefined) {
      sickLeave[monthsKey] = [];
    }
    if (firstSickDates[monthsKey] === undefined) {
      firstSickDates[monthsKey] = [];
    }
    if (secondSickDates[monthsKey] === undefined) {
      secondSickDates[monthsKey] = [];
    }

    if (casualLeave[monthsKey] === undefined) {
      casualLeave[monthsKey] = [];
    }
    if (firstCasualDates[monthsKey] === undefined) {
      firstCasualDates[monthsKey] = [];
    }
    if (secondCasualDates[monthsKey] === undefined) {
      secondCasualDates[monthsKey] = [];
    }

    if (privilegeLeave[monthsKey] === undefined) {
      privilegeLeave[monthsKey] = [];
    }
    if (firstPrivilegeDates[monthsKey] === undefined) {
      firstPrivilegeDates[monthsKey] = [];
    }
    if (secondPrivilegeDates[monthsKey] === undefined) {
      secondPrivilegeDates[monthsKey] = [];
    }

    sickLeave[monthsKey] = [
      sickLeave[monthsKey].length,
      firstSickDates[monthsKey].length / 2,
      secondSickDates[monthsKey].length / 2,
    ];
    casualLeave[monthsKey] = [
      casualLeave[monthsKey].length,
      firstCasualDates[monthsKey].length / 2,
      secondCasualDates[monthsKey].length / 2,
    ];
    privilegeLeave[monthsKey] = [
      privilegeLeave[monthsKey].length,
      firstPrivilegeDates[monthsKey].length / 2,
      secondPrivilegeDates[monthsKey].length / 2,
    ];

    //calculating total month leave
    sickLeave[monthsKey] = sickLeave[monthsKey].reduce(
      (privious, curr) => privious + curr
    );
    casualLeave[monthsKey] = casualLeave[monthsKey].reduce(
      (privious, curr) => privious + curr
    );
    privilegeLeave[monthsKey] = privilegeLeave[monthsKey].reduce(
      (privious, curr) => privious + curr
    );

    if (
      Number(monthsKey.substr(monthsKey.length - 4)) ===
      new Date().getFullYear()
    ) {
      totalSickInYear += sickLeave[monthsKey];
      totalCasualInYear += casualLeave[monthsKey];
      totalPrivilegeInYear += privilegeLeave[monthsKey];
    }

    totalAbsent.push(
      getBusinessDateCount(monthStartDate, monthEndDate) -
        monthPresent -
        countHoliday -
        sickLeave[monthsKey] -
        casualLeave[monthsKey] -
        privilegeLeave[monthsKey]
    );

    totalLeaves.push(
      sickLeave[monthsKey] + casualLeave[monthsKey] + privilegeLeave[monthsKey]
    );
  }

  //chart data

  var totalWidth;
  var barthickness = 0;

  function canvasWidthFix(
    perDataWidth,
    spacing,
    numberOfData,
    idOfCanvasParent
  ) {
    totalWidth = (perDataWidth + spacing) * numberOfData;
    barthickness = perDataWidth - spacing;

    document.getElementById(idOfCanvasParent).style.height = "300px";
    return (document.getElementById(idOfCanvasParent).style.width =
      totalWidth + "px");
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function comman({ decide, ctx, type, labels, datasets, options, plugins }) {
    if (decide) {
      decide();
    }
    new Chart(ctx, {
      type,
      data: {
        labels,
        datasets,
      },
      options,
      plugins,
      // plugins: [ChartDataLabels],
    });
  }

  const employeeAttendance = {
    ctx: document.getElementById("employeeAttendance").getContext("2d"),
    type: "bar",
    labels: monthRef,
    datasets: [
      {
        label: "Total Present",
        data: totalPresent,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        barthickness,

        borderWidth: 1,
        datalabels: {
          color: "blue",
          anchor: "end",
          align: "top",
        },
      },
      {
        label: "Total Taken Leave",
        data: totalLeaves,
        backgroundColor: "rgba(175, 162, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        barthickness,

        borderWidth: 1,
        datalabels: {
          color: "blue",
          anchor: "end",
          align: "top",
        },
      },
      {
        label: "Total Absent",
        data: totalAbsent,
        backgroundColor: "rgba(204, 204,255, 1)",
        borderColor: "rgba(75, 192, 192, 1)",
        barthickness,
        borderWidth: 1,
        datalabels: {
          color: "blue",
          anchor: "end",
          align: "top",
        },
      },
    ],
    decide: () =>
      canvasWidthFix(150, 10, monthRef.length, "employeeAttendaceHeader"),
    plugins: [ChartDataLabels],
    options: {
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            display: false,
          },
        },
      },
    },
  };
  const employeeSickDeatils = {
    ctx: document.getElementById("employeeSickLeaves").getContext("2d"),
    type: "doughnut",
    labels: ["Taken", "Remaining"],
    datasets: [
      {
        data: [totalSickInYear, 6 - totalSickInYear],
        backgroundColor: ["rgba(0, 0, 128, 0.6)", "rgba(0, 128, 128, 0.6)"],
        borderColor: ["rgba(0, 0, 128, 0.6)", "rgba(0, 128, 128, 0.6)"],
        barthickness,

        borderWidth: 1,
      },
    ],
    options: {
      maintainAspectRatio: false,
    },
  };

  const employeeCasualDeatils = {
    ctx: document.getElementById("employeeCasualLeaves").getContext("2d"),
    type: "pie",
    labels: ["Taken", "Remaining"],
    datasets: [
      {
        data: [totalCasualInYear, 6 - totalCasualInYear],
        backgroundColor: ["rgba(255, 0, 255, 0.6)", "rgba(0, 0, 255, 0.6)"],
        borderColor: ["rgba(255, 0, 255, 0.6)", "rgba(0, 0, 255, 0.6)"],
        barthickness,

        borderWidth: 1,
      },
    ],
    options: {
      maintainAspectRatio: false,
    },
  };

  const employeePrivilegeDeatils = {
    ctx: document.getElementById("employeePrivilegeLeaves").getContext("2d"),
    type: "doughnut",
    labels: ["Taken", "Remaining"],
    datasets: [
      {
        data: [totalPrivilegeInYear, 12 - totalPrivilegeInYear],
        backgroundColor: ["rgba(0, 255, 0, 0.6)", "rgba(255, 255, 0, 0.6)"],
        borderColor: ["rgba(0, 255, 0, 0.6)", "rgba(255, 255, 0, 0.6)"],
        barthickness,

        borderWidth: 1,
      },
    ],
    options: {
      maintainAspectRatio: false,
    },
  };

  comman(employeeAttendance);
  comman(employeeSickDeatils);
  comman(employeeCasualDeatils);
  comman(employeePrivilegeDeatils);
};

main();

const sickChart = document.querySelector("#sickLeavesMainDiv");
const casualChart = document.querySelector("#casualLeavesMainDiv");
const privilegeChart = document.querySelector("#privilegeLeavesMainDiv");

document.querySelectorAll(".leave-data-types").forEach((leave) => {
  leave.addEventListener("click", () => {
    leave.parentElement.children[0].classList.remove("activeLeaveChart");
    leave.parentElement.children[1].classList.remove("activeLeaveChart");
    leave.parentElement.children[2].classList.remove("activeLeaveChart");
    leave.classList.add("activeLeaveChart");
    if (leave.innerHTML === "Sick Leave") {
      sickChart.classList.remove("hide");
      casualChart.classList.add("hide");
      privilegeChart.classList.add("hide");
    } else if (leave.innerHTML === "Casual Leave") {
      leave.classList.add("activeLeaveChart");
      sickChart.classList.add("hide");
      casualChart.classList.remove("hide");
      privilegeChart.classList.add("hide");
    } else if (leave.innerHTML === "Privilege Leave") {
      sickChart.classList.add("hide");
      casualChart.classList.add("hide");
      privilegeChart.classList.remove("hide");
    }
  });
});
