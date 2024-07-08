const apiKey = '4aa5152ea42de8a24c45d2fbb931ff81';
const searchBtn = document.getElementById('search-btn');
const cityStateInput = document.getElementById('city-state-input');
const cityNameElem = document.getElementById('city-name');
const currentWeatherElem = document.getElementById('current-weather');
const forecastElem = document.getElementById('forecast');
const historyListElem = document.getElementById('history-list');
const geonamesApiUrl = 'https://secure.geonames.org/searchJSON';

let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

// Initialize autocomplete functionality
cityStateInput.addEventListener('input', function() {
    autocomplete(this.value);
});

searchBtn.addEventListener('click', () => {
    const location = cityStateInput.value.trim();
    if (location) {
        fetchWeatherData(location);
        updateSearchHistory(location);
    }
});

historyListElem.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        fetchWeatherData(e.target.textContent);
    }
});

function autocomplete(input) {
    fetch(`${geonamesApiUrl}?q=${input}&country=US&maxRows=5&username=daimyo1`)
        .then(response => response.json())
        .then(data => {
            if (data && data.geonames) {
                const suggestions = data.geonames.map(item => `${item.name}, ${item.adminCode1}`);
                autocompleteResults(suggestions);
            } else {
                console.error('No geonames found in the response:', data);
            }
        })
        .catch(error => {
            console.error('Autocomplete error:', error);
        });
}

function autocompleteResults(suggestions) {
    const datalist = document.createElement('datalist');
    datalist.id = 'cities';
    suggestions.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        datalist.appendChild(option);
    });
    cityStateInput.setAttribute('list', 'cities');
    cityStateInput.appendChild(datalist);
}

function fetchWeatherData(location) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=imperial`)
        .then(response => response.json())
        .then(data => {
            updateWeatherInfo(data);
            fetchForecast(location);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function fetchForecast(location) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=imperial`)
        .then(response => response.json())
        .then(data => {
            updateForecast(data);
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
        });
}

function updateWeatherInfo(data) {
    const city = data.name;
    const weather = data.weather[0];
    const temp = data.main.temp;
    const icon = `https://openweathermap.org/img/wn/${weather.icon}.png`;
    const description = weather.description;
    const windSpeed = data.wind.speed;
    const humidity = data.main.humidity;
    const date = new Date(data.dt * 1000).toLocaleDateString();

    cityNameElem.textContent = city;
    currentWeatherElem.innerHTML = `
        <img src="${icon}" alt="${description}" style="width: 100px; height: 100px;">
        <p>Temperature: ${temp} °F</p>
        <p>Description: ${description}</p>
        <p>Wind Speed: ${windSpeed} mph</p>
        <p>Humidity: ${humidity}%</p>
        <p>Date: ${date}</p>
    `;
}

function updateForecast(data) {
    forecastElem.innerHTML = '';
    for (let i = 0; i < data.list.length; i += 8) {
        const weather = data.list[i];
        const date = new Date(weather.dt * 1000).toLocaleDateString();
        const icon = `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`;
        const temp = weather.main.temp;
        const description = weather.weather[0].description;
        const windSpeed = weather.wind.speed;
        const humidity = weather.main.humidity;

        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
            <h4>${date}</h4>
            <img src="${icon}" alt="${description}" style="width: 60px; height: 60px;">
            <p>Temperature: ${temp} °F</p>
            <p>Description: ${description}</p>
            <p>Wind Speed: ${windSpeed} mph</p>
            <p>Humidity: ${humidity}%</p>
        `;
        forecastElem.appendChild(forecastItem);
    }
}

function updateSearchHistory(location) {
    if (!searchHistory.includes(location)) {
        searchHistory.push(location);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        renderSearchHistory();
    }
}

function renderSearchHistory() {
    historyListElem.innerHTML = '';
    searchHistory.forEach(location => {
        const li = document.createElement('li');
        li.textContent = location;
        historyListElem.appendChild(li);
    });
}

renderSearchHistory();
