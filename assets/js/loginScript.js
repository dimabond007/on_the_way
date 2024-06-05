document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    // Fetch data from data.json file
    fetch('http://localhost:8000/users/' + username)
        .then(response => response.json())
        .then(data => {
            // Check if username exists in the data
            const user = data

            if (user && user.password === password) {
                errorMessage.textContent = "Login successful!";
                errorMessage.style.color = "green";
                localStorage.setItem('isLoggedIn', user.id);
                window.location.href = './index.html';
            } else {
                errorMessage.textContent = "Invalid username or password.";
                errorMessage.style.color = "red";
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            errorMessage.textContent = "Error fetching data.";
            errorMessage.style.color = "red";
        });
});
