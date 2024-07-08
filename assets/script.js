const apiKey = '4aa5152ea42de8a24c45d2fbb931ff81';
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const cityNameElem = document.getElementById('city-name');
const currentWeatherElem = document.getElementById('current-weather');
const forecastElem = document.getElementById('forecast');
const historyListElem = document.getElementById('history-list');

let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        fetchWeatherData(city);
        updateSearchHistory(city);
    }
});

historyListElem.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        fetchWeatherData(e.target.textContent);
    }
});

function fetchWeatherData(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            updateWeatherInfo(data);
            updateForecast(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function updateWeatherInfo(data) {
    const city = data.city.name;
    const weather = data.list[0];
    const date = new Date(weather.dt * 1000).toLocaleDateString();
    const icon = `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`;
    const temp = weather.main.temp;
    const humidity = weather.main.humidity;
    const windSpeed = weather.wind.speed;

    cityNameElem.textContent = `${city} (${date})`;
    currentWeatherElem.innerHTML = `
        <img src="${icon}" alt="${weather.weather[0].description}">
        <p>Temperature: ${temp} °C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
    `;
}

function updateForecast(data) {
    forecastElem.innerHTML = '';
    for (let i = 0; i < data.list.length; i += 8) {
        const weather = data.list[i];
        const date = new Date(weather.dt * 1000).toLocaleDateString();
        const icon = `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`;
        const temp = weather.main.temp;
        const humidity = weather.main.humidity;
        const windSpeed = weather.wind.speed;

        const forecastItem = document.createElement('div');
        forecastItem.innerHTML = `
            <h3>${date}</h3>
            <img src="${icon}" alt="${weather.weather[0].description}">
            <p>Temperature: ${temp} °C</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
        `;
        forecastElem.appendChild(forecastItem);
    }
}

function updateSearchHistory(city) {
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        renderSearchHistory();
    }
}

function renderSearchHistory() {
    historyListElem.innerHTML = '';
    searchHistory.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        historyListElem.appendChild(li);
    });
}

renderSearchHistory();
