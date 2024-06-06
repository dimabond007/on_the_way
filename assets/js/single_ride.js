document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const form = document.createElement("form");

  async function loadDataToForm() {
    try {
      const response = await fetch("http://localhost:8000/rides/" + id);
      const data = await response.json();

      const driverData = await getUserData(data.number_of_driver, "driver");
      const commanderData = await getUserData(
        data.number_of_commander,
        "commander"
      );
      const officerData = await getUserData(data.number_of_officer, "officer");

      form.innerHTML = `
              <div class="ride">
                  <label>from: <span class="from">${data.from}</span></label>
                  <label>to: <span class="to">${data.to}</span></label>
                  <label>departure: <span class="time">${data.date_of_ride} ${data.time_of_ride}</span></label>
              </div>
              ${driverData}
              ${commanderData}
              ${officerData}
          `;
      document.body.appendChild(form);
    } catch (error) {
      console.error("Error loading rides:", error);
    }
  }

  async function getUserData(userId, typeOfUser) {
    try {
      const response = await fetch("http://localhost:8000/users/" + userId);
      const data = await response.json();
      return `
              <div>
                  <label>${typeOfUser}: <span class="${typeOfUser}-name">${data.name}</span></label>
                  <label>${typeOfUser}-phone: <span class="${typeOfUser}-phone">${data.phone}</span></label>
              </div>`;
    } catch (error) {
      console.error(`Error loading ${typeOfUser} data:`, error);
    }
  }

  loadDataToForm();
});
