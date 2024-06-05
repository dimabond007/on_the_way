const id = localStorage.getItem("isLoggedIn");
document.getElementById("personal-id").innerText = id;

fetch("http://localhost:8000/users/" + id)
  .then((response) => response.json())
  .then((data) => {
    let authorizations = "";
    if (data.is_driver) authorizations += "driver/ ";
    if (data.is_commander) authorizations += "commander/ ";
    if (data.is_officer) authorizations += "officer/ ";
    document.getElementById("username").innerText = data.name;
    document.getElementById("authorizations").innerText = authorizations.slice(
      0,
      -2
    );
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
