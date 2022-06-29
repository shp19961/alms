const myReimbursement = async (page) => {
  const data = await fetch(
    `/api/v2/reimbursement/user/leave/request?page=${page}`
  );
  const {
    reimbursement,
    resultPerPage,
    filteredUsersCount,
    reimbursementCount,
  } = await data.json();
  return {
    reimbursement,
    resultPerPage,
    filteredUsersCount,
    reimbursementCount,
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

const renderLeavesDetails = async (page = 1) => {
  setHeaders();
  const contentDiv = document.querySelector(".content-div");

  if (page) {
    contentDiv.innerHTML = ``;
  }
  const { reimbursement: leaves, resultPerPage } = await myReimbursement(page);
  let srNum = page * resultPerPage - resultPerPage;
  for (let i = 0; i < leaves.length; i++) {
    contentDiv.innerHTML += `<tr class="column_of_table">
      <td>${srNum + 1}</td>
      <td>${leaves[i].holidayDate}</td>
      <td>${leaves[i].leaveTakenDate}</td>
      <td class="statusText">${leaves[i].status}</td>
    </tr>`;
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

// renderLeavesDetails();

const setPagination = async (page = 1) => {
  const paginationUl = document.querySelector("nav .pagination");
  const { resultPerPage, filteredUsersCount, reimbursementCount } =
    await myReimbursement();
  const totalPages = Math.ceil(reimbursementCount / resultPerPage);
  let liTag = "";
  let active;
  let beforePage = page - 1;
  let afterPage = page + 1;
  if (filteredUsersCount >= reimbursementCount) {
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
