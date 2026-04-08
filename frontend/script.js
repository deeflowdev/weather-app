const input = document.getElementById("searchInput");
const button = document.getElementById("searchBtn");
const weatherBox = document.getElementById("weather-data");
const errorBox = document.getElementById("errorBox");

async function fetchWeather() {
  const city = input.value.trim();

  if (!city) {
    errorBox.textContent = "enter a city name.";
    return;
  }

  errorBox.textContent = "";
  weatherBox.style.display = "block";
  weatherBox.innerHTML = "loading...";

  try {
    const res = await fetch(
      `http://127.0.0.1:5000/weather?city=${encodeURIComponent(city)}`,
    );

    const data = await res.json();

    if (data.error) {
      weatherBox.style.display = "none";
      errorBox.textContent = data.error;
      return;
    }

    renderWeather(data);
  } catch (err) {
    weatherBox.style.display = "none";
    errorBox.textContent = "backend error. check server.";
  }
}

function renderWeather(data) {
  const temp = Math.round(data.main.temp);
  const humidity = data.main.humidity;
  const condition = data.weather[0].main;
  const description = data.weather[0].description;
  const icon = data.weather[0].icon;

  weatherBox.innerHTML = `
    <div class="weather-card">

      <div class="weather-top">

        <div class="weather-icon">
          <img 
            src="https://openweathermap.org/img/wn/${icon}@2x.png" 
            alt="${description}"
          />
        </div>

        <div class="weather-info">
          <h2>${data.name}, ${data.sys?.country || ""}</h2>
          <p class="condition">${condition}</p>
          <p class="temp">${temp}°C</p>
        </div>

      </div>

      <div class="weather-details">
        <p>humidity: ${humidity}%</p>
        <p>description: ${description}</p>
      </div>

    </div>
  `;
}

button.addEventListener("click", fetchWeather);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    fetchWeather();
  }
});
