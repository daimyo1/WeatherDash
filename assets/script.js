const apiKey = 'YOUR_API_KEY';

// Function to fetch weather data
async function getWeatherData(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
    const data = await response.json();
    return data;
}

// Event listener for search button
document.getElementById('searchButton').addEventListener('click', async () => {
    const city = document.getElementById('cityInput').value.trim();
    
    if (city) {
        const weatherData = await getWeatherData(city);
        
        // Display weather information on the page
    }
});