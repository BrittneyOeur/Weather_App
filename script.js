// Retrieves the weather
function getWeather() {
    const apiKey = 'APIKEY';
    const city = document.getElementById('city').value;
    const country = document.getElementById('country').value;

    // If there is no input for city or country (empty inputs)
    if (!city || !country) {
        alert("Please enter a city and country");
        return;
    }
    
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}, ${country}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    // Sends request to get the current weather
    fetch(currentWeatherUrl) 
        .then(response => response.json())  // Processes the response and converts it into JS object
        .then(data => { // Sends data to the displayWeather function to update page
            displayWeather(data);
        })
        .catch(error => {   // If there's an error
            console.error("Error fetching current weather data:", error);
            alert("Error fetching current weather data. Please try again.");
        });
    
    // Sends request to get the forecast
    fetch(forecastUrl)
        .then(response => response.json())  // Processes the response and converts it into JS object
        .then(data => { // Sends data to the displayHourlyForecast function to update page
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error("Error fetching hourly forecast data:", error);
            alert("Error fetching hourly forecast data. Please try again.");
        });
}

// Displays the current weather
function displayWeather(data) {
    const weatherDisplay = document.getElementById("top-section");

    const weatherIcon = document.createElement("img");
    weatherIcon.id = "weather-icon";

    weatherDisplay.innerHTML = "";

    // Create divs for the necessary items
    const sectionsWeather = document.createElement("div");
    sectionsWeather.classList.add("sections");

    const tempWeatherDisplay = document.createElement("div");
    tempWeatherDisplay.id = "temperature-display";

    const citySect = document.createElement("div");
    citySect.id = "city-sect";

    const weatherDiscription = document.createElement("div");
    weatherDiscription.id = "weather-description"

    // If there is an error code
    if (data.cod === "404") {
        weatherDisplay.innerHTML = `<p>${data.message}</p>`;
    }

    // Otherwise, set the necessary values
    else {
        const cityName = data.name;
        const stateName = data.sys.country;
        const temperature = Math.round((data.main.temp - 273.15) * (9/5) + 32); // Converts the temperature from Kelvin to Fahrenheit
        const cel = Math.round(data.main.temp - 273.15);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        tempWeatherDisplay.innerHTML = `<p>${temperature} °F | ${cel} °C</p>`;
        citySect.innerHTML = `<p>${cityName}, ${stateName}</p>`;
        weatherDiscription.innerHTML = `<p>${description}</p>`;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        weatherDisplay.appendChild(weatherIcon);

        sectionsWeather.appendChild(citySect);
        sectionsWeather.appendChild(tempWeatherDisplay);
        sectionsWeather.appendChild(weatherDiscription);

        weatherDisplay.appendChild(sectionsWeather);

        showImage();
    }
}

// Displays the hourly forecast
function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById("hourly-forecast");

    // Clears previous hourly forecast content
    hourlyForecastDiv.innerHTML = "";

    const next24Hours = hourlyData.slice(0, 8);

    // Iterates through each item
    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);  // Converts it into a readable hour
        const hour = dateTime.getHours();   // Extracts type hour of the time
        const temperature = Math.round((item.main.temp - 273.15) * (9/5) + 32); // Converts the temperature from Kelvin to Fahrenheit
        const cel = Math.round(item.main.temp - 273.15);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        // Create HTML for each hour
        const hourlyItem = `
            <div class="hourly-item">
                <div>${hour}:00</div>
                <img src="${iconUrl}" alt="${item.weather[0].description}"/>
                <div>${temperature} °F</div>
                <div>${cel} °C</div>
            </div>
        `;

        // Each hourlyItem is added to the forecast section on the page
        hourlyForecastDiv.innerHTML += hourlyItem;
    });
}

function showImage() {
    const weatherIcon = document.getElementById("weather-icon");
    weatherIcon.style.display = 'block';
}