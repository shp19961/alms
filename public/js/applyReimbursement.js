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
const setHeaders = async () => {
  const userUl = document.querySelector(".navbar-nav");
  const userName = document.querySelector(".navbar-brand .user-name-span");
  const holidaySelect = document.querySelector("#holidayDate");
  const userr = await user();
  const res = await fetch("api/v2/admin/holiday");
  const data = await res.json();
  const holiday = [];
  for (let i = 0; i < data.length; i++) {
    const dataObj = Object.keys(data[i].holidayData);
    if (Number(dataObj[0]) === new Date().getFullYear()) {
      const monthObj = Object.keys(data[i].holidayData[dataObj[0]]);
      for (let j = 0; j < monthObj.length; j++) {
        if (data[i].holidayData[dataObj[0]][monthObj[j]].length > 0) {
          for (
            let m = 0;
            m < data[i].holidayData[dataObj[0]][monthObj[j]].length;
            m++
          ) {
            data[i].holidayData[dataObj[0]][monthObj[j]][m].date = `${
              dataObj[0]
            }/${j + 1}/${data[i].holidayData[dataObj[0]][monthObj[j]][m].date}`;
          }
        }
        holiday.push(...data[i].holidayData[dataObj[0]][months[j]]);
      }
    }
  }
  userName.innerHTML = `${userr.fName} ${userr.lName}`;

  // userUl.innerHTML = `
  // <li class="nav-item">
  // <a class="nav-link" aria-current="page" href="/">Home</a>
  // </li>
  // <li class="nav-item">
  // <a class="nav-link " aria-current="page" href="/applyleave">Apply Leaves</a>
  // </li>
  // <li class="nav-item">
  // <a class="nav-link " aria-current="page" href="/userleaves">Leaves Status</a>
  // </li>
  // <li class="nav-item">
  // <a class="nav-link " aria-current="page" href="/applyreimbursement">Apply Comp-Off</a>
  // </li>
  // <li class="nav-item">
  // <a class="nav-link " aria-current="page" href="/myreimbursement">Comp-Off Status</a>
  // </li>`;
  for (let a = 0; a < holiday.length; a++) {
    holidaySelect.innerHTML += `<option value="${holiday[a].date}">${holiday[a].date} - ${holiday[a].occasion}</option>`;
  }
  //showing active button
  for (let j = 0; j < userUl.children.length; j++) {
    userUl.children[j].classList.remove("active");
    if (userUl.children[j].children[0].href === window.location.href) {
      userUl.children[j].classList.add("active");
    }
  }
  for (let k = 0; k < holidaySelect.children.length; k++) {
    if (holidaySelect.children[k].value) {
      const getDate = new Date(holidaySelect.children[k].value);
      const d = new Date(holidaySelect.children[k].value);
      const hDate = +new Date(getDate);
      d.setMonth(d.getMonth() + 3);
      const checkDate = +d;
      if (
        checkDate < +new Date() ||
        hDate > +new Date() + 24 * 60 * 60 * 1000
      ) {
        holidaySelect.children[k].disabled = true;
      }
    }
  }
};
setHeaders();

const applyReimbursement = async () => {
  const holidayDate = document.getElementById("holidayDate").value;
  const leaveTakenDate = document.getElementById("takenDate").value;
  const errorRef = document.getElementById("error");
  const d = new Date(holidayDate);
  let da;
  if (d.getMonth() < 9) {
    da = `${d.getFullYear()}-${d.getMonth() + 4}-${d.getDate()}`;
  } else if (d.getMonth() === 9) {
    da = `${d.getFullYear() + 1}-${1}-${d.getDate()}`;
  } else if (d.getMonth() === 10) {
    da = `${d.getFullYear() + 1}-${2}-${d.getDate()}`;
  } else if (d.getMonth() === 11) {
    da = `${d.getFullYear() + 1}-${3}-${d.getDate()}`;
  }
  const beforeDate = +new Date(da);
  const start = +new Date(holidayDate);
  const end = +new Date(leaveTakenDate);
  if (!holidayDate || !leaveTakenDate) {
    return (errorRef.innerHTML = "Please fill all the field of form");
  } else if (holidayDate === "expired") {
    return (errorRef.innerHTML = "Please Select the available dates.");
  } else if (start > end) {
    return (errorRef.innerHTML =
      "You can take compensation after holiday date");
  } else if (new Date(start).getMonth() === new Date(end).getMonth()) {
    if (new Date(start).getDate() === new Date(end).getDate()) {
      return (errorRef.innerHTML = "You can't select same date");
    } else if (new Date(end).getDay() === 0 || new Date(end).getDay() === 6) {
      return (errorRef.innerHTML = "That day is already have a holiday");
    }
  } else if (new Date(end).getDay() === 0 || new Date(end).getDay() === 6) {
    return (errorRef.innerHTML = "That day is already have a holiday");
  } else if (beforeDate < end) {
    return (errorRef.innerHTML = "You can take compensation upto 3 month only");
  }

  const data = {
    holidayDate,
    leaveTakenDate,
  };

  const sendLeaveMail = await fetch("/api/v2/reimbursement/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const { success, error } = await sendLeaveMail.json();
  if (error) {
    return (errorRef.innerHTML = error);
  }
  if (success) {
    alert("leave applied successfully");
  }
  window.location.href = "/";
};
const submitBtn = document.getElementById("submit");
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  applyReimbursement();
});
