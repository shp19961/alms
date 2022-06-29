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

const userDetail = async (email) => {
  const res = await fetch("/api/v2/admin/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  const { error, user, allLeaves, AllReimbursement } = await res.json();
  return { error, user, allLeaves, AllReimbursement };
};

const setHeaders = async () => {
  const userUl = document.querySelector(".navbar-nav");
  const userName = document.querySelector(".navbar-brand .user-name-span");
  const userr = await user();
  if (userr.role === "admin") {
    userName.innerHTML = `${userr.fName} ${userr.lName} (Admin)`;
  }
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

const checkUser = async (setUser) => {
  const setEmail = document.querySelector("#email").value;
  const errorRef = document.querySelector("#error");
  const Allcontainer = document.querySelector(".all-container");
  if (setUser) {
    email = setUser;
  } else {
    email = setEmail;
  }

  const { error, user, allLeaves } = await userDetail(email);
  if (error) {
    return (errorRef.innerHTML = error);
  }
  if (user) {
    Allcontainer.innerHTML = `
    <div class="userTitle-outer">
        <div class="userTitle">
        </div>
        <div class="joining-date">
        </div>
      </div>

      <div class="main-container">
        <div class="left-main-container">

          <div class="full-form">
            <p>SL = <span>Sick Leave</span></p>
            <p>CL = <span>Casual Leave</span></p>
            <p>PL = <span>Privilege Leave</span></p>
            <p>FH = <span>First Half</span></p>
            <p>SH = <span>Second Half</span></p>
          </div>
          <div class="attendance-container">
            <h3>Attendances</h3>
            <table>

              <head>
                <tr>
                  <th>Month</th>
                  <th>Total Working Dates</th>
                  <th>Total Present</th>
                  <th>Total Absent</th>
                  <th>Absent Dates</th>
                  <th>SL Dates</th>
                  <th>CL Dates</th>
                  <th>PL Dates</th>
                </tr>
              </head>
              <tbody class="attendance-data">

              </tbody>
            </table>
          </div>
          <hr />
          <div class="leaves-container">
            <h3>Leaves</h3>
            <table>

              <head>
                <tr>
                  <th>Sr. No.</th>
                  <th>Type Of Leave</th>
                  <th>Shift</th>
                  <th>FullDay/HalfDay</th>
                  <th>1<sup>st</sup>Half / 2<sup>nd</sup>Half</th>
                  <th>Dates</th>
                  <th>Reason Of Leave</th>
                  <th>Status</th>
                </tr>
              </head>
              <tbody class="leaves-data">

              </tbody>
            </table>
          </div>
          <div class="leaves-container">
            <h3>Comp Off</h3>
            <table>

              <head>
                <tr>
                  <th>Sr. No.</th>
                  <th>Holiday Date</th>
                  <th>Leave Taken Date</th>
                  <th>Status</th>
                </tr>
              </head>
              <tbody class="reimbursement-data">
              </tbody>
            </table>
          </div>
        </div>
      </div>`;
    main(email);
  }
};

// showing data when its come from dashbord
if (location.search.length > 1) {
  checkUser(location.search.slice(8));
}

//miss day function
function getMissedDay(array) {
  return array.filter((v) => v === true).length;
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

const arrayOfLeavesDate = async (email) => {
  const data = await userDetail(email);
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

const main = async (email) => {
  const userTitle = document.querySelector(".userTitle");
  const joiningDate = document.querySelector(".joining-date");
  const attendanceData = document.querySelector(".attendance-data");
  const leavesData = document.querySelector(".leaves-data");
  const reimbursementData = document.querySelector(".reimbursement-data");
  const leavesDate = await arrayOfLeavesDate(email);
  const data = await userDetail(email);
  const user = data.user;
  const leaves = data.allLeaves;
  const reimbursement = data.AllReimbursement;
  const res = await fetch("/api/v2/admin/holiday");
  const holli = await res.json();
  let holiday = {};
  for (let a = 0; a < holli.length; a++) {
    holiday[Object.keys(holli[a].holidayData)[0]] =
      holli[a].holidayData[Object.keys(holli[a].holidayData)[0]];
  }
  userTitle.innerHTML = `<p>Name: <span>${user.fName} ${user.lName}</span></p>
    <p>Email Id: <span>${user.email}</span></p>
    <p>Shift: <span>${user.shiftTiming}</span></p>
    <p>Gender: <span>${user.gender}</span></p>
          <p>Designation: <span>${user.designation}</span></p>`;
  joiningDate.innerHTML = `<p>Joining Date: <span>${
    user.joiningDate ? user.joiningDate : "No Data"
  }</span></p>
  ${
    user.active === true
      ? "<p class='green'>Employee Status"
      : "<p class='red'>Exit Date"
  }:<span>${user.active === true ? "Active" : user.leavingDate}</span></p>`;

  //count attendance
  for (let i = 0; i < user.attendance.length; i++) {
    const monthObj = Object.getOwnPropertyNames(user.attendance[i]);

    const attendanceYear = Number(
      monthObj[0].substring(monthObj[0].length - 4)
    );
    const attendanceMonth = monthObj[0].substring(0, monthObj[0].length - 4);

    const startDate = new Date(
      attendanceYear,
      months.indexOf(attendanceMonth),
      1
    );
    const endDate = new Date(
      attendanceYear,
      months.indexOf(attendanceMonth) + 1,
      0
    );
    let absentArray = {};
    absentArray[monthObj[0]] = await fixDate(
      startDate,
      user.attendance[i][monthObj[0]]
    );
    const countHoliday = holiday[attendanceYear][attendanceMonth].length;
    let HolidayDate = [];
    for (let b = 0; b < holiday[attendanceYear][attendanceMonth].length; b++) {
      HolidayDate.push(holiday[attendanceYear][attendanceMonth][b].date);
    }
    // taking reimbursement date
    let reimbursementDate = [];
    for (let d = 0; d < reimbursement.length; d++) {
      if (reimbursement[d].status === "confirm") {
        const takenDate = new Date(reimbursement[d].leaveTakenDate);
        if (attendanceYear === takenDate.getFullYear()) {
          if (attendanceMonth === months[takenDate.getMonth()]) {
            reimbursementDate.push(takenDate.getDate());
          }
        }
      }
    }
    const absentDate = absentArray[monthObj[0]];
    //updating leave date here
    let sickLeave = [],
      firstSickDates = [],
      secondSickDates = [],
      casualLeave = [],
      firstCasualDates = [],
      secondCasualDates = [],
      privilegeLeave = [],
      firstPrivilegeDates = [],
      secondPrivilegeDates = [];
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
      if (sickObj[q] === monthObj[0]) {
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
      if (firstSickObj[q] === monthObj[0]) {
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
      if (secondSickObj[q] === monthObj[0]) {
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
      if (casualObj[q] === monthObj[0]) {
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
      if (firstCasualObj[q] === monthObj[0]) {
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
      if (secondCasualObj[q] === monthObj[0]) {
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
      if (privilegeObj[q] === monthObj[0]) {
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
      if (firstPrivilegeObj[q] === monthObj[0]) {
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
      if (secondPrivilegeObj[q] === monthObj[0]) {
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

    // remove holiday from absent dates
    for (var m = absentDate.length - 1; m >= 0; m--) {
      for (var n = 0; n < HolidayDate.length; n++) {
        if (absentDate[m] === HolidayDate[n]) {
          absentDate.splice(m, 1);
        }
      }
    }
    // remove Reimbursement from absent dates
    for (var m = absentDate.length - 1; m >= 0; m--) {
      for (var n = 0; n < reimbursementDate.length; n++) {
        if (absentDate[m] === reimbursementDate[n]) {
          absentDate.splice(m, 1);
        }
      }
    }

    //remove sick leave date from absent date
    const absentObj = Object.getOwnPropertyNames(absentArray);
    for (let x = 0; x < sickObj.length; x++) {
      if (absentObj[0] === sickObj[x]) {
        for (var m = absentArray[monthObj[0]].length - 1; m >= 0; m--) {
          for (var n = 0; n < sickLeave[monthObj[0]].length; n++) {
            if (absentArray[monthObj[0]][m] === sickLeave[monthObj[0]][n]) {
              absentArray[monthObj[0]].splice(m, 1);
            }
          }
        }
      }
    }
    //remove casual leave date from absent date
    for (let x = 0; x < casualObj.length; x++) {
      if (absentObj[0] === casualObj[x]) {
        for (var m = absentArray[monthObj[0]].length - 1; m >= 0; m--) {
          for (var n = 0; n < casualLeave[monthObj[0]].length; n++) {
            if (absentArray[monthObj[0]][m] === casualLeave[monthObj[0]][n]) {
              absentArray[monthObj[0]].splice(m, 1);
            }
          }
        }
      }
    }
    //remove privilege leave date from absent date
    for (let x = 0; x < privilegeObj.length; x++) {
      if (absentObj[0] === privilegeObj[x]) {
        for (var m = absentArray[monthObj[0]].length - 1; m >= 0; m--) {
          for (var n = 0; n < privilegeLeave[monthObj[0]].length; n++) {
            if (
              absentArray[monthObj[0]][m] === privilegeLeave[monthObj[0]][n]
            ) {
              absentArray[monthObj[0]].splice(m, 1);
            }
          }
        }
      }
    }

    //remove half sick leave from sick leave
    if (sickLeave[monthObj[0]] !== undefined) {
      if (firstSickDates[monthObj[0]] !== undefined) {
        for (var m = sickLeave[monthObj[0]].length - 1; m >= 0; m--) {
          for (var n = 0; n < firstSickDates[monthObj[0]].length; n++) {
            if (sickLeave[monthObj[0]][m] === firstSickDates[monthObj[0]][n]) {
              sickLeave[monthObj[0]].splice(m, 1);
            }
          }
        }
      }
      if (secondSickDates[monthObj[0]] !== undefined) {
        for (var m = sickLeave[monthObj[0]].length - 1; m >= 0; m--) {
          for (var n = 0; n < secondSickDates[monthObj[0]].length; n++) {
            if (sickLeave[monthObj[0]][m] === secondSickDates[monthObj[0]][n]) {
              sickLeave[monthObj[0]].splice(m, 1);
            }
          }
        }
      }
    }

    //remove half casual leave from casual leave
    if (casualLeave[monthObj[0]] !== undefined) {
      if (firstCasualDates[monthObj[0]] !== undefined) {
        for (var m = casualLeave[monthObj[0]].length - 1; m >= 0; m--) {
          for (var n = 0; n < firstCasualDates[monthObj[0]].length; n++) {
            if (
              casualLeave[monthObj[0]][m] === firstCasualDates[monthObj[0]][n]
            ) {
              casualLeave[monthObj[0]].splice(m, 1);
            }
          }
        }
      }
      if (secondCasualDates[monthObj[0]] !== undefined) {
        for (var m = casualLeave[monthObj[0]].length - 1; m >= 0; m--) {
          for (var n = 0; n < secondCasualDates[monthObj[0]].length; n++) {
            if (
              casualLeave[monthObj[0]][m] === secondCasualDates[monthObj[0]][n]
            ) {
              casualLeave[monthObj[0]].splice(m, 1);
            }
          }
        }
      }
    }
    //remove half previlege leave from privilege leave
    if (privilegeLeave[monthObj[0]] !== undefined) {
      if (firstPrivilegeDates[monthObj[0]] !== undefined) {
        for (var m = privilegeLeave[monthObj[0]].length - 1; m >= 0; m--) {
          for (var n = 0; n < firstPrivilegeDates[monthObj[0]].length; n++) {
            if (
              privilegeLeave[monthObj[0]][m] ===
              firstPrivilegeDates[monthObj[0]][n]
            ) {
              privilegeLeave[monthObj[0]].splice(m, 1);
            }
          }
        }
      }
      if (secondPrivilegeDates[monthObj[0]] !== undefined) {
        for (var m = privilegeLeave[monthObj[0]].length - 1; m >= 0; m--) {
          for (var n = 0; n < secondPrivilegeDates[monthObj[0]].length; n++) {
            if (
              privilegeLeave[monthObj[0]][m] ===
              secondPrivilegeDates[monthObj[0]][n]
            ) {
              privilegeLeave[monthObj[0]].splice(m, 1);
            }
          }
        }
      }
    }
    //if any month not have a leave
    if (sickLeave[monthObj[0]] === undefined) {
      sickLeave[monthObj[0]] = [];
    }
    if (firstSickDates[monthObj[0]] === undefined) {
      firstSickDates[monthObj[0]] = [];
    }
    if (secondSickDates[monthObj[0]] === undefined) {
      secondSickDates[monthObj[0]] = [];
    }

    if (casualLeave[monthObj[0]] === undefined) {
      casualLeave[monthObj[0]] = [];
    }
    if (firstCasualDates[monthObj[0]] === undefined) {
      firstCasualDates[monthObj[0]] = [];
    }
    if (secondCasualDates[monthObj[0]] === undefined) {
      secondCasualDates[monthObj[0]] = [];
    }

    if (privilegeLeave[monthObj[0]] === undefined) {
      privilegeLeave[monthObj[0]] = [];
    }
    if (firstPrivilegeDates[monthObj[0]] === undefined) {
      firstPrivilegeDates[monthObj[0]] = [];
    }
    if (secondPrivilegeDates[monthObj[0]] === undefined) {
      secondPrivilegeDates[monthObj[0]] = [];
    }

    // if not having any leaves
    if (
      sickLeave[monthObj[0]].length === 0 &&
      firstSickDates[monthObj[0]].length === 0 &&
      secondSickDates[monthObj[0]].length === 0
    ) {
      sickLeave[monthObj[0]] = ["---"];
    }
    if (
      casualLeave[monthObj[0]].length === 0 &&
      firstCasualDates[monthObj[0]].length === 0 &&
      secondCasualDates[monthObj[0]].length === 0
    ) {
      casualLeave[monthObj[0]] = ["---"];
    }
    if (
      privilegeLeave[monthObj[0]].length === 0 &&
      firstPrivilegeDates[monthObj[0]].length === 0 &&
      secondPrivilegeDates[monthObj[0]].length === 0
    ) {
      privilegeLeave[monthObj[0]] = ["---"];
    }
    //geting business days
    const countOfBusinessDay = getBusinessDateCount(startDate, endDate);
    const totalDayInMonth = countOfBusinessDay - countHoliday;
    const totalPresent = getMissedDay(user.attendance[i][monthObj]);
    const totalAbsent = totalDayInMonth - totalPresent;

    attendanceData.innerHTML += `<tr>
        <td>${monthObj[0]}</td>
        <td>${totalDayInMonth}</td>
        <td>${totalPresent}</td>
        <td>${totalAbsent}</td>
        <td>${absentDate.toString()}</td>
        <td>${sickLeave[monthObj[0]]
          .sort(function (a, b) {
            return a - b;
          })
          .toString()} ${
      firstSickDates[monthObj[0]].length !== 0
        ? `FH(${firstSickDates[monthObj[0]].toString()})`
        : ""
    } ${
      secondSickDates[monthObj[0]].length !== 0
        ? `SH(${secondSickDates[monthObj[0]].toString()})`
        : ""
    }</td>
        <td>${casualLeave[monthObj[0]]
          .sort(function (a, b) {
            return a - b;
          })
          .toString()} ${
      firstCasualDates[monthObj[0]].length !== 0
        ? `FH(${firstCasualDates[monthObj[0]].toString()})`
        : ""
    } ${
      secondCasualDates[monthObj[0]].length !== 0
        ? `SH(${secondCasualDates[monthObj[0]].toString()})`
        : ""
    }</td>
        <td>${privilegeLeave[monthObj[0]]
          .sort(function (a, b) {
            return a - b;
          })
          .toString()} ${
      firstPrivilegeDates[monthObj[0]].length !== 0
        ? `FH(${firstPrivilegeDates[monthObj[0]].toString()})`
        : ""
    } ${
      secondPrivilegeDates[monthObj[0]].length !== 0
        ? `SH(${secondPrivilegeDates[monthObj[0]].toString()})`
        : ""
    }</td>
      </tr>`;
  }

  //update leaves
  for (let j = 0; j < leaves.length; j++) {
    leavesData.innerHTML += `<tr>
    <td>${j + 1}</td>
    <td>${leaves[j].typeOfLeave}</td>
    <td>${leaves[j].employeeShift}</td>
    <td>${leaves[j].typeOfDay}</td>
    <td>
      ${leaves[j].typeOfDay == "halfday" ? `${leaves[j].employeeHalf}` : "--"}
    </td>
    <td>
      <p>${leaves[j].startDate}</p>
      To
      <p>${leaves[j].endDate}</p>
    </td>
    
    <td>${leaves[j].message}</td>
    <td class="statusText">${leaves[j].status}</td>
    </tr>`;
  }
  // update reimbursement leaves
  for (let k = 0; k < reimbursement.length; k++) {
    reimbursementData.innerHTML += `<tr>
    <td>${k + 1}</td>
        <td>${reimbursement[k].holidayDate}</td>
        <td>${reimbursement[k].leaveTakenDate}</td>
        <td>${reimbursement[k].status}</td>
      </tr>`;
  }
};
