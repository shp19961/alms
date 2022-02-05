const userData = async () => {
  const data = await fetch("/api/v2/users");
  const { users } = await data.json();
  return users;
};

const loginUser = async () => {
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  const errorRef = document.querySelector("#error");
  //   const users = await userData();
  const data = {
    email,
    password,
  };
  const response = await fetch("/api/v2/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const { success, error } = await response.json();
  if (!success) {
    return (errorRef.innerHTML = error);
  }
  window.location.href = "/";
};
//check of admin
const isAdmin = async () => {
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  const formContainer = document.querySelector(".form-container");
  const error = document.querySelector("#error");
  const users = await userData();
  for (let i = 0; i < users.length; i++) {
    // console.log(users);
    if (users[i].role === "admin") {
      const data = {
        email,
        password,
      };
      console.log(data);
      const response = await fetch("/api/v2/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const userData = await response.json();
      console.log(userData);
      if (userData) {
        formContainer.innerHTML = ` <h1>New User Details</h1>
          <form>
            <input
              id="id"
              type="number"
              class="input-group"
              placeholder="Unique Id"
              required
            />
            <input
              id="fName"
              type="text"
              class="input-group"
              placeholder="first Name"
              autocomplete="false"
              required
            />
            <input
              id="lName"
              type="text"
              class="input-group"
              placeholder="Last Name"
              required
            />
            <button type="button" id="btn" class="btn" onclick="addUser()">
              Add User
            </button>
          </form>
          <p id="error"></p>`;
      }
    } else {
      error.innerHTML = "invalid Details";
    }
  }
};

//add new user
const addUser = async () => {
  const id = Number(document.querySelector("#id").value);
  const fName = document.querySelector("#fName").value;
  const lName = document.querySelector("#lName").value;
  const error = document.querySelector("#error");
  // const users = JSON.parse(localStorage.getItem("employees"));
  const users = await userData();
  if (!id || !fName || !lName) {
    return (error.innerHTML = "please fill all the field of Form");
  }

  for (let i = 0; i < users.length; i++) {
    if (id === users[i].id) {
      return (error.innerHTML = "id already exits");
    }
  }
  let newUser = {
    id,
    fName,
    lName,
  };
  users.push(newUser);
  localStorage.setItem("employees", JSON.stringify(users));
  window.location.href = "/";
};
