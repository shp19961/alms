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

const newLeaveRequests = async (page) => {
  const data = await fetch(
    `/api/v2/user/attendace/forget/request?page=${page}`
  );
  const {
    forgetAttendance,
    filteredForgetAttendanceCount,
    resultPerPage,
    forgetAttendanceCount,
  } = await data.json();
  return {
    forgetAttendance,
    filteredForgetAttendanceCount,
    resultPerPage,
    forgetAttendanceCount,
  };
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

const userRequest = async (page = 1) => {
  setHeaders();
  const contentDiv = document.querySelector(".content-div");
  const { forgetAttendance: reqData, resultPerPage } = await newLeaveRequests(
    page
  );
  if (page) {
    contentDiv.innerHTML = ``;
  }
  let srNum = page * resultPerPage - resultPerPage;
  for (i = 0; i < reqData.length; i++) {
    if (reqData[i].status === "confirm") {
      if (reqData[i].forgetType === "Sequential") {
        contentDiv.innerHTML += `<tr class="column_of_table">
        <td>${srNum + 1}</td>
        <td>${reqData[i].email}</td>
        <td>${reqData[i].fName}</span> <span>${reqData[i].lName}</td>
        <td>
          <p>${reqData[i].dates[0]}</p>
          To
          <p>${
            reqData[i].dates[1] ? reqData[i].dates[1] : reqData[i].dates[0]
          }</p>
        </td>
        <td>${reqData[i].messages[0]}</td>
        <td>
          <div class="button-group">
          <button id="${
            reqData[i]._id
          }" class="acceptToggleColor req-button" value="confirm" disabled><span>&#10003;</span>
          </button>
          <button id="${
            reqData[i]._id
          }" class="choose req-button" value="denied" disabled><span>&#128473;</span></button>
          <button id="${
            reqData[i].disabledEdit
          }" class="editBtn req-button" value="edit" ><span>&#9998;</span></button>
          </div>
        </td>
      </tr>`;
      } else if (reqData[i].forgetType === "Multiple") {
        let extraDates = ``;
        if (reqData[i].dates.length > 1) {
          for (let j = 1; j < reqData[i].dates.length; j++) {
            extraDates += `<tr>
                <td>${reqData[i].dates[j]}</td>
                <td>${reqData[i].messages[j]}</td>
                </tr>`;
          }
        }
        contentDiv.innerHTML += `<tr class="column_of_table">
        <td rowspan="${reqData[i].dates.length}">${srNum + 1}</td>
        <td rowspan="${reqData[i].dates.length}">${reqData[i].email}</td>
        <td rowspan="${reqData[i].dates.length}">${
          reqData[i].fName
        }</span> <span>${reqData[i].lName}</td>
        <td>${reqData[i].dates[0]}</td><td>${reqData[i].messages[0]}</td>
        <td rowspan="${reqData[i].dates.length}">
          <div class="button-group">
          <button id="${
            reqData[i]._id
          }" class="acceptToggleColor req-button" value="confirm" disabled><span>&#10003;</span>
          </button>
          <button id="${
            reqData[i]._id
          }" class="choose req-button" value="denied" disabled><span>&#128473;</span></button>
          <button id="${
            reqData[i].disabledEdit
          }" class="editBtn req-button" value="edit" ><span>&#9998;</span></button>
          </div>
        </td>
      </tr>`;
        contentDiv.innerHTML += extraDates;
      }
    } else if (reqData[i].status === "denied") {
      if (reqData[i].forgetType === "Sequential") {
        contentDiv.innerHTML += `<tr class="column_of_table">
        <td>${srNum + 1}</td>
        <td>${reqData[i].email}</td>
        <td>${reqData[i].fName}</span> <span>${reqData[i].lName}</td>
        <td>
          <p>${reqData[i].dates[0]}</p>
          To
          <p>${
            reqData[i].dates[1] ? reqData[i].dates[1] : reqData[i].dates[0]
          }</p>
        </td>
        <td>${reqData[i].messages[0]}</td>
        <td>
          <div class="button-group">
          <button id="${
            reqData[i]._id
          }" class="choose req-button" value="confirm" disabled><span>&#10003;</span></button>
          <button id="${
            reqData[i]._id
          }" class="denyToggleColor req-button" value="denied" disabled><span>&#128473;</span></button>
          <button id="${
            reqData[i].disabledEdit
          }" class="editBtn req-button" value="edit" ><span>&#9998;</span></button>
          </div>
        </td>
      </tr>`;
      } else if (reqData[i].forgetType === "Multiple") {
        let extraDates = ``;
        if (reqData[i].dates.length > 1) {
          for (let j = 1; j < reqData[i].dates.length; j++) {
            extraDates += `<tr>
              <td>${reqData[i].dates[j]}</td>
              <td>${reqData[i].messages[j]}</td>
              </tr>`;
          }
        }
        contentDiv.innerHTML += `<tr class="column_of_table">
      <td rowspan="${reqData[i].dates.length}">${srNum + 1}</td>
      <td rowspan="${reqData[i].dates.length}">${reqData[i].email}</td>
      <td rowspan="${reqData[i].dates.length}">${
          reqData[i].fName
        }</span> <span>${reqData[i].lName}</td>
      <td>${reqData[i].dates[0]}</td><td>${reqData[i].messages[0]}</td>
      <td rowspan="${reqData[i].dates.length}">
      <div class="button-group">
          <button id="${
            reqData[i]._id
          }" class="choose req-button" value="confirm" disabled><span>&#10003;</span></button>
          <button id="${
            reqData[i]._id
          }" class="denyToggleColor req-button" value="denied" disabled><span>&#128473;</span></button>
          <button id="${
            reqData[i].disabledEdit
          }" class="editBtn req-button" value="edit" ><span>&#9998;</span></button>
          </div>
        </td>
      </tr>`;
        contentDiv.innerHTML += extraDates;
      }
    } else {
      if (reqData[i].forgetType === "Sequential") {
        contentDiv.innerHTML += `<tr class="column_of_table">
      <td>${srNum + 1}</td>
      <td>${reqData[i].email}</td>
      <td>${reqData[i].fName}</span> <span>${reqData[i].lName}</td>
      <td>
        <p>${reqData[i].dates[0]}</p>
        To
        <p>${
          reqData[i].dates[1] ? reqData[i].dates[1] : reqData[i].dates[0]
        }</p>
      </td>
      <td>${reqData[i].messages[0]}</td>
        <td>
          <div class="button-group">
          <button id="${
            reqData[i]._id
          }" class="acceptBtn req-button" value="confirm"><span>&#10003;</span></button>
          <button id="${
            reqData[i]._id
          }" class="denyBtn req-button" value="denied"><span>&#128473;</span></button>
          <button id="${
            reqData[i].disabledEdit
          }" class="editbtn modify req-button" value="edit" ><span>&#9998;</span></button>
          </div>
        </td>
      </tr>`;
      } else if (reqData[i].forgetType === "Multiple") {
        let extraDates = ``;
        if (reqData[i].dates.length > 1) {
          for (let j = 1; j < reqData[i].dates.length; j++) {
            extraDates += `<tr>
              <td>${reqData[i].dates[j]}</td>
              <td>${reqData[i].messages[j]}</td>
              </tr>`;
          }
        }
        contentDiv.innerHTML += `<tr class="column_of_table">
      <td rowspan="${reqData[i].dates.length}">${srNum + 1}</td>
      <td rowspan="${reqData[i].dates.length}">${reqData[i].email}</td>
      <td rowspan="${reqData[i].dates.length}">${
          reqData[i].fName
        }</span> <span>${reqData[i].lName}</td>
      <td>${reqData[i].dates[0]}</td><td>${reqData[i].messages[0]}</td>
      <td rowspan="${reqData[i].dates.length}">
      <div class="button-group">
          <button id="${
            reqData[i]._id
          }" class="acceptBtn req-button" value="confirm"><span>&#10003;</span></button>
          <button id="${
            reqData[i]._id
          }" class="denyBtn req-button" value="denied"><span>&#128473;</span></button>
          <button id="${
            reqData[i].disabledEdit
          }" class="editbtn modify req-button" value="edit" ><span>&#9998;</span></button>
          </div>
        </td>`;
        contentDiv.innerHTML += extraDates;
      }
    }

    //increse sr num
    srNum++;
  }
  hideModifyButton();
};

const hideModifyButton = async () => {
  const buttons = document.querySelectorAll(".editbtn");
  const date = +new Date();
  buttons.forEach(async (item) => {
    if (Number(item.id) < date) {
      item.disabled = true;
      item.id = "";
      if (item.classList.contains("editBtn")) {
        item.classList.toggle("choose");
      }
    }
  });
};

const fun = async () => {
  const buttons = document.querySelectorAll(".req-button");
  buttons.forEach(async (item) => {
    item.addEventListener("click", async () => {
      if (item.parentElement.children[0].disabled) {
        item.parentElement.children[0].disabled = false;
        item.parentElement.children[1].disabled = false;
      } else {
        item.parentElement.children[0].disabled = true;
        item.parentElement.children[1].disabled = true;
      }
      item.parentElement.children[0].classList.toggle("acceptToggleColor");
      item.parentElement.children[0].classList.toggle("acceptBtn");
      item.parentElement.children[1].classList.toggle("denyToggleColor");
      item.parentElement.children[1].classList.toggle("denyBtn");
      if (item.parentElement.children[2].classList.contains("modify")) {
        item.parentElement.children[2].classList.toggle("modify");
      }
      item.classList.toggle("choose");
      const sendData = {
        email:
          item.parentElement.parentElement.parentElement.children[1].innerHTML,
        id: item.id,
        status: item.value,
        disabledEdit: +new Date() + 60 * 60 * 1000,
        matchDisabledEdit: item.parentElement.children[2].id,
      };
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sendData),
      };
      if (!item.classList.contains("editBtn")) {
        const res = await fetch(
          "/api/v2/user/attendance/forget/update",
          requestOptions
        );
        window.location.reload();
      }
    });
  });
};

const setPagination = async (page = 1) => {
  const paginationUl = document.querySelector("nav .pagination");
  const {
    filteredForgetAttendanceCount,
    resultPerPage,
    forgetAttendanceCount,
  } = await newLeaveRequests();
  const totalPages = Math.ceil(forgetAttendanceCount / resultPerPage);
  let liTag = "";
  let active;
  let beforePage = page - 1;
  let afterPage = page + 1;
  if (filteredForgetAttendanceCount >= forgetAttendanceCount) {
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
    if (
      paginationUl.children[
        paginationUl.children.length - 2
      ].classList.contains("active")
    ) {
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
      paginationUl.children[0].classList.add("disabled");
      paginationUl.children[0].classList.add("pagination-hide");
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
  userRequest(pageNum);
  setPagination(pageNum);
  setTimeout(() => fun(), 1000);
};

const main = () => {
  setPagination();
  userRequest();
  setTimeout(() => fun(), 1000);
};
main();
