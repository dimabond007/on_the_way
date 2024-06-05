document.addEventListener('DOMContentLoaded', function () {
    fetch('data/data.json')
        .then(response => response.json())
        .then(data => {
            const rides = data.rides;
            const rideRow = document.querySelector('.rideRow');

            rides.forEach(ride => {
                const rideElement = document.createElement('div');
                rideElement.classList.add('ride');

                rideElement.innerHTML = `
                    <div class="ride-details">
                        <p><strong>From:</strong> ${ride.from}</p>
                        <p><strong>To:</strong> ${ride.to}</p>
                        <p><strong>Free Seats:</strong> ${ride.free_seats}</p>
                        <p><strong>Trunk Available:</strong> ${ride.is_trunk ? 'Yes' : 'No'}</p>
                        <p><strong>Date of Ride:</strong> ${ride.date_of_ride}</p>
                        <p><strong>Time of Ride:</strong> ${ride.time_of_ride}</p>
                        <button class="takeRideButton" data-ride-id="${ride.id}">Take Ride</button>
                        <p ><strong>Free Seats</strong></p>

                        <input placeholder ="${ride.free_seats}"></input>
                    </div>
                `;

                rideRow.appendChild(rideElement);
            });

            fetch('http://localhost:8000/orders/')
                .then(response => {

                    response.json().then(orders => {

                        console.log(orders);

                        const buttons = document.querySelectorAll('.takeRideButton');
                        buttons.forEach(button => {
                            orders.forEach(order => {
                                const rideId = button.dataset.rideId;
                                if (order.ride_id === rideId) {
                                    button.style.backgroundColor = 'green';
                                    button.disabled = true;
                                }
                            })

                        })


                    });
                }).catch(error => {

                })
        })
        .catch(error => {
            console.error('Error loading rides:', error);
        });

    document.querySelector('.rideRow').addEventListener('click', function (event) {
        if (event.target.classList.contains('takeRideButton')) {
            event.preventDefault(); // Prevent default form submission behavior
            const button = event.target;
            button.style.backgroundColor = 'green';
            button.disabled = true;
            const rideId = button.dataset.rideId;
            addOrder(rideId);
        }
    });

    function addOrder(rideId) {
        const userId = localStorage.getItem('isLoggedIn');
        const newOrder = {
            id: generateUniqueId(),
            ride_id: rideId,
            user_id: userId,
            status: true
        };

        fetch('http://localhost:8000/orders', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newOrder)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Order added successfully:', data);
                // You can perform further actions upon successful addition of the order if needed
            })
            .catch(error => {
                console.error('Error adding order:', error);
            });
    }

    function generateUniqueId() {
        return Math.random().toString(36).substr(2, 9);
    }
});
