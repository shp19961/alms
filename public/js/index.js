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
  const { error, user } = await data.json();
  if (error) {
    return (window.location.href = "/login");
  }
  return user;
};

const userData = async (page=1) => {
  const data = await fetch(`/api/v2/users?page=${page}`);
  const {
    success,
    error,
    users,
    usersCount,
    filteredUsersCount,
    resultPerPage,
  } = await data.json();
  return { users, usersCount, filteredUsersCount, resultPerPage };
};

const AllLeaves = async () => {
  const data = await fetch("/api/v2/user/leaves/all");
  const leaves = await data.json();
  return leaves;
};
const AllUsersLeaves = async () => {
  const data = await fetch("/api/v2/users/leaves");
  const leaves = await data.json();
  return leaves;
};

const userList = async (page = 1) => {
  const mainContainer = document.querySelector(".main-container");
  const rowOfUsers = document.querySelector("table .users");
  const userUl = document.querySelector(".navbar-nav");
  const attendanceNote = document.querySelector(".attendance-note");
  const rowOfCheckBox = document.querySelector("table .checkBox-div");
  const rowOfmissed = document.querySelector("table .missed-div");
  const rowOfabsent = document.querySelector("table .absent-div");
  const userName = document.querySelector(".navbar-brand .user-name-span");
  const missedTr = document.querySelector(".missed-tr");
  const presentTable = document.querySelector(".present-table");
  const calenderTable = document.querySelector(".calender-table");
  const colorContainer = document.querySelector(".color-box-container");
  const colorBox = document.querySelectorAll(".color-box");
  const arrowDiv = document.querySelector(".arrow-div");
  const paginationUl = document.querySelector("nav .pagination");
  const forgetButtonContainer = document.querySelector(
    ".forget-button-container"
  );

  const userr = await user();
  let users;
  let srNum = 0;
  if (userr.role === "admin") {
    const { users: usersDetails, resultPerPage } = await userData(page);
    users = usersDetails;
    srNum = page * resultPerPage - resultPerPage;
    if (window.innerWidth > 500) {
      mainContainer.classList.add("admin-main-container");
    } else {
      mainContainer.classList.remove("admin-main-container");
    }
  } else {
    users = [userr];
    paginationUl.classList.add("pagination-hide");
  }
  if (userr.role === "admin") {
    userName.innerHTML = `${userr.fName} ${userr.lName} (admin)`;
    presentTable.classList.add("hide");
    calenderTable.classList.add("hide");
    //hide weekend box
    colorContainer.children[0].classList.add("hide");
    //hide holiday box
    colorContainer.children[1].classList.add("hide");
    //hide comp-off box
    colorContainer.children[5].classList.add("hide");
    //hide half sick box
    colorContainer.children[6].classList.add("hide");
    //hide half casual box
    colorContainer.children[7].classList.add("hide");
    //hide half privilege box
    colorContainer.children[8].classList.add("hide");
    arrowDiv.classList.add("hide");
    forgetButtonContainer.classList.add("hide");
    //hide color box
    colorBox.forEach((item) => item.classList.add("hide"));

    userUl.innerHTML = `<li class="nav-item">
    <a class="nav-link" aria-current="page" href="/">Home</a>
  </li>
  <a class="nav-link" href="/holiday">Update Holiday</a>
  <li class="nav-item">
          <a class="nav-link" aria-current="page" href="/admin/dashboard">Dashboard</a>
        </li>
  <li class="nav-item">
  </li>
  <li class="nav-item dropdown">
    <a
      class="nav-link dropdown-toggle"
      href="#"
      id="navbarDropdown"
      role="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      Employee
    </a>
    <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
      <li><a class="dropdown-item" href="/new">New Employee</a></li>
      <li><a class="dropdown-item" href="/archive">Archive Employee</a></li>
      <li><a class="dropdown-item" href="/allusers">All Employee</a></li>
      <li><a class="dropdown-item" href="/userdetails">Employee Details</a></li>
    </ul>
  </li>
  <li class="nav-item dropdown">
    <a
      class="nav-link dropdown-toggle"
      href="#"
      id="navbarDropdown"
      role="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      Requests
    </a>
    <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
      <li><a class="dropdown-item" href="/reqleave">Update Leaves</a></li>
      <li><a class="dropdown-item" href="/oldreqleave">Old Leaves</a></li>
      <li><a
          class="dropdown-item"
          href="/reqreimbursement"
        >Comp-Off</a></li>
        <li>
              <a
              class="dropdown-item"
                href="/attendance/forgot/request"
              >Forgot Attendance</a>
            </li>
    </ul>
  </li>`;
    //hide hoilday button for other months
    if (date.getMonth() !== 0) {
      userUl.children[1].classList.add("hide");
    }
  } else {
    userName.innerHTML = `${userr.fName} ${userr.lName}`;
    attendanceNote.innerHTML =
      userr.shiftTiming === "FirstShift"
        ? `<p>You can mark your attendance between 11:00 am to 11:30 am</p>`
        : `<p>You can mark your attendance between 02:00 pm to 02:30 pm</p>`;
    userUl.innerHTML = `
    <li class="nav-item">
    <a class="nav-link" aria-current="page" href="/">Home</a>
    </li>
    <li class="nav-item">
    <a class="nav-link" aria-current="page" href="/dashboard">Dashboard</a>
    </li>
    <li class="nav-item">
    <a class="nav-link " aria-current="page" href="/applyleave">Apply Leaves</a>
    </li>
    <li class="nav-item">
    <a class="nav-link " aria-current="page" href="/userleaves">Leaves Status</a>
    </li>
    <li class="nav-item">
    <a class="nav-link " aria-current="page" href="/applyreimbursement">Apply Comp-Off</a>
    </li>
    <li class="nav-item">
    <a class="nav-link " aria-current="page" href="/myreimbursement">Comp-Off Status</a>
    </li>
    <li class="nav-item">
          <a class="nav-link " aria-current="page" href="/attendance/forgot/list">forgot Attendance Status</a>
      </li>`;
  }
  //sr num change

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

    //increse sr num
    srNum++;
    checkRow += '<tr class="student"></tr>';
    if (userr.role === "admin") {
      missedTr.innerHTML = `
      <th>SL</th>
      <th>CL</th>
      <th>PL</th>`;
      absentRow += `<tr class="absent-col">
      <td class ="sick-td">0/6</td>
      <td class ="casual-td">0/6</td>
      <td class ="privilege-td">0/12</td>
    </tr>`;
      // give admin home page another css
      missedTr.parentElement.parentElement.parentElement.classList.add(
        "admin-view"
      );
    } else {
      missedTr.innerHTML = `
      <th>SL</th>
      <th>CL</th>
      <th>PL</th>`;
      absentRow += `<tr class="absent-col">
      <td class ="sick-td">0/6</td>
      <td class ="casual-td">0/6</td>
      <td class ="privilege-td">0/12</td>
    </tr>`;
      missedRow += '<tr class="missed-col"><td><span>0</span>%</td></tr>';
    }

    rowOfUsers.innerHTML = userRow;
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
        break;
      }
    }
  }
  renderDate();
};

//render Date
const renderDate = () => {
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
  let days = ``;
  for (let i = 1; i <= lastDay; i++) {
    days += `<th>${i}</th>`;
    monthDays.innerHTML = days;
  }
  setInput();
  fixDate();
};

const setInput = () => {
  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();
  const checkBoxDay = document.querySelectorAll("tbody .student");
  let box = ``;
  for (let i = 1; i <= lastDay; i++) {
    box += `<td class="attend-col"><input class="input-attendace" type="checkbox" /></td>`;
    for (let j = 0; j < checkBoxDay.length; j++) {
      checkBoxDay[j].innerHTML = box;
    }
  }
  setAttendance();
};

async function fixDate() {
  const firstDate = new Date(date.getFullYear(), date.getMonth()).getDay();
  const currentDate = new Date().getDate();
  const currentTime = +new Date();
  const userr = await user();

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
  //weekend validation
  for (let i = 0; i < studentRows.length; i++) {
    for (let x = 0; x < dat.length; x++) {
      if (userdetails.email !== email[i].innerHTML) {
        studentRows[i].children[x].classList.add("passed");
      }

      //disabled before joining date
      if (userdetails.email === email[i].innerHTML) {
        if (userdetails.joiningDate) {
          const join = new Date(userdetails.joiningDate);
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
    }
    //disabled weekend before date
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
      studentRows[i].children[b].classList.add("passed");
      if (userr.validTime < currentTime) {
        studentRows[i].children[b - 1].classList.add("passed");
      }
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

//post attendance in employee database
const postAttendance = async () => {
  const studentRows = document.querySelector("tbody .student");
  let key = `${months[date.getMonth()]}${date.getFullYear()}`;
  let attendance = [];
  for (let i = 0; i < studentRows.children.length; i++) {
    attendance.push(studentRows.children[i].children[0].checked);
  }
  const attendanceData = {};
  attendanceData[key] = attendance;
  const res = await fetch("/api/v2/user/attendance/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(attendanceData),
  });
};

// set attendance
async function setAttendance() {
  var input = document.querySelectorAll(".attend-col");
  let key = `${months[date.getMonth()]}${date.getFullYear()}`;
  const res = await fetch("/api/v2/user/attendance");
  let attend = await res.json();
  if (attend) {
    let attendance = attend[key];
    input.forEach((i, index) => {
      i.children[0].checked = attendance[index];
    });
  }

  //colling other function to run
  countAbsent();
  sickLeaves();
  casualLeaves();
  privilegeLeaves();
  setReimbursement();
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
async function countAbsent() {
  const Name = document.querySelectorAll(".name-col");
  const missed = document.querySelectorAll("tbody .missed-col td span");
  const missedBox = document.querySelectorAll("tbody .missed-col td");
  const absentBox = document.querySelectorAll("tbody .absent-col .absent-td");
  const res = await fetch("/api/v2/user/attendance");
  let present = await res.json();
  const userr = await user();
  const p = Object.getOwnPropertyNames(present);
  if (present) {
    const holidays = availableHolidays();
    for (let i = 0; i < p.length; i++) {
      // absentBox[i].innerHTML = `${
      //   new Date().getDate() - getMissedDay(present[key]) - holidays.freeHoliday
      // }`;
      if (userr.role !== "user") {
        return;
      }
      missed[i].innerHTML = `${Math.abs(
        Math.round(
          (getMissedDay(present[key]) /
            (date.getDate() - holidays.freeHoliday)) *
            100
        )
      )}`;
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
  const userr = await user();
  let AllLeave;
  if (userr.role === "admin") {
    AllLeave = await AllUsersLeaves();
  } else {
    AllLeave = await AllLeaves();
  }
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
                const days = getBusinessDateCount(start, end);
                sickCol[`${users[i].email}`].push(days);
                if (users[i].leaves[j].typeOfDay === "halfday") {
                  const halfDays = getBusinessDateCount(halfStart, halfEnd);
                  halfDayCol[`${users[i].email}`].push(halfDays);
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
    let totalSick = 6;
    let data;
    for (let b = 0; b < compare.length; b++) {
      for (let a = 0; a < emailId.length; a++) {
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
          sickBox[a].innerHTML = `${data - halfData / 2}/${totalSick}`;
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
              //sick col
              if (
                start.getFullYear() === new Date().getFullYear() &&
                end.getFullYear() === new Date().getFullYear()
              ) {
                const days = getBusinessDateCount(start, end);
                casualCol[`${users[i].email}`].push(days);
                if (users[i].leaves[j].typeOfDay === "halfday") {
                  const halfDays = getBusinessDateCount(halfStart, halfEnd);
                  halfDayCol[`${users[i].email}`].push(halfDays);
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
    let totalCasual = 6;
    let data;
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
          casualBox[a].innerHTML = `${data - halfData / 2}/${totalCasual}`;
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
              //sick col
              if (
                start.getFullYear() === new Date().getFullYear() &&
                end.getFullYear() === new Date().getFullYear()
              ) {
                const days = getBusinessDateCount(start, end);
                privilegeCol[`${users[i].email}`].push(days);
                if (users[i].leaves[j].typeOfDay === "halfday") {
                  const halfDays = getBusinessDateCount(halfStart, halfEnd);
                  halfDayCol[`${users[i].email}`].push(halfDays);
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
    let totalPrivilege = 12;
    for (let a = 0; a < emailId.length; a++) {
      for (let b = 0; b < compare.length; b++) {
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
          privilegeBox[a].innerHTML = `${
            data - halfData / 2
          }/${totalPrivilege}`;
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
            ].children[0].disabled = false;
            studentRows[i].children[
              holidayDate.getDate() - 1
            ].children[0].checked = true;
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
  const totalPages = Math.ceil(usersCount / resultPerPage);
  let liTag = "";
  let active;
  let beforePage = page - 1;
  let afterPage = page + 1;
  //count number of page in pagination
  if (filteredUsersCount <= resultPerPage) {
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
  setPagination(pageNum);
  userList(pageNum);
  // setTimeout(() => countAbsent(), 1000);
  // setTimeout(() => sickLeaves(), 1000);
  // setTimeout(() => casualLeaves(), 1000);
  // setTimeout(() => privilegeLeaves(), 1000);
  // setTimeout(() => setReimbursement(), 1000);
};

setTimeout(() => {
  document.querySelectorAll(".input-attendace").forEach(function (i, index) {
    i.addEventListener("click", function () {
      postAttendance();
      countAbsent();
    });
  });
}, 1000);
// };

async function main() {
  const userr = await user();
  userList();
  // setTimeout(() => {
  //   // countAbsent();
  //   // sickLeaves();
  //   // casualLeaves();
  //   // privilegeLeaves();
  // }, 1000);
  // setTimeout(() => setReimbursement(), 1100);
  if (userr.role === "admin") {
    setPagination();
  }
}
main();

// select button reference
const forgetAttendanceButton = document.querySelector("#forget-attendance");
//work on done button reference
const doneButton = document.querySelector(".update-attendace-done-button");
//work on cross button reference
const crossButton = document.querySelector(
  ".pop-cross-button #popup-cross-mark"
);
//referencess
const forgetEdit = document.querySelector(".forget-edit");
const forgetCancel = document.querySelector(".forget-cancel");
const forgetSend = document.querySelector(".forget-send");
const mainPopup = document.querySelector(".main-popup");
const popDiv = document.querySelector(".pop-div");
const datesContainer = document.querySelector(".dates-container");
const inputDateSelecter = document.querySelector(".input-date-selecter");
const forgetDates = document.getElementById("forgetDatePicker");
const errorMessage = document.querySelector(".pop-div .message");

//config for calender
let config = {
  dateFormat: "Y-m-d",
  minDate: new Date(date.getFullYear(), date.getMonth() - 1, 1),
  maxDate: "today",
  locale: {
    firstDayOfWeek: 1, // start week on Monday
  },
};
forgetAttendanceButton.addEventListener("click", () => {
  doneButton.value = forgetAttendanceButton.value;
  if (forgetAttendanceButton.value === "Sequential") {
    mainPopup.classList.remove("hide");
    config.mode = "range";
    config.disable = [];
  } else if (forgetAttendanceButton.value === "Multiple") {
    mainPopup.classList.remove("hide");
    config.mode = "multiple";
    config.disable = [
      function (date) {
        return date.getDay() === 0 || date.getDay() === 6;
      },
    ];
  }
  forgetAttendanceButton.selectedIndex = 0;
  // forgetDatePicker
  flatpickr("#forgetDatePicker", config);
});

//done button work
doneButton.addEventListener("click", () => {
  let selectedDates = ``;
  let arrayOfForgetDate;
  const sameCheckBox = document.querySelector(".sameCheckBox");
  const sameCheckBoxInput = document.querySelector(
    ".sameCheckBox .sameCheckBoxInput"
  );
  if (forgetDates.value.length < 1) {
    return alert("Please select the date...");
  }

  if (doneButton.value === "Sequential") {
    arrayOfForgetDate = forgetDates.value.split("to");

    selectedDates = ` <div class="dateDiv">
    <p><span>${arrayOfForgetDate[0]}</span><span>TO</span><span>${
      arrayOfForgetDate[1] ? arrayOfForgetDate[1] : arrayOfForgetDate[0]
    }</span></p>
       <input type="text" class="forget-reason-input" placeholder="Reason ?">
     </div>`;
  } else if (doneButton.value === "Multiple") {
    arrayOfForgetDate = forgetDates.value.split(",");
    if (arrayOfForgetDate.length > 1) {
      sameCheckBox.classList.remove("hide");
    } else {
      sameCheckBox.classList.add("hide");
    }

    arrayOfForgetDate.forEach((d) => {
      selectedDates += ` <div class="dateDiv">
       <p>${d}</p>
       <input type="text" class="forget-reason-input" placeholder="Reason ?">
     </div>`;
    });
  }
  datesContainer.innerHTML = selectedDates;
  inputDateSelecter.classList.add("hide");
  popDiv.classList.remove("hide");
  const inputDates = document.querySelectorAll(".forget-reason-input");
  inputDates[0].addEventListener("input", () => {
    if (inputDates[0].value.length > 0) {
      sameCheckBoxInput.disabled = false;
    } else {
      sameCheckBoxInput.disabled = true;
    }
  });
  sameCheckBoxInput.addEventListener("click", () => {
    if (sameCheckBoxInput.checked === true) {
      inputDates.forEach((inputField) => {
        inputField.value = inputDates[0].value;
      });
    } else {
      inputDates.forEach((inputField, index) => {
        if (index !== 0) {
          inputField.value = "";
        }
      });
    }
  });
});

//cross button javascript
crossButton.addEventListener("click", () => {
  mainPopup.classList.add("hide");
  popDiv.classList.add("hide");
  inputDateSelecter.classList.remove("hide");
  forgetDates.value = "";
  datesContainer.innerHTML = "";
});

forgetEdit.addEventListener("click", () => {
  popDiv.classList.add("hide");
  inputDateSelecter.classList.remove("hide");
});

forgetCancel.addEventListener("click", () => {
  mainPopup.classList.add("hide");
  popDiv.classList.add("hide");
  inputDateSelecter.classList.remove("hide");
  forgetDates.value = "";
  datesContainer.innerHTML = "";
});

forgetSend.addEventListener("click", async () => {
  let messageArray = [];
  let arrayOfForgetDate;
  for (let i = 0; i < datesContainer.children.length; i++) {
    if (datesContainer.children[i].children[1].value.length < 1) {
      errorMessage.innerHTML = "Please fill the require field";
      return setTimeout(() => (errorMessage.innerHTML = ""), 3000);
    } else {
      messageArray.push(datesContainer.children[i].children[1].value);
    }
  }
  if (doneButton.value === "Sequential") {
    arrayOfForgetDate = forgetDates.value.split("to");
    const startDate = new Date(arrayOfForgetDate[0]);
    const endDate = new Date(arrayOfForgetDate[1]);
    if (
      startDate.getDay() === 0 ||
      startDate.getDay() === 6 ||
      endDate.getDay() === 0 ||
      endDate.getDay() === 6
    ) {
      errorMessage.innerHTML = "Please don't start and end with weekend date";
      return setTimeout(() => (errorMessage.innerHTML = ""), 3000);
    }
  } else if (doneButton.value === "Multiple") {
    arrayOfForgetDate = forgetDates.value.split(",");
  }

  let forgetDateReq = {
    forgetType: doneButton.value,
    dates: arrayOfForgetDate,
    messages: messageArray,
  };
  const sendLeaveMail = await fetch("/api/v2/attendance/forget/apply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(forgetDateReq),
  });
  const { success, error } = await sendLeaveMail.json();
  if (error) {
    errorMessage.innerHTML = error;
    return setTimeout(() => (errorMessage.innerHTML = ""), 3000);
  }
  if (success) {
    alert("Request applied successfully");
  }
  mainPopup.classList.add("hide");
  popDiv.classList.add("hide");
  inputDateSelecter.classList.remove("hide");
  forgetDates.value = "";
  datesContainer.innerHTML = "";
});
