const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const activeUsersData = async (page) => {
  const data = await fetch(`/api/v2/users?page=${page}`);
  const { users, usersCount, filteredUsersCount, resultPerPage } =
    await data.json();
  return { users, usersCount, filteredUsersCount, resultPerPage };
};
const archiveUsersData = async (page) => {
  const data = await fetch(`/api/v2/archive/users?page=${page}`);
  const {
    archiveUsers,
    archiveCount,
    filteredArchiveCount,
    resultPerPageArchive,
  } = await data.json();
  return {
    archiveUsers,
    archiveCount,
    filteredArchiveCount,
    resultPerPageArchive,
  };
};
const user = async () => {
  const data = await fetch("/api/v2/user/me");
  const { user } = await data.json();
  return user;
};

const logoutUser = async () => {
  const res = await fetch("/api/v2/user/logout");
  const data = await res.json();
  window.location.href = "/login";
};

const setHeaders = async () => {
  const userUl = document.querySelector(".navbar-nav");
  const userName = document.querySelector(".navbar-brand .user-name-span");
  const userdetails = await user();
  if (userdetails.role === "admin") {
    userName.innerHTML = `${userdetails.fName} ${userdetails.lName} (Admin)`;
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

const setActiveEmployee = async (page = 1) => {
  const activeTbody = document.querySelector(".active-tbody");
  const { users: activeData, resultPerPage } = await activeUsersData(page);
  // console.log(activeData);

  if (page) {
    activeTbody.innerHTML = ``;
  }
  let srNum = page * resultPerPage - resultPerPage;
  for (let i = 0; i < activeData.length; i++) {
    activeTbody.innerHTML += ` <tr>
    <td>${srNum + 1}</td>
    <td>${activeData[i].email}</td>
    <td class = "name-td">${activeData[i].fName} ${activeData[i].lName}</td>
    <td><button class="btn" onclick ="updateLeaveDate('${activeData[i].fName} ${
      activeData[i].lName
    }','${activeData[i].email}')">Archive</button></td>
  </tr>`;
    // increse srNum
    srNum++;
  }
};

const updateLeaveDate = (name, email) => {
  const leavingDatePop = document.querySelector(".leavingDate-pop");
  const backDrop = document.querySelector(".backDrop");
  leavingDatePop.classList.remove("visual");
  backDrop.classList.remove("visual");
  let date = new Date();

  leavingDatePop.innerHTML = `
  <div class="leavingDate-main ">
        <h4>${name}</h4>
        <p  style="display: none;">${email}</p>
        <Select class = "select-div">
          <option hidden >Select Leaving Date</option>
        </Select>
        <div class="leaveDate-btn">
          <button onclick = cancelUpdate()>cancel</button>
          <button class="send">Archive</button>
        </div>
        <p class="error"></p>
      </div>`;
  const selectDiv = document.querySelector(".select-div");
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
  setTimeout(() => fun(), 1000);
};

const cancelUpdate = () => {
  const leavingDatePop = document.querySelector(".leavingDate-pop");
  const backDrop = document.querySelector(".backDrop");
  leavingDatePop.classList.add("visual");
  backDrop.classList.add("visual");
};

const setArchiveEmployee = async (page = 1) => {
  const inactiveTbody = document.querySelector(".inactive-tbody");
  const { archiveUsers: archiveData, resultPerPageArchive } =
    await archiveUsersData(page);
  if (page) {
    inactiveTbody.innerHTML = ``;
  }
  let srNum = page * resultPerPageArchive - resultPerPageArchive;
  for (let j = 0; j < archiveData.length; j++) {
    inactiveTbody.innerHTML += ` <tr>
    <td>${srNum + 1}</td>
    <td>${archiveData[j].email}</td>
    <td class = "name-td">${archiveData[j].fName} ${archiveData[j].lName}</td>
    <td>${archiveData[j].joiningDate}</td>
    <td>${archiveData[j].leavingDate}</td>
    <td class = "name-td">${archiveData[j].archiveBy}</td>
    <td>${archiveData[j].archiveDate}</td>

    <td><button class="btn send">Active</button></td>
  </tr>`;
    // increse srNum
    srNum++;
  }
};

const fun = async () => {
  const refButton = document.querySelectorAll(".send");
  const errorRef = document.querySelector(".error");
  refButton.forEach(async (item) => {
    item.addEventListener("click", async () => {
      const leaveDate = item.parentElement.parentElement.children[2].value;
      if (leaveDate === "Select Leaving Date") {
        return (errorRef.innerHTML = "Please Select The Leave Date");
      }
      const sendData = {
        email: item.parentElement.parentElement.children[1].innerHTML,
        status: item.innerHTML === "Archive" ? false : true,
      };
      if (leaveDate) {
        sendData.leaveDate = leaveDate;
      }
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sendData),
      };
      await fetch("api/v2/archive/user/update", requestOptions);
      window.location.reload();
    });
  });
};

const setActivePagination = async (page = 1) => {
  const paginationUl = document.querySelector(
    ".active-employee-div nav .pagination"
  );
  const { usersCount, filteredUsersCount, resultPerPage } =
    await activeUsersData();
  const totalPages = Math.ceil(usersCount / resultPerPage);
  let liTag = "";
  let active;
  let beforePage = page - 1;
  let afterPage = page + 1;
  // if (filteredUsersCount >= usersCount) {
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
  const paginationUl = document.querySelector(
    ".active-employee-div nav .pagination"
  );
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
  setActiveEmployee(pageNum);
  setActivePagination(pageNum);
  setTimeout(() => fun(), 1000);
};

//for archive employee
const setArchivePagination = async (page = 1) => {
  const paginationUl = document.querySelector(
    ".inactive-employee-div nav .pagination"
  );
  const {
    archiveUsers,
    archiveCount,
    filteredArchiveCount,
    resultPerPageArchive,
  } = await archiveUsersData();
  const totalPages = Math.ceil(archiveCount / resultPerPageArchive);
  let liTag = "";
  let active;
  let beforePage = page - 1;
  let afterPage = page + 1;
  if (filteredArchiveCount >= archiveCount) {
    paginationUl.classList.add("pagination-hide");
  } else if (totalPages > 4) {
    if (page >= 1) {
      liTag += `<li class="page-item" onclick="changeArchivePageNumber(${
        page - 1
      })"><a class="page-link"><i class="fas fa-angle-left"></i> Prev</a></li>`;
    }

    if (page > 2) {
      //if page value is less than 2 then add 1 after the previous button
      liTag += `<li class="page-item" onclick="changeArchivePageNumber(1)"><a class="page-link">1</a></li>`;
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
      liTag += `<li class="page-item ${active}" onclick="changeArchivePageNumber(${plength})"><a class="page-link">${plength}</a></li>`;
    }

    if (page < totalPages - 1) {
      //if page value is less than totalPage value by -1 then show the last li or page
      if (page < totalPages - 2) {
        //if page value is less than totalPage value by -2 then add this (...) before the last li or page
        liTag += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
      }
      liTag += `<li class="page-item" onclick="changeArchivePageNumber(${totalPages})"><a class="page-link">${totalPages}</a></li>`;
    }

    if (page < totalPages) {
      //show the next button if the page value is less than totalPage(20)
      liTag += `<li class="page-item" onclick="changeArchivePageNumber(${
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
          onclick="changeArchivePageNumber('previous')"
        >Previous</a>
      </li>`;
    for (let k = 0; k < totalPages; k++) {
      paginationUl.innerHTML += `<li class="page-item"><a class="page-link" onclick="changeArchivePageNumber(${
        k + 1
      })">${k + 1}</a></li>`;
    }
    paginationUl.innerHTML += `<li class="page-item">
  <a class="page-link"  onclick="changeArchivePageNumber('next')">Next</a>
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

const changeArchivePageNumber = async (page) => {
  const paginationUl = document.querySelector(
    ".inactive-employee-div nav .pagination"
  );
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
  setArchiveEmployee(pageNum);
  setArchivePagination(pageNum);
  setTimeout(() => fun(), 1000);
};

const main = () => {
  setHeaders();
  setActiveEmployee();
  setActivePagination();
  setArchiveEmployee();
  setArchivePagination();
  setTimeout(() => fun(), 1000);
};
main();
