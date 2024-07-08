document.addEventListener('DOMContentLoaded', function() {
    const apiKey = '4aa5152ea42de8a24c45d2fbb931ff81'; 
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const weatherInfo = document.querySelector('.weather-info');
    const currentWeather = document.querySelector('.current-weather');
    const forecast = document.querySelector('.forecast');
    const historySection = document.querySelector('.search-history');
    const cityName = document.querySelector('.city-name');
    const currentWeatherIcon = document.querySelector('.current-weather .weather-icon img');
    const currentTemperature = document.querySelector('.current-weather .temperature span');
    const currentHumidity = document.querySelector('.current-weather .humidity span');
    const currentWindSpeed = document.querySelector('.current-weather .wind-speed span');
    const forecastItemsContainer = document.querySelector('.forecast-items');
    const historyList = document.querySelector('.history-list');

    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    searchBtn.addEventListener('click', searchWeather);
    historyList.addEventListener('click', function(event) {
        if (event.target.tagName === 'LI') {
            const city = event.target.textContent;
            fetchWeather(city);
        }
    });

    function searchWeather() {
        const cityState = searchInput.value.trim();
        if (cityState) {
            fetchWeather(cityState);
            searchInput.value = '';
        }
    }

    function fetchWeather(cityState) {
        const [city, state] = parseCityState(cityState);
        const apiCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city},${state}&appid=${apiKey}&units=imperial`;
        const apiForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city},${state}&appid=${apiKey}&units=imperial`;

        fetch(apiCurrent)
            .then(response => {
                if (!response.ok) {
                    throw new Error('City not found');
                }
                return response.json();
            })
            .then(data => {
                displayCurrentWeather(data);
                addToHistory(data.name);
            })
            .catch(error => {
                console.log('Error fetching current weather:', error);
                alert('City not found. Please enter a valid city.');
            });

        fetch(apiForecast)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Forecast data not available');
                }
                return response.json();
            })
            .then(data => {
                displayForecast(data);
            })
            .catch(error => {
                console.log('Error fetching forecast:', error);
            });

        weatherInfo.classList.remove('hidden');
        forecast.classList.remove('hidden');
        historySection.classList.remove('hidden');
    }

    function parseCityState(cityState) {
        const parts = cityState.split(', ');
        if (parts.length === 2) {
            return parts;
        } else {
            return [cityState, ''];
        }
    }

    function displayCurrentWeather(data) {
        cityName.textContent = data.name;
        currentTemperature.textContent = `${Math.round(data.main.temp)}°F`;
        currentHumidity.textContent = `${data.main.humidity}%`;
        currentWindSpeed.textContent = `${data.wind.speed} mph`;
        const iconUrl = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
        currentWeatherIcon.setAttribute('src', iconUrl);
    }

    function displayForecast(data) {
        forecastItemsContainer.innerHTML = '';
        const forecasts = data.list.filter(item => item.dt_txt.includes('12:00:00'));
        forecasts.forEach(item => {
            const forecastItem = document.createElement('div');
            forecastItem.classList.add('forecast-item');
            forecastItem.innerHTML = `
                <h4>${formatDate(item.dt)}</h4>
                <img src="https://openweathermap.org/img/w/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
                <p>Temp: ${Math.round(item.main.temp)}°F</p>
                <p>Wind: ${item.wind.speed} mph</p>
                <p>Humidity: ${item.main.humidity}%</p>
            `;
            forecastItemsContainer.appendChild(forecastItem);
        });
    }

    function formatDate(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }

    function addToHistory(city) {
        if (!searchHistory.includes(city)) {
            searchHistory.push(city);
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
            updateHistoryUI();
        }
    }

    function updateHistoryUI() {
        historyList.innerHTML = '';
        searchHistory.slice(-5).forEach(city => {
            const listItem = document.createElement('li');
            listItem.textContent = city;
            historyList.appendChild(listItem);
        });
    }

    updateHistoryUI();
});
