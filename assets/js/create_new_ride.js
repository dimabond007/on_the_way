document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".ride-form");
  form.addEventListener("submit", submitRide);
  const fromInput = document.getElementById("from");
  const toInput = document.getElementById("to");
  autocomplete(fromInput);
  autocomplete(toInput);
});
const url = "http://localhost:8000";
function submitRide(ev) {
  ev.preventDefault();
  const form = document.querySelector(".ride-form");
  const formData = new FormData(form);
  inputData = Object.fromEntries(formData);
  if (
    !ValiditeDriver(
      parseInt(inputData.driver) &&
        !ValiditeCommander(parseInt(inputData.commander))
    )
  )
    return;
  console.log(inputData);
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
  //   axios
  //     .post(`${url}/rides`, post)
  //     .then((response) => {
  //       console.log("Ride submitted successfully:", response.data);
  //       alert("Ride submitted successfully");
  //     })
  //     .catch((error) => {
  //       console.error("Error submitting ride:", error);
  //       alert("Error submitting ride");
  //     });
}
async function ValiditeDriver(driver) {
  try {
    const response = await fetch(`${url}/user/${driver}`);
    const data = await response.json();
    alert(data);
    return data.is_driver;
  } catch (error) {
    console.error("Error fetching data:", error);
    return false;
  }
}
async function ValiditeCommander(commander) {
  try {
    const response = await fetch(`${url}/user/${commander}`);
    const data = await response.json();
    return data.is_commander;
  } catch (error) {
    console.error("Error fetching data:", error);
    return false;
  }
}

function autocomplete(input) {
  const autocompleteFrom = new google.maps.places.Autocomplete(input);
  autocompleteFrom.addListener("place_changed", () => {
    const selectedPlace = autocompleteFrom.getPlace();
  });
}
