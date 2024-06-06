const url = "http://localhost:8000";
const id = localStorage.getItem("isLoggedIn");

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".ride-form");
  form.addEventListener("submit", submitRide);
  const fromInput = document.getElementById("from");
  const toInput = document.getElementById("to");
  autocomplete(fromInput);
  autocomplete(toInput);
});

async function submitRide(ev) {
  ev.preventDefault();
  const form = document.querySelector(".ride-form");
  const formData = new FormData(form);
  const inputData = Object.fromEntries(formData);

  const driverValid = await validateUser(
    parseInt(inputData.driver),
    ".driver-input",
    "is_driver"
  );
  const commanderValid = await validateUser(
    parseInt(inputData.commander),
    ".commander-input",
    "is_commander"
  );

  if (!driverValid || !commanderValid) return;

  const post = {
    from: inputData.from,
    to: inputData.to,
    number_of_driver: parseInt(inputData.driver),
    number_of_commander: parseInt(inputData.commander),
    number_of_officer: parseInt(id),
    number_of_car: parseInt(inputData.car_number),
    free_seats: parseInt(inputData.free_seats),
    date_of_ride: inputData.begin_date,
    time_of_ride: inputData.begin_time,
  };

  try {
    const response = await axios.post(`${url}/rides`, post);
    console.log("Ride submitted successfully:", response.data);
    alert("Ride submitted successfully");
  } catch (error) {
    console.error("Error submitting ride:", error);
    alert("Error submitting ride");
  }
}

async function validateUser(userId, inputSelector, userType) {
  try {
    const response = await fetch(`${url}/users/${userId}`);
    const data = await response.json();
    const isValid = data[userType];
    if (!isValid) {
      document.querySelector(inputSelector).style.border = "1px solid red";
    }
    return isValid;
  } catch (error) {
    console.error(`${userType} not found:`, error);
    document.querySelector(inputSelector).style.border = "1px solid red";
    return false;
  }
}

function autocomplete(input) {
  const autocompleteFrom = new google.maps.places.Autocomplete(input);
  autocompleteFrom.addListener("place_changed", () => {
    const selectedPlace = autocompleteFrom.getPlace();
  });
}

function checkSeventhDigit() {
  const driverBorder = document.querySelector(".driver-input");
  const commanderBorder = document.querySelector(".commander-input");
  if (driverBorder.value.length < 7) driverBorder.style.border = "";
  if (commanderBorder.value.length < 7) commanderBorder.style.border = "";
}
