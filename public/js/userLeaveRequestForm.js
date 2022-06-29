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
const setHeaders = async () => {
  const userUl = document.querySelector(".navbar-nav");
  const userName = document.querySelector(".navbar-brand .user-name-span");
  const userr = await user();
  userName.innerHTML = `${userr.fName} ${userr.lName}`;

  for (let j = 0; j < userUl.children.length; j++) {
    userUl.children[j].classList.remove("active");
    if (userUl.children[j].children[0].href === window.location.href) {
      userUl.children[j].classList.add("active");
    }
  }
};
setHeaders();

const decideDay = (type) => {
  const halfday = document.getElementById("halfday").checked;
  const firstShift = document.getElementById("firstShift").checked;
  const secondShift = document.getElementById("secondShift").checked;
  const shiftFirstDiv = document.getElementById("shift-first-div");
  const shiftSecondDiv = document.getElementById("shift-second-div");
  if (halfday === true) {
    if (type === "secondShift") {
      shiftFirstDiv.classList.add("hide");
      shiftSecondDiv.classList.remove("hide");
    } else if (type === "firstShift") {
      shiftFirstDiv.classList.remove("hide");
      shiftSecondDiv.classList.add("hide");
    } else if (type === "halfday") {
      if (firstShift === true) {
        shiftFirstDiv.classList.remove("hide");
        shiftSecondDiv.classList.add("hide");
      } else if (secondShift === true) {
        shiftFirstDiv.classList.add("hide");
        shiftSecondDiv.classList.remove("hide");
      }
    }
  } else if (type === "fullday") {
    shiftFirstDiv.classList.add("hide");
    shiftSecondDiv.classList.add("hide");
  }
};
const halfday = document.getElementById("halfday");
const fullday = document.getElementById("fullday");
const firstShift = document.getElementById("firstShift");
const secondShift = document.getElementById("secondShift");
fullday.addEventListener("click", () => decideDay("fullday"));
halfday.addEventListener("click", () => decideDay("halfday"));
firstShift.addEventListener("click", () => decideDay("firstShift"));
secondShift.addEventListener("click", () => decideDay("secondShift"));

const applyLeave = async () => {
  const halfday = document.getElementById("halfday").checked;
  const firstShift = document.getElementById("firstShift").checked;
  const secondShift = document.getElementById("secondShift").checked;
  const firstHalfFirst = document.getElementById("firstHalfFirst").checked;
  const secondHalfFirst = document.getElementById("secondHalfFirst").checked;
  const firstHalfSecond = document.getElementById("firstHalfSecond").checked;
  const secondHalfSecond = document.getElementById("secondHalfSecond").checked;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const typeOfLeave = document.getElementById("typeOfLeave").value;
  const message = document.getElementById("message").value;
  const errorRef = document.getElementById("error");
  const d = new Date();
  const da = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  const date = +new Date(da) + 5.5 * 60 * 60 * 1000;
  const start = +new Date(startDate);
  const end = +new Date(endDate);
  let typeOfDay, employeeHalf, employeeShift;
  if (halfday === true) {
    typeOfDay = "halfday";
    if (firstShift === false && secondShift === false) {
      return (errorRef.innerHTML = "Please select the shift");
    } else if (firstShift === true) {
      if (firstHalfFirst === false && secondHalfFirst === false) {
        return (errorRef.innerHTML = "Please select the shift time");
      }
      employeeHalf = firstHalfSecond === true ? "firstHalf" : "secondHalf";
    } else if (secondShift === true) {
      if (firstHalfSecond === false && secondHalfSecond === false) {
        return (errorRef.innerHTML = "Please select the shift time");
      }
      employeeHalf = firstHalfSecond === true ? "firstHalf" : "secondHalf";
    }
    employeeShift = firstShift === true ? "firstShift" : "secondShift";
  } else {
    typeOfDay = "fullday";
    if (firstShift === false && secondShift === false) {
      return (errorRef.innerHTML = "Please select the shift");
    }
    employeeShift = firstShift === true ? "firstShift" : "secondShift";
  }
  if (
    !startDate ||
    !endDate ||
    !typeOfLeave ||
    typeOfLeave === "options" ||
    !message
  ) {
    return (errorRef.innerHTML = "Please fill all the field of form");
  } else if (start < date || end < date) {
    return (errorRef.innerHTML =
      "Apply date must be greater than and equal to current date");
  } else if (start > end) {
    return (errorRef.innerHTML =
      "Ending date should be greater than starting date");
  } else if (typeOfLeave === "sick leave") {
    if (start !== date) {
      return (errorRef.innerHTML = "Sick leave only availble for current date");
    } else if (end > date + 24 * 60 * 60 * 1000) {
      return (errorRef.innerHTML = "You can take sick leave only of 2 days");
    }
  }

  let data = {
    startDate,
    endDate,
    typeOfLeave,
    message,
    typeOfDay,
    employeeShift,
  };
  if (halfday) {
    data.employeeHalf = employeeHalf;
  }

  const sendLeaveMail = await fetch("/api/v2/leaves/apply", {
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
    alert("Leave applied successfully");
  }
  window.location.href = "/";
};
