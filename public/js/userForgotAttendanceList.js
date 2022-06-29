const myForgotAttendace = async (page) => {
  const data = await fetch(`/api/v2/user/attendace/forget/list?page=${page}`);
  const {
    forgetAttendance,
    filteredForgotAttendaceCount,
    resultPerPage,
    forgetAttendanceCount,
  } = await data.json();

  return {
    forgetAttendance,
    filteredForgotAttendaceCount,
    resultPerPage,
    forgetAttendanceCount,
  };
};
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
  //showing active button
  for (let j = 0; j < userUl.children.length; j++) {
    userUl.children[j].classList.remove("active");
    if (userUl.children[j].children[0].href === window.location.href) {
      userUl.children[j].classList.add("active");
    }
  }
};

const renderLeavesDetails = async (page = 1) => {
  setHeaders();
  const contentDiv = document.querySelector(".content-div");
  const { forgetAttendance, resultPerPage } = await myForgotAttendace(page);
  if (page) {
    contentDiv.innerHTML = ``;
  }
  let srNum = page * resultPerPage - resultPerPage;
  for (let i = 0; i < forgetAttendance.length; i++) {
    if (forgetAttendance[i].forgetType === "Sequential") {
      contentDiv.innerHTML += `<tr class="column_of_table">
        <td>${srNum + 1}</td>
        <td>${forgetAttendance[i].email}</td>
        <td>${forgetAttendance[i].fName}</span> <span>${
        forgetAttendance[i].lName
      }</td>
        <td>
          <p>${forgetAttendance[i].dates[0]}</p>
          To
          <p>${
            forgetAttendance[i].dates[1]
              ? forgetAttendance[i].dates[1]
              : forgetAttendance[i].dates[0]
          }</p>
        </td>
        <td>${forgetAttendance[i].messages[0]}</td>
        <td>${forgetAttendance[i].status}</td>
      </tr>`;
    } else if (forgetAttendance[i].forgetType === "Multiple") {
      let extraDates = ``;
      if (forgetAttendance[i].dates.length > 1) {
        for (let j = 1; j < forgetAttendance[i].dates.length; j++) {
          extraDates += `<tr>
                <td>${forgetAttendance[i].dates[j]}</td>
                <td>${forgetAttendance[i].messages[j]}</td>
                </tr>`;
        }
      }
      contentDiv.innerHTML += `<tr class="column_of_table">
        <td rowspan="${forgetAttendance[i].dates.length}">${srNum + 1}</td>
        <td rowspan="${forgetAttendance[i].dates.length}">${
        forgetAttendance[i].email
      }</td>
        <td rowspan="${forgetAttendance[i].dates.length}">${
        forgetAttendance[i].fName
      }</span> <span>${forgetAttendance[i].lName}</td>
        <td>${forgetAttendance[i].dates[0]}</td><td>${
        forgetAttendance[i].messages[0]
      }</td>
        <td rowspan="${forgetAttendance[i].dates.length}">${
        forgetAttendance[i].status
      }</td>
      </tr>`;
      contentDiv.innerHTML += extraDates;
    }
    // contentDiv.innerHTML += `<tr class="column_of_table">
    //   <td>${srNum + 1}</td>
    //   <td>${leaves[i].typeOfLeave}</td>
    //   <td>${leaves[i].employeeShift}</td>
    //   <td>${leaves[i].typeOfDay}</td>
    //   <td>
    //     ${leaves[i].typeOfDay == "halfday" ? `${leaves[i].employeeHalf}` : "--"}
    //   </td>
    //   <td>
    //     <p>${leaves[i].startDate}</p>
    //     To
    //     <p>${leaves[i].endDate}</p>
    //   </td>

    //   <td>${leaves[i].message}</td>
    //   <td class="statusText">${leaves[i].status}</td>
    // </tr>`;
    //increse sr num
    srNum++;
  }

  addColor();
};

const addColor = async () => {
  const leaveStatus = document.querySelectorAll(".statusText");
  for (let i = 0; i < leaveStatus.length; i++) {
    if (leaveStatus[i].innerHTML === "confirm") {
      leaveStatus[i].classList.add("green");
    } else if (leaveStatus[i].innerHTML === "denied") {
      leaveStatus[i].classList.add("black");
    } else {
      leaveStatus[i].classList.add("red");
    }
  }
};

const setPagination = async (page = 1) => {
  const paginationUl = document.querySelector("nav .pagination");
  const { filteredForgotAttendaceCount, resultPerPage, forgetAttendanceCount } =
    await myForgotAttendace();
  const totalPages = Math.ceil(forgetAttendanceCount / resultPerPage);
  let liTag = "";
  let active;
  let beforePage = page - 1;
  let afterPage = page + 1;
  if (filteredForgotAttendaceCount >= forgetAttendanceCount) {
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
  renderLeavesDetails(pageNum);
  setPagination(pageNum);
};

const main = () => {
  setPagination();
  renderLeavesDetails();
};
main();
