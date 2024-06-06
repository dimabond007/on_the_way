// assets/js/allRides.js

document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:8000/rides")
    .then((response) => response.json())
    .then((data) => {
      const rides = data;
      const rideRow = document.querySelector(".rideRow");

      rides.forEach((ride) => {
        const rideElement = document.createElement("div");
        rideElement.classList.add("ride");
        rideElement.addEventListener("click", function (event) {
          window.location.href = "./single_ride.html?id=" + ride.id;
        });
        rideElement.innerHTML = `
                      <div class="ride-details">
                          <p><strong>From:</strong> ${ride.from}</p>
                          <p><strong>To:</strong> ${ride.to}</p>
                          <p><strong>Free Seats:</strong> ${ride.free_seats}</p>
                          <p><strong>Trunk Available:</strong> ${
                            ride.is_trunk ? "Yes" : "No"
                          }</p>
                          <p><strong>Date of Ride:</strong> ${
                            ride.date_of_ride
                          }</p>
                          <p><strong>Time of Ride:</strong> ${
                            ride.time_of_ride
                          }</p>
                          <button class="takeRideButton" data-ride-id="${
                            ride.id
                          }">Take Ride</button>
                      </div>
                  `;

        rideRow.appendChild(rideElement);
      });

      document.querySelectorAll(".takeRideButton").forEach((button) => {
        button.addEventListener("click", function () {
          this.style.backgroundColor = "green";
          this.disabled = true;
          addOrder(this.dataset.rideId);
        });
      });
    })
    .catch((error) => {
      console.error("Error loading rides:", error);
    });

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
});

function search_ride(e) {
  e.preventDefault();
  const form = document.querySelector(".search_form");
  const formData = new FormData(form);
  inputData = Object.fromEntries(formData);
  console.log();
  console.log();

  var directionsService = new google.maps.DirectionsService();
  fetch("http://localhost:8000/rides").then(function (response) {
    response.json().then(function (rides) {
      var validRoutes = [];

      rides.forEach(function (ride, index) {
        var route1 = {
          origin: ride.from,
          destination: ride.to,
        };

        var route2 = {
          origin: inputData.from,
          destination: inputData.to,
        };

        directionsService.route(
          {
            origin: route1.origin,
            destination: route1.destination,
            travelMode: "DRIVING",
          },
          function (response1, status1) {
            if (status1 === "OK") {
              var route1Path = new google.maps.Polyline({
                path: response1.routes[0].overview_path,
              });

              directionsService.route(
                {
                  origin: route2.origin,
                  destination: route2.destination,
                  travelMode: "DRIVING",
                },
                function (response2, status2) {
                  if (status2 === "OK") {
                    var route2EndLocation =
                      response2.routes[0].legs[0].end_location;
                    var isNearEndPoint =
                      google.maps.geometry.poly.isLocationOnEdge(
                        route2EndLocation,
                        route1Path,
                        0.01
                      );

                    if (isNearEndPoint) {
                      var route1Distance =
                        response1.routes[0].legs[0].distance.value;
                      var route2Distance =
                        response2.routes[0].legs[0].distance.value;

                      var isShorter = route2Distance < route1Distance + 1;
                      var isOnPath = false;
                      var isOppositeDirection = false;

                      var route2Path = response2.routes[0].overview_path;
                      isOnPath = route2Path.some((point) =>
                        google.maps.geometry.poly.isLocationOnEdge(
                          point,
                          route1Path,
                          10e-1
                        )
                      );

                      var route1Start =
                        response1.routes[0].legs[0].start_location;
                      var route1End = response1.routes[0].legs[0].end_location;
                      var route2Start =
                        response2.routes[0].legs[0].start_location;
                      var route2End = response2.routes[0].legs[0].end_location;

                      var route1Heading =
                        google.maps.geometry.spherical.computeHeading(
                          route1Start,
                          route1End
                        );
                      var route2Heading =
                        google.maps.geometry.spherical.computeHeading(
                          route2Start,
                          route2End
                        );

                      var headingDifference = Math.abs(
                        route1Heading - route2Heading
                      );
                      isOppositeDirection =
                        headingDifference > 150 && headingDifference < 210;

                      if (isShorter && isOnPath && !isOppositeDirection) {
                        validRoutes.push(response1);
                      }
                    }

                    if (index === rides.length - 1) {
                      console.log("Подходящие маршруты:", validRoutes);
                    }
                  }
                }
              );
            }
          }
        );
      });
    });
  });
}

function initMap() {}
