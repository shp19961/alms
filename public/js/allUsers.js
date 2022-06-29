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
let key = `${months[date.getMonth()]}${date.getFullYear()}`;

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
const userData = async (page = 1) => {
  const data = await fetch(`/api/v2/users?page=${page}`);
  const {
    success,
    error,
    users,
    usersCount,
    filteredUsersCount,
    resultPerPage,
  } = await data.json();
  if (error) {
    return (window.location.href = "/login");
  }
  return { users, usersCount, filteredUsersCount, resultPerPage };
};
const AllLeaves = async () => {
  const data = await fetch("/api/v2/users/leaves");
  const leaves = await data.json();
  return leaves;
};
const userList = async (page = 1) => {
  const rowOfUsers = document.querySelectorAll("table .users");
  const userUl = document.querySelector(".navbar-nav");
  const rowOfCheckBox = document.querySelector("table .checkBox-div");
  const rowOfmissed = document.querySelector("table .missed-div");
  const rowOfabsent = document.querySelector("table .absent-div");
  const userName = document.querySelector(".navbar-brand .user-name-span");
  const userdetails = await user();
  if (userdetails.role === "admin") {
    userName.innerHTML = `${userdetails.fName} ${userdetails.lName} (Admin)`;
  }
  const { users, resultPerPage } = await userData(page);
  let srNum = page * resultPerPage - resultPerPage;

  let userRow = ``;
  let checkRow = ``;
  let missedRow = ``;
  let absentRow = ``;
  for (i = 0; i < users.length; i++) {
    userRow += `<tr class="user">
    <td>${srNum + 1}</td>
    <td class="name-col">${users[i].email}</td>
    <td>${users[i].fName}</td>
    <td>${users[i].lName}</td>
  </tr>`;

    //increase sr num
    srNum++;
    checkRow += '<tr class="student"></tr>';
    missedRow += '<tr class="missed-col"><td><span>0</span>%</td></tr>';
    absentRow += `<tr class="absent-col">
    <td class ="absent-td hide">0</td>
    <td class ="sick-td">0</td>
    <td class ="casual-td">0</td>
    <td class ="privilege-td">0</td>
  </tr>`;

    rowOfUsers[0].innerHTML = userRow;
    rowOfCheckBox.innerHTML = checkRow;
    rowOfmissed.innerHTML = missedRow;
    rowOfabsent.innerHTML = absentRow;
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
  renderDate(page);
};

//render Date
const renderDate = (page) => {
  const monthDays = document.querySelector(".calender-table tbody tr");
  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();
  document.querySelector(".container .year").innerHTML = `${
    date.toDateString() === new Date().toDateString() ? `${date.getDate()}` : ``
  }-${months[date.getMonth()]}-${date.getFullYear()}`;
  document.querySelector(".container .m").innerHTML = `Today:`;
  // document.querySelector(".container .year").innerHTML = date.getFullYear();
  // document.querySelector(".container .m").innerHTML = `${
  //   months[date.getMonth()]
  // }-`;
  // document.querySelector(".container .d").innerHTML =
  //   date.toDateString() === new Date().toDateString()
  //     ? `${date.getDate()}-`
  //     : ``;
  const d = new Date();
  const presentDate = `${d.getDate()}-${
    months[d.getMonth()]
  }-${d.getFullYear()}`;
  document.querySelector(".current p").innerHTML =
    new Date().toDateString() !== date.toDateString() ? presentDate : ``;
  let days = ``;
  for (let i = 1; i <= lastDay; i++) {
    days += `<th>${i}</th>`;
    monthDays.innerHTML = days;
  }
  setInput(page);
  fixDate();
};

const setInput = (page) => {
  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();
  const checkBoxDay = document.querySelectorAll("tbody .student");
  let box = ``;
  for (let i = 1; i <= lastDay; i++) {
    box += `<td class="attend-col"><input type="checkbox" /></td>`;
    for (let j = 0; j < checkBoxDay.length; j++) {
      checkBoxDay[j].innerHTML = box;
    }
  }
  setAttendance(page);
};

async function fixDate() {
  const firstDate = new Date(date.getFullYear(), date.getMonth()).getDay();
  const currentDate = new Date().getDate();

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

  const dat = document.querySelectorAll(".calender-table th");
  const studentRows = document.querySelectorAll("tbody .student");
  const email = document.querySelectorAll("tbody .name-col");
  const userdetails = await user();
  const { users } = await userData();
  for (let i = 0; i < studentRows.length; i++) {
    for (let x = 0; x < dat.length; x++) {
      if (userdetails.email !== email[i].innerHTML) {
        studentRows[i].children[x].classList.add("passed");
      }
    }
    //disabled before joining date
    if (users[i].email === email[i].innerHTML) {
      if (users[i].joiningDate) {
        const join = new Date(users[i].joiningDate);
        const currDate = new Date();
        if (
          join.getFullYear() === currDate.getFullYear() &&
          join.getMonth() === currDate.getMonth()
        ) {
          for (let c = 0; c < join.getDate() - 1; c++) {
            studentRows[i].children[c].children[0].disabled = true;
          }
        }
      }
    }
    //weekend validation
    for (let j = x; j < dat.length; j++) {
      studentRows[i].children[j].children[0].disabled = true;
      studentRows[i].children[j].classList.add("weekend");
      j += 6;
    }
    for (let k = y; k < dat.length; k++) {
      studentRows[i].children[k].children[0].disabled = true;
      studentRows[i].children[k].classList.add("weekend");
      k += 6;
    }
    // date validation
    for (a = 0; a < currentDate - 1; a++) {
      studentRows[i].children[a].classList.add("passed");
    }
    for (b = currentDate; b < dat.length; b++) {
      studentRows[i].children[b - 1].classList.add("passed");
    }
  }
  holidays();
}

const holidays = async () => {
  const dat = document.querySelectorAll(".calender-table th");
  const studentRows = document.querySelectorAll("tbody .student");
  const res = await fetch("/api/v2/admin/holiday");
  const holli = await res.json();
  let holiday = [];
  for (let a = 0; a < holli.length; a++) {
    holiday.push(holli[a].holidayData);
  }
  let yearOfHoliday;
  for (let b = 0; b < holiday.length; b++) {
    if (holiday[b][date.getFullYear()]) {
      yearOfHoliday = holiday[b][date.getFullYear()];
    }
  }
  if (yearOfHoliday) {
    const monthOfHoliday = yearOfHoliday[months[date.getMonth()]];
    for (i = 0; i < studentRows.length; i++) {
      for (j = 0; j < dat.length; j++) {
        for (c = 0; c < monthOfHoliday.length; c++) {
          studentRows[i].children[
            monthOfHoliday[c].date - 1
          ].children[0].disabled = true;
          studentRows[i].children[monthOfHoliday[c].date - 1].classList.add(
            "holiday"
          );
        }
      }
    }
  }
};

// set attendance
async function setAttendance(page) {
  const Name = document.querySelectorAll(".name-col");
  const dat = document.querySelectorAll(".calender-table th");
  const studentRows = document.querySelectorAll("tbody .student");
  const res = await fetch(`/api/v2/users/attendance?page=${page}`);
  let attends = await res.json();
  for (i = 0; i < studentRows.length; i++) {
    for (j = 0; j < studentRows[i].children.length; j++) {
      if (attends[Name[i].innerHTML].length !== 0) {
        studentRows[i].children[j].children[0].checked =
          attends[Name[i].innerHTML][j];
      }
    }
  }
}

//miss day function
function getMissedDay(array) {
  return array.filter((v) => v === true).length;
}

// availableHolidays
const availableHolidays = () => {
  const dat = document.querySelectorAll(".calender-table th");
  const studentRows = document.querySelectorAll("tbody .student");
  let totalHoliday = [];
  let afterHoliday = [];
  for (j = date.getDate(); j <= dat.length - 1; j++) {
    afterHoliday.push(studentRows[0].children[j].classList.contains("weekend"));
    afterHoliday.push(studentRows[0].children[j].classList.contains("holiday"));
  }
  for (i = 0; i <= date.getDate() - 1; i++) {
    totalHoliday.push(studentRows[0].children[i].classList.contains("weekend"));
    totalHoliday.push(studentRows[0].children[i].classList.contains("holiday"));
  }
  const freeHoliday = getMissedDay(totalHoliday);
  const afterDateHoliday = getMissedDay(afterHoliday);
  return { freeHoliday, afterDateHoliday };
};

//count missing days
async function countAbsent(page = 1) {
  const res = await fetch(`/api/v2/users/attendance?page=${page}`);
  let present = await res.json();
  const missed = document.querySelectorAll("tbody .missed-col td span");
  const missedBox = document.querySelectorAll("tbody .missed-col td");
  const absentBox = document.querySelectorAll("tbody .absent-col .absent-td");

  const p = Object.getOwnPropertyNames(present);
  if (present) {
    const holidays = availableHolidays();
    for (let i = 0; i < p.length; i++) {
      if (present[p[i]].length !== 0) {
        missed[i].innerHTML = `${Math.abs(
          Math.round(
            (getMissedDay(present[p[i]]) /
              (date.getDate() - holidays.freeHoliday)) *
              100
          )
        )}`;
      }
    }
    for (let i = 0; i <= missed.length - 1; i++) {
      if (70 <= Number(missed[i].innerHTML)) {
        missedBox[i].classList.add("red");
      } else if (50 <= Number(missed[i].innerHTML)) {
        missedBox[i].classList.add("orange");
      } else if (0 <= Number(missed[i].innerHTML)) {
        missedBox[i].classList.add("green");
      }
    }
  } else {
    for (let i = 0; i <= missed.length - 1; i++) {
      missedBox[i].innerHTML = "No Data";
      missedBox[i].classList.add("red");
    }
  }
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

const getUserCombineLeaves = async () => {
  let arrayOfUsers = [];
  const AllLeave = await AllLeaves();
  if (AllLeave.length > 0) {
    for (let i = 0; i < AllLeave.length; i++) {
      if (arrayOfUsers.length > 0) {
        for (let j = 0; j < arrayOfUsers.length; j++) {
          if (AllLeave[i].email === arrayOfUsers[j].email) {
            arrayOfUsers[j].leaves.push({
              startDate: AllLeave[i].startDate,
              endDate: AllLeave[i].endDate,
              typeOfLeave: AllLeave[i].typeOfLeave,
              typeOfDay: AllLeave[i].typeOfDay,
              status: AllLeave[i].status,
            });
          } else {
            arrayOfUsers.push({
              email: AllLeave[i].email,
              leaves: [],
            });
          }
        }
      } else {
        arrayOfUsers.push({
          email: AllLeave[i].email,
          leaves: [
            {
              startDate: AllLeave[i].startDate,
              endDate: AllLeave[i].endDate,
              typeOfLeave: AllLeave[i].typeOfLeave,
              typeOfDay: AllLeave[i].typeOfDay,
              status: AllLeave[i].status,
            },
          ],
        });
      }
    }
  }
  arrayOfUsers = arrayOfUsers.filter(
    (value, index, self) =>
      index === self.findIndex((t) => t.email === value.email)
  );
  return arrayOfUsers;
};

// sick leave applied
const sickLeaves = async () => {
  const dat = document.querySelectorAll(".calender-table th");
  const emailId = document.querySelectorAll(".name-col");
  const studentRows = document.querySelectorAll("tbody .student");
  const sickBox = document.querySelectorAll("tbody .absent-col .sick-td");
  let sickList = {};
  let sickCol = {};
  let halfDayCol = {};
  let halfDayList = {};
  let priviousMonth = {};
  let nextMonth = {};
  let arrayOfUsers = await getUserCombineLeaves();
  const users = arrayOfUsers;
  for (let i = 0; i < users.length; i++) {
    if (users[i].leaves.length > 0) {
      for (a = 0; a < users[i].leaves.length; a++) {
        if (
          users[i].leaves[a].typeOfLeave === "sick leave" &&
          users[i].leaves[a].status === "confirm"
        ) {
          sickCol[`${users[i].email}`] = [];
          halfDayCol[`${users[i].email}`] = [];
          sickList[`${users[i].email}`] = {
            start: [],
            end: [],
          };
          halfDayList[`${users[i].email}`] = {
            start: [],
            end: [],
          };
          priviousMonth[`${users[i].email}`] = {
            start: [],
            end: [],
          };
          nextMonth[`${users[i].email}`] = {
            start: [],
            end: [],
          };
          for (let j = 0; j < users[i].leaves.length; j++) {
            if (users[i].leaves[j].typeOfLeave === "sick leave") {
              const start = new Date(
                users[i].leaves[j].status === "confirm" &&
                users[i].leaves[j].typeOfLeave === "sick leave"
                  ? users[i].leaves[j].startDate
                  : 0
              );
              const end = new Date(
                users[i].leaves[j].status === "confirm" &&
                users[i].leaves[j].typeOfLeave === "sick leave"
                  ? users[i].leaves[j].endDate
                  : 0
              );
              const halfStart = new Date(
                users[i].leaves[j].status === "confirm" &&
                users[i].leaves[j].typeOfLeave === "sick leave" &&
                users[i].leaves[j].typeOfDay === "halfday"
                  ? users[i].leaves[j].startDate
                  : 0
              );
              const halfEnd = new Date(
                users[i].leaves[j].status === "confirm" &&
                users[i].leaves[j].typeOfLeave === "sick leave" &&
                users[i].leaves[j].typeOfDay === "halfday"
                  ? users[i].leaves[j].endDate
                  : 0
              );
              //sick col
              if (
                start.getFullYear() === new Date().getFullYear() &&
                end.getFullYear() === new Date().getFullYear()
              ) {
                if (
                  start.getMonth() === new Date().getMonth() &&
                  end.getMonth() === new Date().getMonth()
                ) {
                  const days = getBusinessDateCount(start, end);
                  sickCol[`${users[i].email}`].push(days);
                  if (users[i].leaves[j].typeOfDay === "halfday") {
                    const halfDays = getBusinessDateCount(halfStart, halfEnd);
                    halfDayCol[`${users[i].email}`].push(halfDays);
                  }
                }
                if (
                  start.getMonth() === new Date().getMonth() &&
                  end.getMonth() !== new Date().getMonth()
                ) {
                  const newEnd = new Date(
                    start.getFullYear(),
                    start.getMonth() + 1,
                    0
                  );
                  const days = getBusinessDateCount(start, newEnd);
                  sickCol[`${users[i].email}`].push(days);
                  if (users[i].leaves[j].typeOfDay === "halfday") {
                    const newHalfEnd = new Date(
                      halfStart.getFullYear(),
                      halfStart.getMonth() + 1,
                      0
                    );
                    const halfDays = getBusinessDateCount(
                      halfStart,
                      newHalfEnd
                    );
                    halfDayCol[`${users[i].email}`].push(halfDays);
                  }
                }
                if (
                  start.getMonth() !== new Date().getMonth() &&
                  end.getMonth() === new Date().getMonth()
                ) {
                  const newStart = new Date(
                    new Date(end.getFullYear(), end.getMonth(), 1).setHours(
                      05,
                      30,
                      0
                    )
                  );
                  const days = getBusinessDateCount(newStart, end);
                  sickCol[`${users[i].email}`].push(days);
                  if (users[i].leaves[j].typeOfDay === "halfday") {
                    const newHalfEnd = new Date(
                      new Date(
                        halfEnd.getFullYear(),
                        halfEnd.getMonth(),
                        1
                      ).setHours(05, 30, 0)
                    );
                    const halfDays = getBusinessDateCount(newHalfEnd, halfEnd);
                    halfDayCol[`${users[i].email}`].push(halfDays);
                  }
                }
              }
              //sick input
              if (
                start.getFullYear() === new Date().getFullYear() &&
                start.getMonth() === new Date().getMonth()
              ) {
                if (
                  end.getFullYear() === new Date().getFullYear() &&
                  end.getMonth() === new Date().getMonth()
                ) {
                  if (users[i].leaves[j].status === "confirm") {
                    sickList[`${users[i].email}`].start.push(start.getDate());
                    sickList[`${users[i].email}`].end.push(end.getDate());
                    if (users[i].leaves[j].typeOfDay === "halfday") {
                      halfDayList[`${users[i].email}`].start.push(
                        start.getDate()
                      );
                      halfDayList[`${users[i].email}`].end.push(end.getDate());
                    }
                  }
                } else if (
                  end.getFullYear() === new Date().getFullYear() &&
                  end.getMonth() !== new Date().getMonth()
                ) {
                  if (users[i].leaves[j].status === "confirm") {
                    sickList[`${users[i].email}`].start.push(start.getDate());
                    sickList[`${users[i].email}`].end.push(end.getDate());
                    if (users[i].leaves[j].typeOfDay === "halfday") {
                      halfDayList[`${users[i].email}`].start.push(
                        start.getDate()
                      );
                      halfDayList[`${users[i].email}`].end.push(end.getDate());
                      nextMonth[`${users[i].email}`].start.push(
                        start.getDate()
                      );
                      nextMonth[`${users[i].email}`].end.push(end.getDate());
                    }
                  }
                } else if (
                  end.getFullYear() > new Date().getFullYear() &&
                  end.getMonth() > new Date().getMonth()
                ) {
                  if (users[i].leaves[j].status === "confirm") {
                    sickList[`${users[i].email}`].start.push(start.getDate());
                    sickList[`${users[i].email}`].end.push(end.getDate());
                    if (users[i].leaves[j].typeOfDay === "halfday") {
                      halfDayList[`${users[i].email}`].start.push(
                        start.getDate()
                      );
                      halfDayList[`${users[i].email}`].end.push(end.getDate());
                      nextMonth[`${users[i].email}`].start.push(
                        start.getDate()
                      );
                      nextMonth[`${users[i].email}`].end.push(end.getDate());
                    }
                  }
                }
              } else if (
                start.getFullYear() === new Date().getFullYear() &&
                start.getMonth() !== new Date().getMonth()
              ) {
                if (
                  end.getFullYear() === new Date().getFullYear() &&
                  end.getMonth() === new Date().getMonth()
                ) {
                  if (users[i].leaves[j].status === "confirm") {
                    sickList[`${users[i].email}`].start.push(start.getDate());
                    sickList[`${users[i].email}`].end.push(end.getDate());
                    if (users[i].leaves[j].typeOfDay === "halfday") {
                      halfDayList[`${users[i].email}`].start.push(
                        start.getDate()
                      );
                      halfDayList[`${users[i].email}`].end.push(end.getDate());
                      priviousMonth[`${users[i].email}`].start.push(
                        start.getDate()
                      );
                      priviousMonth[`${users[i].email}`].end.push(
                        end.getDate()
                      );
                    }
                  }
                }
              } else if (
                start.getFullYear() < new Date().getFullYear() &&
                start.getMonth() > new Date().getMonth()
              ) {
                if (
                  end.getFullYear() === new Date().getFullYear() &&
                  end.getMonth() === new Date().getMonth()
                ) {
                  if (users[i].leaves[j].status === "confirm") {
                    sickList[`${users[i].email}`].start.push(start.getDate());
                    sickList[`${users[i].email}`].end.push(end.getDate());
                    if (users[i].leaves[j].typeOfDay === "halfday") {
                      halfDayList[`${users[i].email}`].start.push(
                        start.getDate()
                      );
                      halfDayList[`${users[i].email}`].end.push(end.getDate());
                      priviousMonth[`${users[i].email}`].start.push(
                        start.getDate()
                      );
                      priviousMonth[`${users[i].email}`].end.push(
                        end.getDate()
                      );
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    let compare = Object.getOwnPropertyNames(sickCol);
    let halfCompare = Object.getOwnPropertyNames(halfDayCol);
    for (let a = 0; a < emailId.length; a++) {
      for (let b = 0; b < compare.length; b++) {
        if (emailId[a].innerHTML === compare[b]) {
          let halfData;
          data = sickCol[compare[b]].reduce(
            (partialSum, a) => partialSum + a,
            0
          );
          if (halfCompare.indexOf(compare[b]) > -1) {
            halfData = halfDayCol[
              halfCompare[halfCompare.indexOf(compare[b])]
            ].reduce((partialSum, a) => partialSum + a, 0);
          }
          sickBox[a].innerHTML = `${data - halfData / 2}`;
        } else if (emailId[a].innerHTML === compare[b]) {
          sickBox[a].innerHTML = 0;
        }
      }
    }
  }
  for (let i = 0; i < emailId.length; i++) {
    if (sickList[emailId[i].innerHTML]) {
      if (
        sickList[emailId[i].innerHTML].start.length ===
        sickList[emailId[i].innerHTML].end.length
      ) {
        for (let x = 0; x < sickList[emailId[i].innerHTML].start.length; x++) {
          if (
            sickList[emailId[i].innerHTML].start[x] ===
            sickList[emailId[i].innerHTML].end[x]
          ) {
            studentRows[i].children[
              sickList[emailId[i].innerHTML].start[x] - 1
            ].children[0].disabled = true;
            studentRows[i].children[
              sickList[emailId[i].innerHTML].start[x] - 1
            ].classList.add("sick");
          } else {
            for (
              let j = sickList[emailId[i].innerHTML].start[x];
              j < sickList[emailId[i].innerHTML].end[x] + 1;
              j++
            ) {
              studentRows[i].children[j - 1].children[0].checked = false;
              studentRows[i].children[j - 1].children[0].disabled = true;
              studentRows[i].children[j - 1].classList.add("sick");
              if (
                studentRows[i].children[j - 1].classList.contains("weekend") ||
                studentRows[i].children[j - 1].classList.contains("holiday")
              ) {
                studentRows[i].children[j - 1].classList.remove("sick");
              }
            }
          }
          if (
            sickList[emailId[i].innerHTML].start[0] ===
              priviousMonth[emailId[i].innerHTML].start[0] &&
            sickList[emailId[i].innerHTML].end[0] ===
              priviousMonth[emailId[i].innerHTML].end[0]
          ) {
            if (
              sickList[emailId[i].innerHTML].start[0] >
              sickList[emailId[i].innerHTML].end[0]
            ) {
              for (let j = 0; j < sickList[emailId[i].innerHTML].end[0]; j++) {
                studentRows[i].children[j].children[0].checked = false;
                studentRows[i].children[j].children[0].disabled = true;
                studentRows[i].children[j].classList.add("sick");
                if (
                  studentRows[i].children[j].classList.contains("weekend") ||
                  studentRows[i].children[j].classList.contains("holiday")
                ) {
                  studentRows[i].children[j].classList.remove("sick");
                }
              }
            }
          }
          if (
            sickList[emailId[i].innerHTML].start[
              sickList[emailId[i].innerHTML].start.length - 1
            ] === nextMonth[emailId[i].innerHTML].start[0] &&
            sickList[emailId[i].innerHTML].end[
              sickList[emailId[i].innerHTML].end.length - 1
            ] === nextMonth[emailId[i].innerHTML].end[0]
          ) {
            if (
              sickList[emailId[i].innerHTML].start[
                sickList[emailId[i].innerHTML].start.length - 1
              ] >
              sickList[emailId[i].innerHTML].end[
                sickList[emailId[i].innerHTML].start.length - 1
              ]
            ) {
              for (
                let j =
                  sickList[emailId[i].innerHTML].start[
                    sickList[emailId[i].innerHTML].start.length - 1
                  ];
                j < dat.length;
                j++
              ) {
                studentRows[i].children[j].children[0].checked = false;
                studentRows[i].children[j].children[0].disabled = true;
                studentRows[i].children[j].classList.add("sick");
                if (
                  studentRows[i].children[j].classList.contains("weekend") ||
                  studentRows[i].children[j].classList.contains("holiday")
                ) {
                  studentRows[i].children[j].classList.remove("sick");
                }
              }
            }
          }
        }
      }
    }
    if (halfDayList[emailId[i].innerHTML]) {
      if (
        halfDayList[emailId[i].innerHTML].start.length ===
        halfDayList[emailId[i].innerHTML].end.length
      ) {
        for (
          let x = 0;
          x < halfDayList[emailId[i].innerHTML].start.length;
          x++
        ) {
          if (
            halfDayList[emailId[i].innerHTML].start[x] ===
            halfDayList[emailId[i].innerHTML].end[x]
          ) {
            studentRows[i].children[
              halfDayList[emailId[i].innerHTML].start[x] - 1
            ].children[0].checked = true;
            studentRows[i].children[
              halfDayList[emailId[i].innerHTML].start[x] - 1
            ].children[0].disabled = true;
            studentRows[i].children[
              halfDayList[emailId[i].innerHTML].start[x] - 1
            ].classList.remove("sick");
            studentRows[i].children[
              halfDayList[emailId[i].innerHTML].start[x] - 1
            ].classList.add("halfSick");
            if (
              studentRows[i].children[
                halfDayList[emailId[i].innerHTML].start[x] - 1
              ].classList.contains("weekend") ||
              studentRows[i].children[
                halfDayList[emailId[i].innerHTML].start[x] - 1
              ].classList.contains("holiday")
            ) {
              studentRows[i].children[
                halfDayList[emailId[i].innerHTML].start[x] - 1
              ].children[0].checked = false;
              studentRows[i].children[
                halfDayList[emailId[i].innerHTML].start[x] - 1
              ].classList.remove("halfSick");
            }
          } else {
            for (
              let j = halfDayList[emailId[i].innerHTML].start[x];
              j < halfDayList[emailId[i].innerHTML].end[x] + 1;
              j++
            ) {
              studentRows[i].children[j - 1].children[0].checked = true;
              studentRows[i].children[j - 1].children[0].disabled = true;
              studentRows[i].children[j - 1].classList.remove("sick");
              studentRows[i].children[j - 1].classList.add("halfSick");
              if (
                studentRows[i].children[j - 1].classList.contains("weekend") ||
                studentRows[i].children[j - 1].classList.contains("holiday")
              ) {
                studentRows[i].children[j - 1].children[0].checked = false;
                studentRows[i].children[j - 1].classList.remove("halfSick");
              }
            }
          }
          if (
            halfDayList[emailId[i].innerHTML].start[0] ===
              priviousMonth[emailId[i].innerHTML].start[0] &&
            halfDayList[emailId[i].innerHTML].end[0] ===
              priviousMonth[emailId[i].innerHTML].end[0]
          ) {
            if (
              halfDayList[emailId[i].innerHTML].start[0] >
              halfDayList[emailId[i].innerHTML].end[0]
            ) {
              for (
                let j = 0;
                j < halfDayList[emailId[i].innerHTML].end[0];
                j++
              ) {
                studentRows[i].children[j].children[0].checked = true;
                studentRows[i].children[j].children[0].disabled = true;
                studentRows[i].children[j].classList.remove("sick");
                studentRows[i].children[j].classList.add("halfSick");
                if (
                  studentRows[i].children[j].classList.contains("weekend") ||
                  studentRows[i].children[j].classList.contains("holiday")
                ) {
                  studentRows[i].children[j].children[0].checked = false;
                  studentRows[i].children[j].classList.remove("halfSick");
                }
              }
            }
          }
          if (
            halfDayList[emailId[i].innerHTML].start[
              halfDayList[emailId[i].innerHTML].start.length - 1
            ] === nextMonth[emailId[i].innerHTML].start[0] &&
            halfDayList[emailId[i].innerHTML].end[
              halfDayList[emailId[i].innerHTML].start.length - 1
            ] === nextMonth[emailId[i].innerHTML].end[0]
          ) {
            if (
              halfDayList[emailId[i].innerHTML].start[
                halfDayList[emailId[i].innerHTML].start.length - 1
              ] >
              halfDayList[emailId[i].innerHTML].end[
                halfDayList[emailId[i].innerHTML].start.length - 1
              ]
            ) {
              for (
                let j =
                  halfDayList[emailId[i].innerHTML].start[
                    halfDayList[emailId[i].innerHTML].start.length - 1
                  ];
                j < dat.length;
                j++
              ) {
                studentRows[i].children[j].children[0].checked = true;
                studentRows[i].children[j].children[0].disabled = true;
                studentRows[i].children[j].classList.remove("sick");
                studentRows[i].children[j].classList.add("halfSick");
                if (
                  studentRows[i].children[j].classList.contains("weekend") ||
                  studentRows[i].children[j].classList.contains("holiday")
                ) {
                  studentRows[i].children[j].children[0].checked = false;
                  studentRows[i].children[j].classList.remove("halfSick");
                }
              }
            }
          }
        }
      }
    }
  }
};

// casual leave applied
const casualLeaves = async () => {
  const dat = document.querySelectorAll(".calender-table th");
  const emailId = document.querySelectorAll(".name-col");
  const studentRows = document.querySelectorAll("tbody .student");
  const casualBox = document.querySelectorAll("tbody .absent-col .casual-td");
  let casualList = {};
  let casualCol = {};
  let halfDayCol = {};
  let halfDayList = {};
  let priviousMonth = {};
  let nextMonth = {};
  let arrayOfUsers = await getUserCombineLeaves();
  const users = arrayOfUsers;
  for (let i = 0; i < users.length; i++) {
    if (users[i].leaves.length > 0) {
      for (a = 0; a < users[i].leaves.length; a++) {
        if (
          users[i].leaves[a].typeOfLeave === "casual leave" &&
          users[i].leaves[a].status === "confirm"
        ) {
          casualCol[`${users[i].email}`] = [];
          halfDayCol[`${users[i].email}`] = [];
          casualList[`${users[i].email}`] = {
            start: [],
            end: [],
          };
          halfDayList[`${users[i].email}`] = {
            start: [],
            end: [],
          };
          priviousMonth[`${users[i].email}`] = {
            start: [],
            end: [],
          };
          nextMonth[`${users[i].email}`] = {
            start: [],
            end: [],
          };
          for (let j = 0; j < users[i].leaves.length; j++) {
            if (users[i].leaves[j].typeOfLeave === "casual leave") {
              const start = new Date(
                users[i].leaves[j].status === "confirm" &&
                users[i].leaves[j].typeOfLeave === "casual leave"
                  ? users[i].leaves[j].startDate
                  : 0
              );
              const end = new Date(
                users[i].leaves[j].status === "confirm" &&
                users[i].leaves[j].typeOfLeave === "casual leave"
                  ? users[i].leaves[j].endDate
                  : 0
              );
              const halfStart = new Date(
                users[i].leaves[j].status === "confirm" &&
                users[i].leaves[j].typeOfLeave === "casual leave" &&
                users[i].leaves[j].typeOfDay === "halfday"
                  ? users[i].leaves[j].startDate
                  : 0
              );
              const halfEnd = new Date(
                users[i].leaves[j].status === "confirm" &&
                users[i].leaves[j].typeOfLeave === "casual leave" &&
                users[i].leaves[j].typeOfDay === "halfday"
                  ? users[i].leaves[j].endDate
                  : 0
              );
              //casual col
              if (
                start.getFullYear() === new Date().getFullYear() &&
                end.getFullYear() === new Date().getFullYear()
              ) {
                if (
                  start.getMonth() === new Date().getMonth() &&
                  end.getMonth() === new Date().getMonth()
                ) {
                  const days = getBusinessDateCount(start, end);
                  casualCol[`${users[i].email}`].push(days);
                  if (users[i].leaves[j].typeOfDay === "halfday") {
                    const halfDays = getBusinessDateCount(halfStart, halfEnd);
                    halfDayCol[`${users[i].email}`].push(halfDays);
                  }
                }
                if (
                  start.getMonth() === new Date().getMonth() &&
                  end.getMonth() !== new Date().getMonth()
                ) {
                  const newEnd = new Date(
                    start.getFullYear(),
                    start.getMonth() + 1,
                    0
                  );
                  const days = getBusinessDateCount(start, newEnd);
                  casualCol[`${users[i].email}`].push(days);
                  if (users[i].leaves[j].typeOfDay === "halfday") {
                    const newHalfEnd = new Date(
                      halfStart.getFullYear(),
                      halfStart.getMonth() + 1,
                      0
                    );
                    const halfDays = getBusinessDateCount(
                      halfStart,
                      newHalfEnd
                    );
                    halfDayCol[`${users[i].email}`].push(halfDays);
                  }
                }
                if (
                  start.getMonth() !== new Date().getMonth() &&
                  end.getMonth() === new Date().getMonth()
                ) {
                  const newStart = new Date(
                    new Date(end.getFullYear(), end.getMonth(), 1).setHours(
                      05,
                      30,
                      0
                    )
                  );
                  const days = getBusinessDateCount(newStart, end);
                  casualCol[`${users[i].email}`].push(days);
                  if (users[i].leaves[j].typeOfDay === "halfday") {
                    const newHalfEnd = new Date(
                      new Date(
                        halfEnd.getFullYear(),
                        halfEnd.getMonth(),
                        1
                      ).setHours(05, 30, 0)
                    );
                    const halfDays = getBusinessDateCount(newHalfEnd, halfEnd);
                    halfDayCol[`${users[i].email}`].push(halfDays);
                  }
                }
              }
              //casual input
              if (
                start.getFullYear() === new Date().getFullYear() &&
                start.getMonth() === new Date().getMonth()
              ) {
                if (
                  end.getFullYear() === new Date().getFullYear() &&
                  end.getMonth() === new Date().getMonth()
                ) {
                  if (users[i].leaves[j].status === "confirm") {
                    casualList[`${users[i].email}`].start.push(start.getDate());
                    casualList[`${users[i].email}`].end.push(end.getDate());
                    if (users[i].leaves[j].typeOfDay === "halfday") {
                      halfDayList[`${users[i].email}`].start.push(
                        start.getDate()
                      );
                      halfDayList[`${users[i].email}`].end.push(end.getDate());
                    }
                  }
                } else if (
                  end.getFullYear() === new Date().getFullYear() &&
                  end.getMonth() !== new Date().getMonth()
                ) {
                  if (users[i].leaves[j].status === "confirm") {
                    casualList[`${users[i].email}`].start.push(start.getDate());
                    casualList[`${users[i].email}`].end.push(end.getDate());
                    if (users[i].leaves[j].typeOfDay === "halfday") {
                      halfDayList[`${users[i].email}`].start.push(
                        start.getDate()
                      );
                      halfDayList[`${users[i].email}`].end.push(end.getDate());
                      nextMonth[`${users[i].email}`].start.push(
                        start.getDate()
                      );
                      nextMonth[`${users[i].email}`].end.push(end.getDate());
                    }
                  }
                } else if (
                  end.getFullYear() > new Date().getFullYear() &&
                  end.getMonth() > new Date().getMonth()
                ) {
                  if (users[i].leaves[j].status === "confirm") {
                    casualList[`${users[i].email}`].start.push(start.getDate());
                    casualList[`${users[i].email}`].end.push(end.getDate());
                    if (users[i].leaves[j].typeOfDay === "halfday") {
                      halfDayList[`${users[i].email}`].start.push(
                        start.getDate()
                      );
                      halfDayList[`${users[i].email}`].end.push(end.getDate());
                      nextMonth[`${users[i].email}`].start.push(
                        start.getDate()
                      );
                      nextMonth[`${users[i].email}`].end.push(end.getDate());
                    }
                  }
                }
              } else if (
                start.getFullYear() === new Date().getFullYear() &&
                start.getMonth() !== new Date().getMonth()
              ) {
                if (
                  end.getFullYear() === new Date().getFullYear() &&
                  end.getMonth() === new Date().getMonth()
                ) {
                  if (users[i].leaves[j].status === "confirm") {
                    casualList[`${users[i].email}`].start.push(start.getDate());
                    casualList[`${users[i].email}`].end.push(end.getDate());
                    if (users[i].leaves[j].typeOfDay === "halfday") {
                      halfDayList[`${users[i].email}`].start.push(
                        start.getDate()
                      );
                      halfDayList[`${users[i].email}`].end.push(end.getDate());
                      priviousMonth[`${users[i].email}`].start.push(
                        start.getDate()
                      );
                      priviousMonth[`${users[i].email}`].end.push(
                        end.getDate()
                      );
                    }
                  }
                }
              } else if (
                start.getFullYear() < new Date().getFullYear() &&
                start.getMonth() > new Date().getMonth()
              ) {
                if (
                  end.getFullYear() === new Date().getFullYear() &&
                  end.getMonth() === new Date().getMonth()
                ) {
                  if (users[i].leaves[j].status === "confirm") {
                    casualList[`${users[i].email}`].start.push(start.getDate());
                    casualList[`${users[i].email}`].end.push(end.getDate());
                    if (users[i].leaves[j].typeOfDay === "halfday") {
                      halfDayList[`${users[i].email}`].start.push(
                        start.getDate()
                      );
                      halfDayList[`${users[i].email}`].end.push(end.getDate());
                      priviousMonth[`${users[i].email}`].start.push(
                        start.getDate()
                      );
                      priviousMonth[`${users[i].email}`].end.push(
                        end.getDate()
                      );
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    let compare = Object.getOwnPropertyNames(casualCol);
    let halfCompare = Object.getOwnPropertyNames(halfDayCol);
    for (let b = 0; b < compare.length; b++) {
      for (let a = 0; a < emailId.length; a++) {
        if (emailId[a].innerHTML === compare[b]) {
          let halfData;
          data = casualCol[compare[b]].reduce(
            (partialSum, a) => partialSum + a,
            0
          );
          if (halfCompare.indexOf(compare[b]) > -1) {
            halfData = halfDayCol[
              halfCompare[halfCompare.indexOf(compare[b])]
            ].reduce((partialSum, a) => partialSum + a, 0);
          }
          casualBox[a].innerHTML = `${data - halfData / 2}`;
        } else if (emailId[a].innerHTML === compare[b]) {
          casualBox[a].innerHTML = 0;
        }
      }
    }
  }
  for (let i = 0; i < emailId.length; i++) {
    if (casualList[emailId[i].innerHTML]) {
      if (
        casualList[emailId[i].innerHTML].start.length ===
        casualList[emailId[i].innerHTML].end.length
      ) {
        for (
          let x = 0;
          x < casualList[emailId[i].innerHTML].start.length;
          x++
        ) {
          if (
            casualList[emailId[i].innerHTML].start[x] ===
            casualList[emailId[i].innerHTML].end[x]
          ) {
            studentRows[i].children[
              casualList[emailId[i].innerHTML].start[x] - 1
            ].children[0].disabled = true;
            studentRows[i].children[
              casualList[emailId[i].innerHTML].start[x] - 1
            ].classList.add("casual");
          } else {
            for (
              let j = casualList[emailId[i].innerHTML].start[x];
              j < casualList[emailId[i].innerHTML].end[x] + 1;
              j++
            ) {
              studentRows[i].children[j - 1].children[0].checked = false;
              studentRows[i].children[j - 1].children[0].disabled = true;
              studentRows[i].children[j - 1].classList.add("casual");
              if (
                studentRows[i].children[j - 1].classList.contains("weekend") ||
                studentRows[i].children[j - 1].classList.contains("holiday")
              ) {
                studentRows[i].children[j - 1].classList.remove("casual");
              }
            }
          }
          if (
            casualList[emailId[i].innerHTML].start[0] ===
              priviousMonth[emailId[i].innerHTML].start[0] &&
            casualList[emailId[i].innerHTML].end[0] ===
              priviousMonth[emailId[i].innerHTML].end[0]
          ) {
            if (
              casualList[emailId[i].innerHTML].start[0] >
              casualList[emailId[i].innerHTML].end[0]
            ) {
              for (
                let j = 0;
                j < casualList[emailId[i].innerHTML].end[0];
                j++
              ) {
                studentRows[i].children[j].children[0].checked = false;
                studentRows[i].children[j].children[0].disabled = true;
                studentRows[i].children[j].classList.add("casual");
                if (
                  studentRows[i].children[j].classList.contains("weekend") ||
                  studentRows[i].children[j].classList.contains("holiday")
                ) {
                  studentRows[i].children[j].classList.remove("casual");
                }
              }
            }
          }
          if (
            casualList[emailId[i].innerHTML].start[
              casualList[emailId[i].innerHTML].start.length - 1
            ] === nextMonth[emailId[i].innerHTML].start[0] &&
            casualList[emailId[i].innerHTML].end[
              casualList[emailId[i].innerHTML].end.length - 1
            ] === nextMonth[emailId[i].innerHTML].end[0]
          ) {
            if (
              casualList[emailId[i].innerHTML].start[
                casualList[emailId[i].innerHTML].start.length - 1
              ] >
              casualList[emailId[i].innerHTML].end[
                casualList[emailId[i].innerHTML].start.length - 1
              ]
            ) {
              for (
                let j =
                  casualList[emailId[i].innerHTML].start[
                    casualList[emailId[i].innerHTML].start.length - 1
                  ];
                j < dat.length;
                j++
              ) {
                studentRows[i].children[j].children[0].checked = false;
                studentRows[i].children[j].children[0].disabled = true;
                studentRows[i].children[j].classList.add("casual");
                if (
                  studentRows[i].children[j].classList.contains("weekend") ||
                  studentRows[i].children[j].classList.contains("holiday")
                ) {
                  studentRows[i].children[j].classList.remove("casual");
                }
              }
            }
          }
        }
      }
    }
    if (halfDayList[emailId[i].innerHTML]) {
      if (
        halfDayList[emailId[i].innerHTML].start.length ===
        halfDayList[emailId[i].innerHTML].end.length
      ) {
        for (
          let x = 0;
          x < halfDayList[emailId[i].innerHTML].start.length;
          x++
        ) {
          if (
            halfDayList[emailId[i].innerHTML].start[x] ===
            halfDayList[emailId[i].innerHTML].end[x]
          ) {
            studentRows[i].children[
              halfDayList[emailId[i].innerHTML].start[x] - 1
            ].children[0].checked = true;
            studentRows[i].children[
              halfDayList[emailId[i].innerHTML].start[x] - 1
            ].children[0].disabled = true;
            studentRows[i].children[
              halfDayList[emailId[i].innerHTML].start[x] - 1
            ].classList.remove("casual");
            studentRows[i].children[
              halfDayList[emailId[i].innerHTML].start[x] - 1
            ].classList.add("halfCasual");
            if (
              studentRows[i].children[
                halfDayList[emailId[i].innerHTML].start[x] - 1
              ].classList.contains("weekend") ||
              studentRows[i].children[
                halfDayList[emailId[i].innerHTML].start[x] - 1
              ].classList.contains("holiday")
            ) {
              studentRows[i].children[
                halfDayList[emailId[i].innerHTML].start[x] - 1
              ].children[0].checked = false;
              studentRows[i].children[
                halfDayList[emailId[i].innerHTML].start[x] - 1
              ].classList.remove("halfCasual");
            }
          } else {
            for (
              let j = halfDayList[emailId[i].innerHTML].start[x];
              j < halfDayList[emailId[i].innerHTML].end[x] + 1;
              j++
            ) {
              studentRows[i].children[j - 1].children[0].checked = true;
              studentRows[i].children[j - 1].children[0].disabled = true;
              studentRows[i].children[j - 1].classList.remove("casual");
              studentRows[i].children[j - 1].classList.add("halfCasual");
              if (
                studentRows[i].children[j - 1].classList.contains("weekend") ||
                studentRows[i].children[j - 1].classList.contains("holiday")
              ) {
                studentRows[i].children[j - 1].children[0].checked = false;
                studentRows[i].children[j - 1].classList.remove("halfCasual");
              }
            }
          }
          if (
            halfDayList[emailId[i].innerHTML].start[0] ===
              priviousMonth[emailId[i].innerHTML].start[0] &&
            halfDayList[emailId[i].innerHTML].end[0] ===
              priviousMonth[emailId[i].innerHTML].end[0]
          ) {
            if (
              halfDayList[emailId[i].innerHTML].start[0] >
              halfDayList[emailId[i].innerHTML].end[0]
            ) {
              for (
                let j = 0;
                j < halfDayList[emailId[i].innerHTML].end[0];
                j++
              ) {
                studentRows[i].children[j].children[0].checked = true;
                studentRows[i].children[j].children[0].disabled = true;
                studentRows[i].children[j].classList.remove("casual");
                studentRows[i].children[j].classList.add("halfCasual");
                if (
                  studentRows[i].children[j].classList.contains("weekend") ||
                  studentRows[i].children[j].classList.contains("holiday")
                ) {
                  studentRows[i].children[j].children[0].checked = false;
                  studentRows[i].children[j].classList.remove("halfCasual");
                }
              }
            }
          }
          if (
            halfDayList[emailId[i].innerHTML].start[
              halfDayList[emailId[i].innerHTML].start.length - 1
            ] === nextMonth[emailId[i].innerHTML].start[0] &&
            halfDayList[emailId[i].innerHTML].end[
              halfDayList[emailId[i].innerHTML].start.length - 1
            ] === nextMonth[emailId[i].innerHTML].end[0]
          ) {
            if (
              halfDayList[emailId[i].innerHTML].start[
                halfDayList[emailId[i].innerHTML].start.length - 1
              ] >
              halfDayList[emailId[i].innerHTML].end[
                halfDayList[emailId[i].innerHTML].start.length - 1
              ]
            ) {
              for (
                let j =
                  halfDayList[emailId[i].innerHTML].start[
                    halfDayList[emailId[i].innerHTML].start.length - 1
                  ];
                j < dat.length;
                j++
              ) {
                studentRows[i].children[j].children[0].checked = true;
                studentRows[i].children[j].children[0].disabled = true;
                studentRows[i].children[j].classList.remove("casual");
                studentRows[i].children[j].classList.add("halfCasual");
                if (
                  studentRows[i].children[j].classList.contains("weekend") ||
                  studentRows[i].children[j].classList.contains("holiday")
                ) {
                  studentRows[i].children[j].children[0].checked = false;
                  studentRows[i].children[j].classList.remove("halfCasual");
                }
              }
            }
          }
        }
      }
    }
  }
};

// privilege leave applied
const privilegeLeaves = async () => {
  const dat = document.querySelectorAll(".calender-table th");
  const emailId = document.querySelectorAll(".name-col");
  const studentRows = document.querySelectorAll("tbody .student");
  const privilegeBox = document.querySelectorAll(
    "tbody .absent-col .privilege-td"
  );
  let privilegeList = {};
  let privilegeCol = {};
  let halfDayCol = {};
  let halfDayList = {};
  let priviousMonth = {};
  let nextMonth = {};
  let arrayOfUsers = await getUserCombineLeaves();
  const users = arrayOfUsers;
  for (let i = 0; i < users.length; i++) {
    if (users[i].leaves.length > 0) {
      for (a = 0; a < users[i].leaves.length; a++) {
        if (
          users[i].leaves[a].typeOfLeave === "privilege leave" &&
          users[i].leaves[a].status === "confirm"
        ) {
          privilegeCol[`${users[i].email}`] = [];
          halfDayCol[`${users[i].email}`] = [];
          privilegeList[`${users[i].email}`] = {
            start: [],
            end: [],
          };
          halfDayList[`${users[i].email}`] = {
            start: [],
            end: [],
          };
          priviousMonth[`${users[i].email}`] = {
            start: [],
            end: [],
          };
          nextMonth[`${users[i].email}`] = {
            start: [],
            end: [],
          };
          for (let j = 0; j < users[i].leaves.length; j++) {
            if (users[i].leaves[j].typeOfLeave === "privilege leave") {
              const start = new Date(
                users[i].leaves[j].status === "confirm" &&
                users[i].leaves[j].typeOfLeave === "privilege leave"
                  ? users[i].leaves[j].startDate
                  : 0
              );
              const end = new Date(
                users[i].leaves[j].status === "confirm" &&
                users[i].leaves[j].typeOfLeave === "privilege leave"
                  ? users[i].leaves[j].endDate
                  : 0
              );
              const halfStart = new Date(
                users[i].leaves[j].status === "confirm" &&
                users[i].leaves[j].typeOfLeave === "privilege leave" &&
                users[i].leaves[j].typeOfDay === "halfday"
                  ? users[i].leaves[j].startDate
                  : 0
              );
              const halfEnd = new Date(
                users[i].leaves[j].status === "confirm" &&
                users[i].leaves[j].typeOfLeave === "privilege leave" &&
                users[i].leaves[j].typeOfDay === "halfday"
                  ? users[i].leaves[j].endDate
                  : 0
              );
              //privilege col
              if (
                start.getFullYear() === new Date().getFullYear() &&
                end.getFullYear() === new Date().getFullYear()
              ) {
                if (
                  start.getMonth() === new Date().getMonth() &&
                  end.getMonth() === new Date().getMonth()
                ) {
                  const days = getBusinessDateCount(start, end);
                  privilegeCol[`${users[i].email}`].push(days);
                  if (users[i].leaves[j].typeOfDay === "halfday") {
                    const halfDays = getBusinessDateCount(halfStart, halfEnd);
                    halfDayCol[`${users[i].email}`].push(halfDays);
                  }
                }
                if (
                  start.getMonth() === new Date().getMonth() &&
                  end.getMonth() !== new Date().getMonth()
                ) {
                  const newEnd = new Date(
                    start.getFullYear(),
                    start.getMonth() + 1,
                    0
                  );
                  const days = getBusinessDateCount(start, newEnd);
                  privilegeCol[`${users[i].email}`].push(days);
                  if (users[i].leaves[j].typeOfDay === "halfday") {
                    const newHalfEnd = new Date(
                      halfStart.getFullYear(),
                      halfStart.getMonth() + 1,
                      0
                    );
                    const halfDays = getBusinessDateCount(
                      halfStart,
                      newHalfEnd
                    );
                    halfDayCol[`${users[i].email}`].push(halfDays);
                  }
                }
                if (
                  start.getMonth() !== new Date().getMonth() &&
                  end.getMonth() === new Date().getMonth()
                ) {
                  const newStart = new Date(
                    new Date(end.getFullYear(), end.getMonth(), 1).setHours(
                      05,
                      30,
                      0
                    )
                  );
                  const days = getBusinessDateCount(newStart, end);
                  privilegeCol[`${users[i].email}`].push(days);
                  if (users[i].leaves[j].typeOfDay === "halfday") {
                    const newHalfEnd = new Date(
                      new Date(
                        halfEnd.getFullYear(),
                        halfEnd.getMonth(),
                        1
                      ).setHours(05, 30, 0)
                    );
                    const halfDays = getBusinessDateCount(newHalfEnd, halfEnd);
                    halfDayCol[`${users[i].email}`].push(halfDays);
                  }
                }
              }
              //privilege input
              if (
                start.getFullYear() === new Date().getFullYear() &&
                start.getMonth() === new Date().getMonth()
              ) {
                if (
                  end.getFullYear() === new Date().getFullYear() &&
                  end.getMonth() === new Date().getMonth()
                ) {
                  if (users[i].leaves[j].status === "confirm") {
                    privilegeList[`${users[i].email}`].start.push(
                      start.getDate()
                    );
                    privilegeList[`${users[i].email}`].end.push(end.getDate());
                    if (users[i].leaves[j].typeOfDay === "halfday") {
                      halfDayList[`${users[i].email}`].start.push(
                        start.getDate()
                      );
                      halfDayList[`${users[i].email}`].end.push(end.getDate());
                    }
                  }
                } else if (
                  end.getFullYear() === new Date().getFullYear() &&
                  end.getMonth() !== new Date().getMonth()
                ) {
                  if (users[i].leaves[j].status === "confirm") {
                    privilegeList[`${users[i].email}`].start.push(
                      start.getDate()
                    );
                    privilegeList[`${users[i].email}`].end.push(end.getDate());
                    if (users[i].leaves[j].typeOfDay === "halfday") {
                      halfDayList[`${users[i].email}`].start.push(
                        start.getDate()
                      );
                      halfDayList[`${users[i].email}`].end.push(end.getDate());
                      nextMonth[`${users[i].email}`].start.push(
                        start.getDate()
                      );
                      nextMonth[`${users[i].email}`].end.push(end.getDate());
                    }
                  }
                } else if (
                  end.getFullYear() > new Date().getFullYear() &&
                  end.getMonth() > new Date().getMonth()
                ) {
                  if (users[i].leaves[j].status === "confirm") {
                    privilegeList[`${users[i].email}`].start.push(
                      start.getDate()
                    );
                    privilegeList[`${users[i].email}`].end.push(end.getDate());
                    if (users[i].leaves[j].typeOfDay === "halfday") {
                      halfDayList[`${users[i].email}`].start.push(
                        start.getDate()
                      );
                      halfDayList[`${users[i].email}`].end.push(end.getDate());
                      nextMonth[`${users[i].email}`].start.push(
                        start.getDate()
                      );
                      nextMonth[`${users[i].email}`].end.push(end.getDate());
                    }
                  }
                }
              } else if (
                start.getFullYear() === new Date().getFullYear() &&
                start.getMonth() !== new Date().getMonth()
              ) {
                if (
                  end.getFullYear() === new Date().getFullYear() &&
                  end.getMonth() === new Date().getMonth()
                ) {
                  if (users[i].leaves[j].status === "confirm") {
                    privilegeList[`${users[i].email}`].start.push(
                      start.getDate()
                    );
                    privilegeList[`${users[i].email}`].end.push(end.getDate());
                    if (users[i].leaves[j].typeOfDay === "halfday") {
                      halfDayList[`${users[i].email}`].start.push(
                        start.getDate()
                      );
                      halfDayList[`${users[i].email}`].end.push(end.getDate());
                      priviousMonth[`${users[i].email}`].start.push(
                        start.getDate()
                      );
                      priviousMonth[`${users[i].email}`].end.push(
                        end.getDate()
                      );
                    }
                  }
                }
              } else if (
                start.getFullYear() < new Date().getFullYear() &&
                start.getMonth() > new Date().getMonth()
              ) {
                if (
                  end.getFullYear() === new Date().getFullYear() &&
                  end.getMonth() === new Date().getMonth()
                ) {
                  if (users[i].leaves[j].status === "confirm") {
                    privilegeList[`${users[i].email}`].start.push(
                      start.getDate()
                    );
                    privilegeList[`${users[i].email}`].end.push(end.getDate());
                    if (users[i].leaves[j].typeOfDay === "halfday") {
                      halfDayList[`${users[i].email}`].start.push(
                        start.getDate()
                      );
                      halfDayList[`${users[i].email}`].end.push(end.getDate());
                      priviousMonth[`${users[i].email}`].start.push(
                        start.getDate()
                      );
                      priviousMonth[`${users[i].email}`].end.push(
                        end.getDate()
                      );
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    let compare = Object.getOwnPropertyNames(privilegeCol);
    let halfCompare = Object.getOwnPropertyNames(halfDayCol);
    for (let b = 0; b < compare.length; b++) {
      for (let a = 0; a < emailId.length; a++) {
        if (emailId[a].innerHTML === compare[b]) {
          let halfData;
          data = privilegeCol[compare[b]].reduce(
            (partialSum, a) => partialSum + a,
            0
          );
          if (halfCompare.indexOf(compare[b]) > -1) {
            halfData = halfDayCol[
              halfCompare[halfCompare.indexOf(compare[b])]
            ].reduce((partialSum, a) => partialSum + a, 0);
          }
          privilegeBox[a].innerHTML = `${data - halfData / 2}`;
        } else if (emailId[a].innerHTML === compare[b]) {
          privilegeBox[a].innerHTML = 0;
        }
      }
    }
  }
  for (let i = 0; i < emailId.length; i++) {
    if (privilegeList[emailId[i].innerHTML]) {
      if (
        privilegeList[emailId[i].innerHTML].start.length ===
        privilegeList[emailId[i].innerHTML].end.length
      ) {
        for (
          let x = 0;
          x < privilegeList[emailId[i].innerHTML].start.length;
          x++
        ) {
          if (
            privilegeList[emailId[i].innerHTML].start[x] ===
            privilegeList[emailId[i].innerHTML].end[x]
          ) {
            studentRows[i].children[
              privilegeList[emailId[i].innerHTML].start[x] - 1
            ].children[0].disabled = true;
            studentRows[i].children[
              privilegeList[emailId[i].innerHTML].start[x] - 1
            ].classList.add("privilege");
          } else {
            for (
              let j = privilegeList[emailId[i].innerHTML].start[x];
              j < privilegeList[emailId[i].innerHTML].end[x] + 1;
              j++
            ) {
              studentRows[i].children[j - 1].children[0].checked = false;
              studentRows[i].children[j - 1].children[0].disabled = true;
              studentRows[i].children[j - 1].classList.add("privilege");
              if (
                studentRows[i].children[j - 1].classList.contains("weekend") ||
                studentRows[i].children[j - 1].classList.contains("holiday")
              ) {
                studentRows[i].children[j - 1].classList.remove("privilege");
              }
            }
          }
          if (
            privilegeList[emailId[i].innerHTML].start[0] ===
              priviousMonth[emailId[i].innerHTML].start[0] &&
            privilegeList[emailId[i].innerHTML].end[0] ===
              priviousMonth[emailId[i].innerHTML].end[0]
          ) {
            if (
              privilegeList[emailId[i].innerHTML].start[0] >
              privilegeList[emailId[i].innerHTML].end[0]
            ) {
              for (
                let j = 0;
                j < privilegeList[emailId[i].innerHTML].end[0];
                j++
              ) {
                studentRows[i].children[j].children[0].checked = false;
                studentRows[i].children[j].children[0].disabled = true;
                studentRows[i].children[j].classList.add("privilege");
                if (
                  studentRows[i].children[j].classList.contains("weekend") ||
                  studentRows[i].children[j].classList.contains("holiday")
                ) {
                  studentRows[i].children[j].classList.remove("privilege");
                }
              }
            }
          }
          if (
            privilegeList[emailId[i].innerHTML].start[
              privilegeList[emailId[i].innerHTML].start.length - 1
            ] === nextMonth[emailId[i].innerHTML].start[0] &&
            privilegeList[emailId[i].innerHTML].end[
              privilegeList[emailId[i].innerHTML].end.length - 1
            ] === nextMonth[emailId[i].innerHTML].end[0]
          ) {
            if (
              privilegeList[emailId[i].innerHTML].start[
                privilegeList[emailId[i].innerHTML].start.length - 1
              ] >
              privilegeList[emailId[i].innerHTML].end[
                privilegeList[emailId[i].innerHTML].start.length - 1
              ]
            ) {
              for (
                let j =
                  privilegeList[emailId[i].innerHTML].start[
                    privilegeList[emailId[i].innerHTML].start.length - 1
                  ];
                j < dat.length;
                j++
              ) {
                studentRows[i].children[j].children[0].checked = false;
                studentRows[i].children[j].children[0].disabled = true;
                studentRows[i].children[j].classList.add("privilege");
                if (
                  studentRows[i].children[j].classList.contains("weekend") ||
                  studentRows[i].children[j].classList.contains("holiday")
                ) {
                  studentRows[i].children[j].classList.remove("privilege");
                }
              }
            }
          }
        }
      }
    }
    if (halfDayList[emailId[i].innerHTML]) {
      if (
        halfDayList[emailId[i].innerHTML].start.length ===
        halfDayList[emailId[i].innerHTML].end.length
      ) {
        for (
          let x = 0;
          x < halfDayList[emailId[i].innerHTML].start.length;
          x++
        ) {
          if (
            halfDayList[emailId[i].innerHTML].start[x] ===
            halfDayList[emailId[i].innerHTML].end[x]
          ) {
            studentRows[i].children[
              halfDayList[emailId[i].innerHTML].start[x] - 1
            ].children[0].checked = true;
            studentRows[i].children[
              halfDayList[emailId[i].innerHTML].start[x] - 1
            ].children[0].disabled = true;
            studentRows[i].children[
              halfDayList[emailId[i].innerHTML].start[x] - 1
            ].classList.remove("privilege");
            studentRows[i].children[
              halfDayList[emailId[i].innerHTML].start[x] - 1
            ].classList.add("halfPrivilege");
            if (
              studentRows[i].children[
                halfDayList[emailId[i].innerHTML].start[x] - 1
              ].classList.contains("weekend") ||
              studentRows[i].children[
                halfDayList[emailId[i].innerHTML].start[x] - 1
              ].classList.contains("holiday")
            ) {
              studentRows[i].children[
                halfDayList[emailId[i].innerHTML].start[x] - 1
              ].children[0].checked = false;
              studentRows[i].children[
                halfDayList[emailId[i].innerHTML].start[x] - 1
              ].classList.remove("halfPrivilege");
            }
          } else {
            for (
              let j = halfDayList[emailId[i].innerHTML].start[x];
              j < halfDayList[emailId[i].innerHTML].end[x] + 1;
              j++
            ) {
              studentRows[i].children[j - 1].children[0].checked = true;
              studentRows[i].children[j - 1].children[0].disabled = true;
              studentRows[i].children[j - 1].classList.remove("privilege");
              studentRows[i].children[j - 1].classList.add("halfPrivilege");
              if (
                studentRows[i].children[j - 1].classList.contains("weekend") ||
                studentRows[i].children[j - 1].classList.contains("holiday")
              ) {
                studentRows[i].children[j - 1].children[0].checked = false;
                studentRows[i].children[j - 1].classList.remove(
                  "halfPrivilege"
                );
              }
            }
          }
          if (
            halfDayList[emailId[i].innerHTML].start[0] ===
              priviousMonth[emailId[i].innerHTML].start[0] &&
            halfDayList[emailId[i].innerHTML].end[0] ===
              priviousMonth[emailId[i].innerHTML].end[0]
          ) {
            if (
              halfDayList[emailId[i].innerHTML].start[0] >
              halfDayList[emailId[i].innerHTML].end[0]
            ) {
              for (
                let j = 0;
                j < halfDayList[emailId[i].innerHTML].end[0];
                j++
              ) {
                studentRows[i].children[j].children[0].checked = true;
                studentRows[i].children[j].children[0].disabled = true;
                studentRows[i].children[j].classList.remove("privilege");
                studentRows[i].children[j].classList.add("halfPrivilege");
                if (
                  studentRows[i].children[j].classList.contains("weekend") ||
                  studentRows[i].children[j].classList.contains("holiday")
                ) {
                  studentRows[i].children[j].children[0].checked = false;
                  studentRows[i].children[j].classList.remove("halfPrivilege");
                }
              }
            }
          }
          if (
            halfDayList[emailId[i].innerHTML].start[
              halfDayList[emailId[i].innerHTML].start.length - 1
            ] === nextMonth[emailId[i].innerHTML].start[0] &&
            halfDayList[emailId[i].innerHTML].end[
              halfDayList[emailId[i].innerHTML].start.length - 1
            ] === nextMonth[emailId[i].innerHTML].end[0]
          ) {
            if (
              halfDayList[emailId[i].innerHTML].start[
                halfDayList[emailId[i].innerHTML].start.length - 1
              ] >
              halfDayList[emailId[i].innerHTML].end[
                halfDayList[emailId[i].innerHTML].start.length - 1
              ]
            ) {
              for (
                let j =
                  halfDayList[emailId[i].innerHTML].start[
                    halfDayList[emailId[i].innerHTML].start.length - 1
                  ];
                j < dat.length;
                j++
              ) {
                studentRows[i].children[j].children[0].checked = true;
                studentRows[i].children[j].children[0].disabled = true;
                studentRows[i].children[j].classList.remove("privilege");
                studentRows[i].children[j].classList.add("halfPrivilege");
                if (
                  studentRows[i].children[j].classList.contains("weekend") ||
                  studentRows[i].children[j].classList.contains("holiday")
                ) {
                  studentRows[i].children[j].children[0].checked = false;
                  studentRows[i].children[j].classList.remove("halfPrivilege");
                }
              }
            }
          }
        }
      }
    }
  }
};

const setReimbursement = async () => {
  const dat = document.querySelectorAll(".calender-table th");
  const emailId = document.querySelectorAll(".name-col");
  const studentRows = document.querySelectorAll("tbody .student");
  const res = await fetch("api/v2/reimbursement/leave/request");
  const data = await res.json();
  for (let n = 0; n < data.length; n++) {
    if (data[n].status === "confirm") {
      const holidayDate = new Date(data[n].holidayDate);
      const leaveTakenDate = new Date(data[n].leaveTakenDate);
      if (
        holidayDate.getFullYear() === date.getFullYear() &&
        holidayDate.getMonth() === date.getMonth()
      ) {
        for (let i = 0; i < emailId.length; i++) {
          if (data[n].email === emailId[i].innerHTML) {
            studentRows[i].children[holidayDate.getDate() - 1].classList.remove(
              "holiday"
            );
            studentRows[i].children[
              holidayDate.getDate() - 1
            ].children[0].checked = true;
            studentRows[i].children[
              holidayDate.getDate() - 1
            ].children[0].disabled = false;
          }
        }
      }
      if (
        leaveTakenDate.getFullYear() === date.getFullYear() &&
        leaveTakenDate.getMonth() === date.getMonth()
      ) {
        for (let i = 0; i < emailId.length; i++) {
          if (data[n].email === emailId[i].innerHTML) {
            studentRows[i].children[leaveTakenDate.getDate() - 1].classList.add(
              "compOff"
            );
            if (
              studentRows[i].children[leaveTakenDate.getDate() - 1].children[0]
                .checked === true
            ) {
              studentRows[i].children[
                leaveTakenDate.getDate() - 1
              ].children[0].checked = false;
            }
            studentRows[i].children[
              leaveTakenDate.getDate() - 1
            ].children[0].disabled = true;
          }
        }
      }
    }
  }
};

const setPagination = async (page = 1) => {
  const paginationUl = document.querySelector("nav .pagination");
  const { usersCount, filteredUsersCount, resultPerPage } = await userData();
  //count number of page in pagination
  const totalPages = Math.ceil(usersCount / resultPerPage);
  let liTag = "";
  let active;
  let beforePage = page - 1;
  let afterPage = page + 1;
  if (filteredUsersCount >= usersCount) {
    paginationUl.classList.add("pagination-hide");
  } else if (totalPages > 4) {
    if (page >= 1) {
      liTag += `<li class="page-item" onclick="changePageNumber(${
        page - 1
      })"><a class="page-link"><i class="fas fa-angle-left"></i> Prev</a></li>`;
    }

    if (page > 2) {
      //if page value is less than 2 then add 1 after the previous button
      liTag += `<li class="page-item" onclick="changePageNumber(1)"><a class="page-link">1</a></li>`;
      if (page > 3) {
        //if page value is greater than 3 then add this (...) after the first li or page
        liTag += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
      }
    }

    // how many pages or li show before the current li
    if (page == totalPages) {
      beforePage = beforePage - 2;
    } else if (page == totalPages - 1) {
      beforePage = beforePage - 1;
    }

    // how many pages or li show after the current li
    if (page == 1) {
      afterPage = afterPage + 2;
    } else if (page == 2) {
      afterPage = afterPage + 1;
    }

    for (var plength = beforePage; plength <= afterPage; plength++) {
      if (plength > totalPages) {
        //if plength is greater than totalPage length then continue
        continue;
      }
      if (plength == 0) {
        //if plength is 0 than add +1 in plength value
        plength = plength + 1;
      }
      if (page == plength) {
        //if page is equal to plength than assign active string in the active variable
        active = "active";
      } else {
        //else leave empty to the active variable
        active = "";
      }
      liTag += `<li class="page-item ${active}" onclick="changePageNumber(${plength})"><a class="page-link">${plength}</a></li>`;
    }

    if (page < totalPages - 1) {
      //if page value is less than totalPage value by -1 then show the last li or page
      if (page < totalPages - 2) {
        //if page value is less than totalPage value by -2 then add this (...) before the last li or page
        liTag += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
      }
      liTag += `<li class="page-item" onclick="changePageNumber(${totalPages})"><a class="page-link">${totalPages}</a></li>`;
    }

    if (page < totalPages) {
      //show the next button if the page value is less than totalPage(20)
      liTag += `<li class="page-item" onclick="changePageNumber(${
        page + 1
      })"><a class="page-link">Next <i class="fas fa-angle-right"></i></a></li>`;
    }

    paginationUl.innerHTML = liTag; //add li tag inside ul tag

    if (page === 1) {
      paginationUl.children[0].classList.add("pagination-hide");
    }
  } else {
    paginationUl.innerHTML = `<li class="page-item disabled">
        <a
          class="page-link"
          tabindex="-1"
          aria-disabled="true"
          onclick="changePageNumber('previous')"
        >Previous</a>
      </li>`;
    for (let k = 0; k < totalPages; k++) {
      paginationUl.innerHTML += `<li class="page-item"><a class="page-link" onclick="changePageNumber(${
        k + 1
      })">${k + 1}</a></li>`;
    }
    paginationUl.innerHTML += `<li class="page-item">
    <a class="page-link"  onclick="changePageNumber('next')">Next</a>
  </li>`;

    //for pagination controll
    for (let l = 0; l < paginationUl.children.length; l++) {
      if (l === page) {
        paginationUl.children[l].classList.add("active");
      } else {
        paginationUl.children[l].classList.remove("active");
      }
    }
    if (page === totalPages) {
      paginationUl.children[paginationUl.children.length - 1].classList.add(
        "disabled"
      );
      paginationUl.children[paginationUl.children.length - 1].classList.add(
        "pagination-hide"
      );
    } else {
      paginationUl.children[paginationUl.children.length - 1].classList.remove(
        "disabled"
      );
      paginationUl.children[paginationUl.children.length - 1].classList.remove(
        "pagination-hide"
      );
    }
    if (page !== 1) {
      paginationUl.children[0].classList.remove("disabled");
      paginationUl.children[0].classList.remove("pagination-hide");
    } else {
      paginationUl.children[0].classList.add("pagination-hide");
      paginationUl.children[0].classList.add("disabled");
    }
  }
};

const changePageNumber = async (page) => {
  const paginationUl = document.querySelector("nav .pagination");
  let active;
  for (let i = 0; i < paginationUl.children.length; i++) {
    if (paginationUl.children[i].classList.contains("active")) {
      active = i;
    }
  }
  let pageNum;
  if (page === "next") {
    pageNum = active + 1;
  } else if (page === "previous") {
    pageNum = active - 1;
  } else {
    pageNum = page;
  }
  userList(pageNum);
  countAbsent(pageNum);
  setPagination(pageNum);
  setTimeout(() => countAbsent(pageNum), 1000);
  setTimeout(() => sickLeaves(), 1000);
  setTimeout(() => casualLeaves(), 1000);
  setTimeout(() => privilegeLeaves(), 1000);
  setTimeout(() => setReimbursement(), 1000);
};

setTimeout(() => {
  document.querySelectorAll("input").forEach(function (i) {
    i.addEventListener("click", function () {
      countAbsent();
    });
  });
}, 1000);

function main() {
  userList();
  setTimeout(() => {
    countAbsent();
    sickLeaves();
    casualLeaves();
    privilegeLeaves();
    setReimbursement();
  }, 1000);
  setPagination();
}
main();
