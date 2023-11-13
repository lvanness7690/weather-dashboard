const apiKey = 'f563bc3eac39764c5f83a70176ec01ad'; // Use your actual OpenWeatherMap API key

document.getElementById('search-button').addEventListener('click', (event) => {
    event.preventDefault(); // Prevents page from refreshing on form submission
    const city = document.getElementById('city-search').value.trim();
    if (city) {
        searchCity(city).catch(error => console.error('Search City Error:', error));
    }
});

async function searchCity(cityName) {
    try {
        const geoApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
        const geoResponse = await fetch(geoApiUrl);
        const geoData = await geoResponse.json();
        if (geoData.length) {
            const { lat, lon } = geoData[0];
            await getWeather(lat, lon, cityName);
        } else {
            console.error('City not found.');
            alert('City not found. Please try another search.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while searching for the city.');
    }
}

async function getWeather(latitude, longitude, cityName) {
    try {
        const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;
        const weatherResponse = await fetch(weatherApiUrl);
        const weatherData = await weatherResponse.json();
        displayWeather(weatherData, cityName); // Implement this function to update the UI
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while retrieving the weather data.');
    }
}

function displayWeather(weatherData, cityName) {
    // Update current weather
    document.getElementById('city-name').textContent = cityName;
    document.getElementById('current-date').textContent = new Date().toLocaleDateString();
    document.getElementById('temperature').textContent = `${weatherData.list[0].main.temp} °F`;
    document.getElementById('wind-speed').textContent = `${weatherData.list[0].wind.speed} mph`;
    document.getElementById('humidity').textContent = `${weatherData.list[0].main.humidity} %`;

    // Update forecast
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = ''; // Clear any previous forecast data

    for (let i = 0; i < weatherData.list.length; i += 8) { // Assuming 8 intervals per day
        const forecast = weatherData.list[i];
        const iconCode = forecast.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`; // URL for the weather icon image

        const forecastElem = document.createElement('div');
        forecastElem.className = 'forecast-day';
        forecastElem.innerHTML = `
            <h4>${new Date(forecast.dt * 1000).toLocaleDateString()}</h4>
            <img src="${iconUrl}" alt="Weather icon">
            <p>Temp: ${forecast.main.temp} °F</p>
            <p>Wind: ${forecast.wind.speed} mph</p>
            <p>Humidity: ${forecast.main.humidity}%</p>
        `;
        forecastDiv.appendChild(forecastElem);
    }

    // Update search history
    const historyList = document.getElementById('history-list');
    if (!Array.from(historyList.children).some(item => item.textContent === cityName)) {
        const newHistoryItem = document.createElement('li');
        newHistoryItem.textContent = cityName;
        newHistoryItem.addEventListener('click', () => {
            searchCity(cityName).catch(error => console.error('Search City Error:', error));
        });
        historyList.appendChild(newHistoryItem);
    }
}
