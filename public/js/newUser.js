const user = async () => {
  const data = await fetch("/api/v2/user/me");
  const { error, user } = await data.json();
  if (error) {
    return (window.location.href = "/login");
  }
  return user;
};

const logoutUser = async () => {
  const res = await fetch("/api/v2/user/logout");
  const data = await res.json();
  window.location.href = "/login";
};

const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let employeeId;

const setHeaders = async () => {
  const userUl = document.querySelector(".navbar-nav");
  const userName = document.querySelector(".navbar-brand .user-name-span");
  const selectDiv = document.querySelector("#dateBox");
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
  let date = new Date();
  selectDiv.innerHTML += `<option value = "${date.toLocaleDateString()}">${
    weekday[date.getDay()]
  } - ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}</option>`;
  for (let k = 6; k > 0; k--) {
    date.setDate(date.getDate() - 1);
    selectDiv.innerHTML += `<option value = "${date.toLocaleDateString()}">${
      weekday[date.getDay()]
    } - ${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}</option>`;
  }
};

setHeaders();

//check email valid our not
const emailInput = document.getElementById("email");
const validEmail = async (email) => {
  var format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  valid = email + "@uvxcel.com";

  if (email.length < 2) {
    return emailInput.classList.add("invalid");
  } else if (format.test(email) === true) {
    return emailInput.classList.add("invalid");
  } else {
    let res = await fetch(`/api/v2/users/check/${valid}`);
    let { success } = await res.json();
    if (success === true) {
      return emailInput.classList.add("invalid");
    } else {
      return emailInput.classList.remove("invalid");
    }
  }
};
emailInput.addEventListener("input", async (e) => validEmail(e.target.value));

//check designation validity
document.querySelector("#designationBox").addEventListener("change", (e) => {
  const otherDesignation = document.querySelector("#otherDesignation");
  if (e.target.value === "Others") {
    otherDesignation.classList.remove("hide");
  } else {
    otherDesignation.classList.add("hide");
  }
});

//capitalization
function capitalize(input) {
  var words = input.split(" ");
  var CapitalizedWords = [];
  words.forEach((element) => {
    CapitalizedWords.push(
      element[0].toUpperCase() + element.slice(1, element.length)
    );
  });
  return CapitalizedWords.join(" ");
}

const registerUser = async () => {
  const email = document.querySelector("#email");
  let fName = document.querySelector("#fName").value.trim();
  let lName = document.querySelector("#lName").value.trim();
  const gender = document.querySelector("#genderBox").value;
  const joiningDate = document.querySelector("#dateBox").value;
  const shiftTiming = document.querySelector("#shiftBox").value;
  const designationBox = document.querySelector("#designationBox").value;
  const otherDesignation = document
    .querySelector("#otherDesignation")
    .value.trim();
  const tempPassword = document.querySelector("#tempPassword").value;
  const cTempPassword = document.querySelector("#cTempPassword").value;
  const errorRef = document.querySelector("#error");
  const validName = /^[a-zA-Z]*$/;
  let designation;

  if (
    !email.value ||
    !fName ||
    !lName ||
    !gender ||
    !joiningDate ||
    !shiftTiming ||
    !designationBox ||
    !tempPassword ||
    !cTempPassword
  ) {
    return (errorRef.innerHTML = "Please fill all the field of form");
  } else if (email.classList.contains("invalid")) {
    return (errorRef.innerHTML = "Please select the valid Email Id");
  } else if (validName.test(fName) === false) {
    return (errorRef.innerHTML = "First Name only contain letters");
  } else if (validName.test(lName) === false) {
    return (errorRef.innerHTML = "Last Name only contain letters");
  } else if (tempPassword.length < 8) {
    return (errorRef.innerHTML = "Password must contain minimum 8 characters");
  } else if (tempPassword !== cTempPassword) {
    return (errorRef.innerHTML = "Password not matched");
  } else {
    errorRef.innerHTML = "";
  }

  if (designationBox === "Others") {
    if (!otherDesignation) {
      return (errorRef.innerHTML = "Please fill the designation field");
    } else if (validName.test(otherDesignation) === false) {
      return (errorRef.innerHTML = "Designation name can only contain letters");
    } else {
      designation = capitalize(otherDesignation);
    }
  } else {
    designation = designationBox;
  }
  //capitalization
  fName = capitalize(fName);
  lName = capitalize(lName);
  const emailId = email.value.trim() + "@uvxcel.com";
  const data = {
    email: emailId,
    fName,
    lName,
    gender,
    joiningDate,
    tempPassword,
    cTempPassword,
    shiftTiming,
    designation,
  };
  const res = await fetch("/api/v2/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const { success, error } = await res.json();
  if (error) {
    return (errorRef.innerHTML = error);
  } else if (success) {
    window.alert("Employee registration successfully");
    window.location.href = "/";
  } else {
    return (error.innerHTML = "Internal server error please try again later");
  }
};
