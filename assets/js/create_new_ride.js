function submitRide(ev) {
  ev.preventDefault();
  const form = document.querySelector(".ride-form");
  const formData = new FormData(form);
  inputData = Object.fromEntries(formData);
  console.log(inputData);
  post = {
    from: inputData.from,
    to: inputData.to,
    number_of_driver: parseInt(inputData.driver),
    number_of_commander: parseInt(inputData.commander),
    number_of_car: parseInt(inputData.car_number),
    free_seats: parseInt(inputData.free_seats),
    is_trunk: inputData.trunk == "on" ? true : false,
    date_of_ride: inputData.begin_date,
    time_of_ride: inputData.begin_time,
  };
  axios.post("http://localhost:8000/rides", post);
  alert("yay");
}
const fromInput = document.getElementById("from");
const toInput = document.getElementById("to");
function autocomplete(input) {
  const autocompleteFrom = new google.maps.places.Autocomplete(input);
  autocompleteFrom.addListener("place_changed", () => {
    const selectedPlace = autocompleteFrom.getPlace();
  });
}
autocomplete(fromInput);
autocomplete(toInput);
