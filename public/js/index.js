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

const userData = async () => {
  const data = await fetch("/api/v2/users");
  const { success, error, users } = await data.json();
  if (error) {
    return (window.location.href = "/login");
  }
  return users;
};
const userList = async () => {
  const rowOfUsers = document.querySelectorAll("table .users");
  const rowOfCheckBox = document.querySelector("table .checkBox-div");
  const rowOfmissed = document.querySelector("table .missed-div");
  const rowOfabsent = document.querySelector("table .absent-div");
  const users = await userData();
  let userRow = ``;
  let checkRow = ``;
  let missedRow = ``;
  let absentRow = ``;
  for (i = 0; i < users.length; i++) {
    userRow += `<tr class="user">
    <td class="name-col">${users[i].email}</td>
    <td>${users[i].fName}</td>
    <td>${users[i].lName}</td>
  </tr>`;
    checkRow += '<tr class="student"></tr>';
    missedRow += '<tr class="missed-col"><td><span>0</span>%</td></tr>';
    absentRow += `<tr class="absent-col">
    <td class ="absent-td">0</td>
    <td class ="sick-td">0</td>
    <td class ="planned-td">0</td>
  </tr>`;

    rowOfUsers[0].innerHTML = userRow;
    rowOfCheckBox.innerHTML = checkRow;
    rowOfmissed.innerHTML = missedRow;
    rowOfabsent.innerHTML = absentRow;
  }
  renderDate();
  // createAttendance();
  if (!localStorage.getItem(`present${key}`)) createPresent();
  if (!localStorage.getItem(`${key}`)) updateAttendance();
  // if(!localStorage.getItem(""))
  // setTimeout(() => countAbsent(), 1000);
};

// //check of admin
// const isAdmin = async () => {
//   const email = document.querySelector("#email").value;
//   const password = document.querySelector("#password").value;
//   const formContainer = document.querySelector(".form-container");
//   const error = document.querySelector("#error");
//   const users = await userData();
//   for (let i = 0; i < users.length; i++) {
//     // console.log(users);
//     if (users[i].role === "admin") {
//       const data = {
//         email,
//         password,
//       };
//       console.log(data);
//       const response = await fetch("/api/v2/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });
//       const userData = await response.json();
//       console.log(userData);
//       if (userData) {
//         formContainer.innerHTML = ` <h1>New User Details</h1>
//         <form>
//           <input
//             id="id"
//             type="number"
//             class="input-group"
//             placeholder="Unique Id"
//             required
//           />
//           <input
//             id="fName"
//             type="text"
//             class="input-group"
//             placeholder="first Name"
//             autocomplete="false"
//             required
//           />
//           <input
//             id="lName"
//             type="text"
//             class="input-group"
//             placeholder="Last Name"
//             required
//           />
//           <button type="button" id="btn" class="btn" onclick="addUser()">
//             Add User
//           </button>
//         </form>
//         <p id="error"></p>`;
//       }
//     } else {
//       error.innerHTML = "invalid Details";
//     }
//   }
// };

// //add new user
// const addUser = async () => {
//   const id = Number(document.querySelector("#id").value);
//   const fName = document.querySelector("#fName").value;
//   const lName = document.querySelector("#lName").value;
//   const error = document.querySelector("#error");
//   // const users = JSON.parse(localStorage.getItem("employees"));
//   const users = await userData();
//   if (!id || !fName || !lName) {
//     return (error.innerHTML = "please fill all the field of Form");
//   }

//   for (let i = 0; i < users.length; i++) {
//     if (id === users[i].id) {
//       return (error.innerHTML = "id already exits");
//     }
//   }
//   let newUser = {
//     id,
//     fName,
//     lName,
//   };
//   users.push(newUser);
//   localStorage.setItem("employees", JSON.stringify(users));
//   window.location.href = "http://127.0.0.1:5500/attendance.html";
// };

//render Date
const renderDate = () => {
  const monthDays = document.querySelector(".calender-table tbody tr");
  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();
  document.querySelector(".container .year").innerHTML = date.getFullYear();
  document.querySelector(".container h2").innerHTML = `${
    months[date.getMonth()]
  }-`;
  document.querySelector(".container p").innerHTML =
    date.toDateString() === new Date().toDateString()
      ? `${date.getDate()}-`
      : ``;
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
    box += `<td class="attend-col"><input type="checkbox" /></td>`;
    for (let j = 0; j < checkBoxDay.length; j++) {
      checkBoxDay[j].innerHTML = box;
    }
  }
  setAttendance();
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
  //weekend validation
  for (let i = 0; i < studentRows.length; i++) {
    for (let j = x; j < dat.length; j++) {
      // studentRows[i].children[j].children[0].checked = true;
      studentRows[i].children[j].children[0].disabled = true;
      studentRows[i].children[j].classList.add("weekend");
      // dat[j].classList.add("weekend");
      j += 6;
    }
    for (let k = y; k < dat.length; k++) {
      // studentRows[i].children[k].children[0].checked = true;
      studentRows[i].children[k].children[0].disabled = true;
      studentRows[i].children[k].classList.add("weekend");
      // dat[k].classList.add("weekend");
      k += 6;
    }
    // date validation
    // for (a = 0; a < currentDate - 1; a++) {
    //   studentRows[i].children[a].classList.add("passed");
    // }
    // for (b = currentDate; b < dat.length; b++) {
    //   studentRows[i].children[b].classList.add("passed");
    // }
  }
  holidays();
}

const holidays = () => {
  const dat = document.querySelectorAll(".calender-table th");
  const studentRows = document.querySelectorAll("tbody .student");
  const holly = {
    2022: {
      January: [26],
      February: [],
      March: [18],
      April: [14, 15],
      May: [1, 16],
      June: [],
      July: [],
      August: [11, 15, 19, 31],
      September: [8, 26],
      October: [5, 13, 14],
      November: [],
      December: [31],
    },
    2023: {
      January: [26],
      February: [],
      March: [18],
      April: [14, 15],
      May: [1, 16],
      June: [],
      July: [],
      August: [11, 15, 19, 31],
      September: [8, 26],
      October: [5, 13, 14],
      November: [],
      December: [31],
    },
  };
  localStorage.setItem("holidays", JSON.stringify(holly));
  const holiday = JSON.parse(localStorage.getItem("holidays"));
  const yearOfHoliday = holiday[date.getFullYear()];
  if (yearOfHoliday) {
    const monthOfHoliday = yearOfHoliday[months[date.getMonth()]];
    for (i = 0; i < studentRows.length; i++) {
      for (j = 0; j < dat.length; j++) {
        for (c = 0; c < monthOfHoliday.length; c++) {
          // studentRows[i].children[
          //   monthOfHoliday[c] - 1
          // ].children[0].checked = true;
          studentRows[i].children[
            monthOfHoliday[c] - 1
          ].children[0].disabled = true;
          studentRows[i].children[monthOfHoliday[c] - 1].classList.add(
            "holiday"
          );
        }
      }
    }
  }
};

//storing data my name
function createPresent() {
  let key = `${months[date.getMonth()]}${date.getFullYear()}`;
  const Name = document.querySelectorAll(".name-col");
  let present = {};
  let studentRows = document.querySelectorAll("tbody .student");
  for (let i = 0; i < Name.length; i++) {
    present[Name[i].innerHTML] = [];
    for (let j = 0; j < studentRows[0].children.length; j++) {
      present[`${Name[i].innerHTML}`].push(
        studentRows[i].children[j].children[0].checked
      );
      if (date.getFullYear() === new Date().getFullYear()) {
        if (date.getMonth() <= new Date().getMonth()) {
          localStorage.setItem(`present${key}`, JSON.stringify(present));
        }
      } else if (
        date.getFullYear() < new Date().getFullYear() &&
        new Date().getFullYear() > 2020
      ) {
        localStorage.setItem(`present${key}`, JSON.stringify(present));
      }
    }
  }
}

// updating attendance
function updateAttendance() {
  var input = document.querySelectorAll(".attend-col");
  let key = `${months[date.getMonth()]}${date.getFullYear()}`;
  let newAttendance = {};
  newAttendance[key] = [];
  input.forEach((i) => {
    newAttendance[key].push(i.children[0].checked);
  });
  if (date.getFullYear() === new Date().getFullYear()) {
    if (date.getMonth() <= new Date().getMonth()) {
      localStorage.setItem(`${key}`, JSON.stringify(newAttendance));
    }
  } else if (
    date.getFullYear() < new Date().getFullYear() &&
    new Date().getFullYear() > 2020
  ) {
    localStorage.setItem(`${key}`, JSON.stringify(newAttendance));
  }
}
// set attendance
function setAttendance() {
  var input = document.querySelectorAll(".attend-col");
  let key = `${months[date.getMonth()]}${date.getFullYear()}`;
  let data = JSON.parse(localStorage.getItem(`${key}`));
  if (data) {
    let attendance = data[key];
    input.forEach((i, index) => {
      i.children[0].checked = attendance[index];
    });
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
    // afterHoliday.push(studentRows[0].children[j].children[0].disabled);
    afterHoliday.push(studentRows[0].children[j].classList.contains("weekend"));
    afterHoliday.push(studentRows[0].children[j].classList.contains("holiday"));
  }
  for (i = 0; i <= date.getDate() - 1; i++) {
    // console.log(studentRows[0].children[i].children[0].disabled);
    totalHoliday.push(studentRows[0].children[i].classList.contains("weekend"));
    totalHoliday.push(studentRows[0].children[i].classList.contains("holiday"));
  }
  const freeHoliday = getMissedDay(totalHoliday);
  const afterDateHoliday = getMissedDay(afterHoliday);
  // console.log(freeHoliday);
  // console.log(afterDateHoliday);
  return { freeHoliday, afterDateHoliday };
};

//count missing days
function countAbsent() {
  const Name = document.querySelectorAll(".name-col");
  const missed = document.querySelectorAll("tbody .missed-col td span");
  const missedBox = document.querySelectorAll("tbody .missed-col td");
  const absentBox = document.querySelectorAll("tbody .absent-col .absent-td");
  let present = JSON.parse(localStorage.getItem(`present${key}`));
  const p = Object.getOwnPropertyNames(present);
  if (present) {
    const holidays = availableHolidays();
    for (let i = 0; i < p.length; i++) {
      absentBox[i].innerHTML = `${
        new Date().getDate() - getMissedDay(present[Name[i].innerHTML])
      }`;
      missed[i].innerHTML = `${Math.abs(
        Math.round(
          (getMissedDay(present[Name[i].innerHTML]) /
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

//get Date with weekend
// var getDaysArray = function (start, end) {
//   for (
//     var arr = [], dt = new Date(start);
//     dt <= end;
//     dt.setDate(dt.getDate() + 1)
//   ) {
//     arr.push(new Date(dt));
//   }
//   return arr;
// };

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

// sick leave applied
const sickLeaves = async () => {
  const dat = document.querySelectorAll(".calender-table th");
  const emailId = document.querySelectorAll(".name-col");
  const studentRows = document.querySelectorAll("tbody .student");
  const sickBox = document.querySelectorAll("tbody .absent-col .sick-td");
  let sickList = {};
  let sickCol = {};
  const users = await userData();
  for (let i = 0; i < users.length; i++) {
    if (users[i].leaves.length > 0) {
      for (a = 0; a < users[i].leaves.length; a++) {
        if (users[i].leaves[a].typeOfLeave === "sick leave") {
          sickCol[`${users[i].email}`] = [];
          sickList[`${users[i].email}`] = {
            start: [],
            end: [],
          };
          for (let j = 0; j < users[i].leaves.length; j++) {
            const start = new Date(users[i].leaves[j].startDate);
            const end = new Date(users[i].leaves[j].endDate);
            //sick col
            if (
              start.getFullYear() === new Date().getFullYear() &&
              end.getFullYear() === new Date().getFullYear()
            ) {
              // const days = getDaysArray(start, end);
              const days = getBusinessDateCount(start, end);
              sickCol[`${users[i].email}`].push(days);
            }
            //sick input
            if (
              start.getFullYear() === new Date().getFullYear() &&
              start.getMonth() === new Date().getMonth()
            ) {
              sickList[`${users[i].email}`].start.push(start.getDate());
            }
            if (
              end.getFullYear() === new Date().getFullYear() &&
              end.getMonth() === new Date().getMonth()
            ) {
              sickList[`${users[i].email}`].end.push(end.getDate());
            }
          }
        }
      }
    }
    if (sickCol[`${users[i].email}`] === undefined) {
      sickBox[i].innerHTML = 0;
    } else {
      sickBox[i].innerHTML = sickCol[`${users[i].email}`].reduce(
        (partialSum, a) => partialSum + a,
        0
      );
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
              sickList[emailId[i].innerHTML].start[0] - 1
            ].children[0].disabled = true;
            studentRows[i].children[
              sickList[emailId[i].innerHTML].start[0] - 1
            ].classList.add("sick");
          } else {
            for (
              let j = sickList[emailId[i].innerHTML].start[x];
              j < sickList[emailId[i].innerHTML].end[x] + 1;
              j++
            ) {
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
        }
      }
      if (
        sickList[emailId[i].innerHTML].start.length !==
        sickList[emailId[i].innerHTML].end.length
      ) {
        if (sickList[emailId[i].innerHTML].start.length === 0) {
          for (let x = 0; x < sickList[emailId[i].innerHTML].end[0] - 1; x++) {
            studentRows[i].children[x].children[0].disabled = true;
            studentRows[i].children[x].classList.add("sick");
            if (
              studentRows[i].children[x].classList.contains("weekend") ||
              studentRows[i].children[x].classList.contains("holiday")
            ) {
              studentRows[i].children[x].classList.remove("sick");
            }
          }
        }
        if (sickList[emailId[i].innerHTML].end.length === 0) {
          for (
            let x = sickList[emailId[i].innerHTML].start[0] - 1;
            x < dat.length;
            x++
          ) {
            studentRows[i].children[x].children[0].disabled = true;
            studentRows[i].children[x].classList.add("sick");
            if (
              studentRows[i].children[x].classList.contains("weekend") ||
              studentRows[i].children[x].classList.contains("holiday")
            ) {
              studentRows[i].children[x].classList.remove("sick");
            }
          }
        }
      }
    }
  }
};

setTimeout(() => {
  document.querySelectorAll("input").forEach(function (i) {
    i.addEventListener("click", function () {
      // console.log("working");
      updateAttendance();
      createPresent();
      countAbsent();
    });
  });
}, 1000);
// };

function main() {
  userList();
  // setTimeout(() => availableHolidays(), 1000);
  setTimeout(() => countAbsent(), 1000);
  setTimeout(() => sickLeaves(), 2000);
  // sickLeavesCol();
  // availableHolidays();
}
main();
