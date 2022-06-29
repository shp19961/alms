if (new Date().getMonth() !== 0) {
  window.location.replace("/");
}
const updateBtn = document.querySelector(".btn");
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

const updateHoliday = async (e) => {
  const holidayDetails = document.querySelectorAll(".input-group");
  const errorRef = document.querySelectorAll(".message");
  const updateError = document.querySelector("#updateError");

  let holidayArray = [];
  for (let i = 0; i < holidayDetails.length; i++) {
    for (let j = 0; j < holidayDetails[i].children.length; j++) {
      if (holidayDetails[i].children[j].value === "") {
        return errorRef[i].classList.toggle("hide");
      } else {
        errorRef[i].classList.contains("hide")
          ? ""
          : errorRef[i].classList.add("hide");
      }
    }
    //store holiday details
    holidayArray.push({
      date: holidayDetails[i].children[0].value,
      occasion: holidayDetails[i].children[1].value,
    });
  }
  const res = await fetch("/api/v2/admin/holiday/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(holidayArray),
  });

  const { success, error } = await res.json();
  if (error) {
    updateError.classList.remove("hide");
    return (updateError.innerHTML = error);
  } else if (success) {
    window.location.href = "/";
    updateError.classList.remove("hide");
    updateError.window.alert("Holiday updated successfully");
  } else {
    return (updateError.innerHTML =
      "Internal server error please try again later");
  }
};

updateBtn.addEventListener("click", (e) => {
  e.preventDefault();
  updateHoliday();
});
