const logoutUser = async () => {
  const res = await fetch("/api/v2/user/logout");
  // const data = await res.json();
  window.location.href = "/login";
};

const user = async () => {
  const data = await fetch("/api/v2/user/me");
  const { user } = await data.json();
  return user;
};
const usersData = async () => {
  const data = await fetch("/api/v2/admin/dashboard");
  const { total_user, weeklyPresentData, genderData, userLeavesData } =
    await data.json();
  return { total_user, weeklyPresentData, genderData, userLeavesData };
};

const findUsers = async (page = 1, keyword = "") => {
  const data = await fetch(`/api/v2/users?page=${page}&keyword=${keyword}`);
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

//random color functionn
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const setHeaders = async () => {
  const userUl = document.querySelector(".navbar-nav");
  const userName = document.querySelector(".navbar-brand .user-name-span");
  const totalEmployee = document.querySelector("#totalEmployee");
  const userr = await user();
  const { total_user } = await usersData();
  if (userr.role === "admin") {
    userName.innerHTML = `${userr.fName} ${userr.lName} (Admin)`;
  }
  totalEmployee.innerHTML = `Total number of employees:${total_user}`;
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

const setAllChartData = async () => {
  const { total_user, weeklyPresentData, genderData, userLeavesData } =
    await usersData();

  // calculating leqaves
  let lablesData = [];
  let sickData = [];
  let casualData = [];
  let privilegeData = [];
  for (let i = 0; i < userLeavesData.length; i++) {
    lablesData.push(...Object.keys(userLeavesData[i]));
    sickData.push(userLeavesData[i][lablesData[i]]["sick leave"]);
    casualData.push(userLeavesData[i][lablesData[i]]["casual leave"]);
    privilegeData.push(userLeavesData[i][lablesData[i]]["privilege leave"]);
  }

  var totalWidth;
  var barthickness;

  function canvasWidthFix(
    perDataWidth,
    spacing,
    numberOfData,
    idOfCanvasParent
  ) {
    totalWidth = (perDataWidth + spacing) * numberOfData;
    barthickness = perDataWidth - spacing;
    document.getElementById(idOfCanvasParent).style.height = "300px";
    return (document.getElementById(idOfCanvasParent).style.width =
      totalWidth + "px");
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function comman({
    decide,
    ctx,
    type,
    labels,
    label,
    backgroundColor,
    barThicknessData,
    setData,
    options,
  }) {
    if (decide) {
      decide();
    }
    var myChart = new Chart(ctx, {
      type,
      data: {
        labels,
        datasets: [
          {
            label,
            backgroundColor,
            barThickness: barThicknessData,
            data: setData,
          },
        ],
      },
      options,
    });
  }

  //for total day attendance
  const attendanceData = {
    ctx: document.getElementById("attendanceChart").getContext("2d"),
    type: "bar",
    label: "present",
    labels: Object.keys(weeklyPresentData).reverse(),
    backgroundColor: [
      `rgba(${getRandomInt(255)},${getRandomInt(255)},${getRandomInt(
        255
      )}, .5)`,
      `rgba(${getRandomInt(255)},${getRandomInt(255)},${getRandomInt(
        255
      )}, .5)`,
      `rgba(${getRandomInt(255)},${getRandomInt(255)},${getRandomInt(
        255
      )}, .5)`,
      `rgba(${getRandomInt(255)},${getRandomInt(255)},${getRandomInt(
        255
      )}, .5)`,
      `rgba(${getRandomInt(255)},${getRandomInt(255)},${getRandomInt(
        255
      )}, .5)`,
      `rgba(${getRandomInt(255)},${getRandomInt(255)},${getRandomInt(
        255
      )}, .5)`,
      `rgba(${getRandomInt(255)},${getRandomInt(255)},${getRandomInt(
        255
      )}, .5)`,
    ],
    barThicknessData: barthickness,
    setData: Object.values(weeklyPresentData).reverse(),
    options: {
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };

  // for gender
  const genderDataShow = {
    ctx: document.getElementById("genderChart").getContext("2d"),
    type: "pie",
    labels: Object.keys(genderData),
    label: "gender",
    backgroundColor: [" rgba(0, 0, 179,0.6)", `rgba(128, 0, 128,0.6)`],
    barThicknessData: barthickness,
    setData: Object.values(genderData),
    options: {
      maintainAspectRatio: false,
    },
  };

  //for sick leave
  const sickDataShow = {
    ctx: document.getElementById("sickChart").getContext("2d"),
    type: "bar",
    labels: lablesData,
    label: "total sick leave",
    backgroundColor: Array.from(
      { length: lablesData.length },
      (_, index) =>
        `rgba(${getRandomInt(255)},${getRandomInt(255)},${getRandomInt(
          255
        )}, .5)`
    ),

    barThicknessData: barthickness,
    decide: () => canvasWidthFix(50, 10, lablesData.length, "secondRowLeft"),
    setData: sickData,
    options: {
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };
  //for casual leave
  const casualDataShow = {
    ctx: document.getElementById("casualChart").getContext("2d"),
    type: "bar",
    labels: lablesData,
    label: "total casual leave",
    backgroundColor: Array.from(
      { length: lablesData.length },
      (_, index) =>
        `rgba(${getRandomInt(255)},${getRandomInt(255)},${getRandomInt(
          255
        )}, .5)`
    ),
    barThicknessData: barthickness,
    // setData: [4, 1, 3, 6, 8],
    decide: () => canvasWidthFix(50, 10, lablesData.length, "secondRowCenter"),
    setData: casualData,
    options: {
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };
  //for privilege leave
  const privilegeDataShow = {
    ctx: document.getElementById("privilegeChart").getContext("2d"),
    type: "bar",
    labels: lablesData,
    label: "total privilege leave",
    backgroundColor: Array.from(
      { length: lablesData.length },
      (_, index) =>
        `rgba(${getRandomInt(255)},${getRandomInt(255)},${getRandomInt(
          255
        )}, .5)`
    ),
    barThicknessData: barthickness,
    // setData: [4, 1, 3, 6, 8],
    decide: () => canvasWidthFix(50, 10, lablesData.length, "secondRowRight"),
    setData: privilegeData,
    options: {
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };

  comman(attendanceData);
  comman(genderDataShow);
  comman(sickDataShow);
  comman(casualDataShow);
  comman(privilegeDataShow);

  // const array = new Array(30).fill(
  //   `rgba(${getRandomInt(255)},${getRandomInt(255)},${getRandomInt(255)}, .5)`
  // );
};
setAllChartData();

const search = document.querySelector(".search-div .searchBtn");

//set users on click
const setUserData = async (page) => {
  const searchInput = document.querySelector(".search-div #search-query-input");
  const tableContainer = document.querySelector(".table-reference");
  const errorContainer = document.querySelector(".error-container");
  const tableRows = document.querySelector("table .filter-user");
  let userRow = ``;
  const { users, resultPerPage } = await findUsers(page, searchInput.value);
  let srNum = page * resultPerPage - resultPerPage;
  if (users.length === 0) {
    tableContainer.classList.add("hide");
    errorContainer.classList.remove("hide");
    errorContainer.innerHTML = "No Match Data Found";
  } else {
    errorContainer.classList.add("hide");
    tableContainer.classList.remove("hide");
  }

  for (i = 0; i < users.length; i++) {
    userRow += `<tr class="user">
    <td>${srNum + 1}</td>
    <td>${users[i].fName}</td>
    <td>${users[i].lName}</td>
    <td>${users[i].email}</td>
    <td>${users[i].gender}</td>
    <td>${users[i].designation}</td>
    <td class = "moreData"><i class="fa-solid fa-arrow-up-right-from-square"></i></td>
  </tr>`;
    srNum++;
  }
  tableRows.innerHTML = userRow;

  setPagination(page, searchInput.value);

  //for full data
  const link = document.querySelectorAll(".moreData");
  link.forEach((item) => {
    item.addEventListener("click", () => {
      let email =
        item.previousElementSibling.previousElementSibling
          .previousElementSibling.innerHTML;

      location.href = `${location.protocol}//${window.location.host}/userdetails?userid=${email}`;
    });
  });
};

// work on search click
search.addEventListener("click", () => setUserData((page = 1)));

//pagination set
const setPagination = async (page, query) => {
  const paginationUl = document.querySelector("nav .pagination");
  const { usersCount, filteredUsersCount, resultPerPage } = await findUsers(
    page,
    query
  );
  //count number of page in pagination
  const totalPages = Math.ceil(filteredUsersCount / resultPerPage);
  let liTag = "";
  let active;
  let beforePage = page - 1;
  let afterPage = page + 1;
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

//update pagination
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
  setUserData(pageNum);
  setPagination(pageNum);
};
