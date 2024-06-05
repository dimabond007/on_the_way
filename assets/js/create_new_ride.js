document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".ride-form");
  form.addEventListener("submit", submitRide);
  const fromInput = document.getElementById("from");
  const toInput = document.getElementById("to");
  autocomplete(fromInput);
  autocomplete(toInput);
});
const url = "http://localhost:8000";
async function submitRide(ev) {
  ev.preventDefault();
  const form = document.querySelector(".ride-form");
  const formData = new FormData(form);
  inputData = Object.fromEntries(formData);
  console.log(await ValiditeDriver(parseInt(inputData.driver)));
  console.log(await ValiditeCommander(parseInt(inputData.commander)));
  if (
    !(await ValiditeDriver(parseInt(inputData.driver))) ||
    !(await ValiditeCommander(parseInt(inputData.commander)))
  )
    return;
  const post = {
    from: inputData.from,
    to: inputData.to,
    number_of_driver: parseInt(inputData.driver),
    number_of_commander: parseInt(inputData.commander),
    number_of_car: parseInt(inputData.car_number),
    free_seats: parseInt(inputData.free_seats),
    is_trunk: inputData.trunk === "on" ? true : false,
    date_of_ride: inputData.begin_date,
    time_of_ride: inputData.begin_time,
  };
  axios
    .post(`${url}/rides`, post)
    .then((response) => {
      console.log("Ride submitted successfully:", response.data);
    })
    .catch((error) => {
      console.error("Error submitting ride:", error);
    });
}
async function ValiditeDriver(driver) {
  try {
    const response = await fetch(`${url}/users/${driver}`);
    const data = await response.json();
    if (!data.is_driver) {
      alert("not driver");
      return false;
    } else return true;
  } catch (error) {
    alert("driver not found");
    console.error("driver not found:", error);
    return false;
  }
}
async function ValiditeCommander(commander) {
  try {
    const response = await fetch(`${url}/users/${commander}`);
    const data = await response.json();
    if (!data.is_commander) {
      alert("not commander");
      return false;
    } else return true;
  } catch (error) {
    alert("commander not found");
    console.error("commander not found:", error);
    return false;
  }
}

function autocomplete(input) {
  const autocompleteFrom = new google.maps.places.Autocomplete(input);
  autocompleteFrom.addListener("place_changed", () => {
    const selectedPlace = autocompleteFrom.getPlace();
  });
}
