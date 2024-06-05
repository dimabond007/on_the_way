document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:8000/orders')
        .then(response => response.json())
        .then(data => {
            const orders = data;
            const rideRow = document.querySelector('.rideRow');
            orders.forEach(order => {
                if (order.status === true) {
                    const userId = localStorage.getItem('isLoggedIn');
                    if (order.user_id == userId) {
                        fetch('http://localhost:8000/rides/' + order.ride_id)
                            .then(response => response.json())
                            .then(ride => {
                                console.log(ride.number_of_driver);
                                fetch('http://localhost:8000/users/' + ride.number_of_driver).then(response => response.json()).then((driver) => {

                                    const rideElement = document.createElement('div');
                                    rideElement.classList.add('ride');
                                    rideElement.innerHTML = `
                                        <p>Ride Details:</p>
                                        <p>Origin: ${ride.from}</p>
                                        <p>Destination: ${ride.to}</p>
                                        <p>Driver name: ${driver.name}</p>
                                        <p>Driver Phone: ${driver.phone}</p>
                                        <p>Ride Date: ${ride.date_of_ride}</p>
                                        <p>Ride Time: ${ride.time_of_ride}</p>
                                    `;

                                    rideRow.appendChild(rideElement);


                                })

                            });
                    }

                }
            });
        })
        .catch(error => console.error('Error fetching the data:', error));
});
