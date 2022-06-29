const setHeader = () => {
  document.getElementById("main-container").style.marginTop = "1rem";
};

setHeader();

const loginUser = async () => {
  const formContainer = document.querySelector(".form-container");
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  const errorRef = document.querySelector("#error");
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
  const { valid, success, error } = await response.json();
  if (valid) {
    employeeId = valid;
    return (formContainer.innerHTML = `<h1>Create New Password</h1>
      <form class="form-data">
        <input
          id="password"
          type="password"
          class="input-group"
          placeholder="New Password"
          autocomplete="false"
          required
        />
        <input
          id="cPassword"
          type="password"
          class="input-group"
          placeholder="Conform New Password"
          autocomplete="false"
          required
        />
        <button type="button" id="btn" class="btn" onclick="newPassword()">
          Update
        </button>
      </form>
      <p id="error"></p>`);
  } else if (!success) {
    return (errorRef.innerHTML = error);
  } else {
    window.location.href = "/";
  }
};

const newPassword = async () => {
  const password = document.querySelector("#password").value;
  const cPassword = document.querySelector("#cPassword").value;
  const errorRef = document.querySelector("#error");
  if (!password || !cPassword) {
    return (errorRef.innerHTML = "Please fill all the field");
  } else if (password !== cPassword) {
    return (errorRef.innerHTML = "Password not matched");
  }
  const data = {
    employeeId,
    password,
  };
  const res = await fetch("/api/v2/password/new", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const { success, error } = await res.json();
  if (error) {
    return (errorRef.innerHTML = error);
  } else if (success) {
    window.location.href = "/login";
  } else {
    return (error.innerHTML = "Internal server error please try again later");
  }
};
