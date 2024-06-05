function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: { lat: 32.0853, lng: 34.7818 } // центр Израиля
    });

    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer2 = new google.maps.DirectionsRenderer({
        map: map,
        polylineOptions: { strokeColor: 'red' }
    });

    fetch('http://127.0.0.1:8000/rides').then(function (response) {
        response.json().then(function (rides) {
            var validRoutes = [];

            rides.forEach(function (ride, index) {
                var route1 = {
                    origin: ride.from,
                    destination: ride.to
                };

                var route2 = {
                    origin: 'Ashdod, Israel',
                    destination: 'Emunim, Israel'
                };

                directionsService.route({
                    origin: route1.origin,
                    destination: route1.destination,
                    travelMode: 'DRIVING'
                }, function (response1, status1) {
                    if (status1 === 'OK') {
                        var route1Path = new google.maps.Polyline({
                            path: response1.routes[0].overview_path
                        });

                        directionsService.route({
                            origin: route2.origin,
                            destination: route2.destination,
                            travelMode: 'DRIVING'
                        }, function (response2, status2) {
                            if (status2 === 'OK') {
                                directionsRenderer2.setDirections(response2);

                                var route2EndLocation = response2.routes[0].legs[0].end_location;
                                var isNearEndPoint = google.maps.geometry.poly.isLocationOnEdge(route2EndLocation, route1Path, 0.01);

                                if (isNearEndPoint) {
                                    var route1Distance = response1.routes[0].legs[0].distance.value;
                                    var route2Distance = response2.routes[0].legs[0].distance.value;

                                    var isShorter = route2Distance < route1Distance+1;
                                    var isOnPath = false;
                                    var isOppositeDirection = false;

                                    var route2Path = response2.routes[0].overview_path;
                                    isOnPath = route2Path.some(point => google.maps.geometry.poly.isLocationOnEdge(point, route1Path, 10e-1));

                                    var route1Start = response1.routes[0].legs[0].start_location;
                                    var route1End = response1.routes[0].legs[0].end_location;
                                    var route2Start = response2.routes[0].legs[0].start_location;
                                    var route2End = response2.routes[0].legs[0].end_location;

                                    var route1Heading = google.maps.geometry.spherical.computeHeading(route1Start, route1End);
                                    var route2Heading = google.maps.geometry.spherical.computeHeading(route2Start, route2End);

                                    var headingDifference = Math.abs(route1Heading - route2Heading);
                                    isOppositeDirection = headingDifference > 150 && headingDifference < 210;

                                    if (isShorter && isOnPath && !isOppositeDirection) {
                                        validRoutes.push(response1);
                                    }
                                }

                                if (index === rides.length - 1) {
                                    console.log('Подходящие маршруты:', validRoutes);
                                    validRoutes.forEach(function (validRoute) {
                                        var directionsRenderer1 = new google.maps.DirectionsRenderer({
                                            map: map,
                                            polylineOptions: { strokeColor: 'blue' }
                                        });
                                        directionsRenderer1.setDirections(validRoute);
                                    });
                                }
                            }
                        });
                    }
                });
            });
        });
    });
}

google.maps.event.addDomListener(window, 'load', initMap);
