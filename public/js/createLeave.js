const submitLeave = async () => {
  const email = document.getElementById("email").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const typeOfLeave = document.getElementById("typeOfLeave").value;
  const message = document.getElementById("msg").value;
  const errorRef = document.getElementById("error");

  const data = {
    email,
    startDate,
    endDate,
    typeOfLeave,
    message,
  };

  const sendLeaveMail = await fetch("/api/v2/leaves", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const { success, error } = await sendLeaveMail.json();
  console.log(success);
  if (!success) {
    return (errorRef.innerHTML = error);
  }
  if (success) {
    alert("leave applied success");
  }
  window.location.href = "/";
};

submitLeave();
