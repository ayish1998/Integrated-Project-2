import { loadWeeklyData,
    loadAirQualityData,
    getNews,
     } from './main.js';

document.addEventListener("DOMContentLoaded", function () {
const searchInput = document.getElementById('search-input');
const suggestionsList = document.getElementById('suggestions');
const searchButton = document.getElementById('search-button');

searchInput.addEventListener('input', handleSearchInput);
searchButton.addEventListener('click', searchWeatherData);

const searchApiUrl = 'https://weatherapi-com.p.rapidapi.com/search.json';
const searchHeaders = {
'X-RapidAPI-Key': '1bb0b0932amshadc927c7f447973p1e25e2jsn0eb548483795',
'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
};

const apiUrl = 'https://weatherbit-v1-mashape.p.rapidapi.com/forecast/daily';
const headers = {
'X-RapidAPI-Key': '1ca8a0fb66msh23fd26fd3e1d4f5p19d955jsndb437160b2d1',
'X-RapidAPI-Host': 'weatherbit-v1-mashape.p.rapidapi.com'
};

const airApiUrl = 'https://air-quality-by-api-ninjas.p.rapidapi.com/v1/airquality';
const airHeaders = {
'X-RapidAPI-Key': 'dc4b4555fdmsh5c18d8c366dfd18p132b94jsnf94eb119e74c',
'X-RapidAPI-Host': 'air-quality-by-api-ninjas.p.rapidapi.com'
};

//Function to get current location weather
async function getCurrentLocationWeather() {
return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;

            try {
                const response = await fetch(`${apiUrl}?lat=${latitude}&lon=${longitude}&days=16`, {
                    headers: headers
                });
                const data = await response.json();
                resolve(data);
            } catch (error) {
                reject(error);
            }
        },
        (error) => {
            reject(error);
        }
    );
});
}


//Function to handle search input
async function handleSearchInput() {
const searchQuery = searchInput.value.trim();
suggestionsList.innerHTML = '';

if (searchQuery.length > 0) {
    try {
        const response = await fetch(`${searchApiUrl}?q=${searchQuery}`, {
            headers: searchHeaders
        });
        const data = await response.json();
        const suggestions = data.map(item => `${item.name}, ${item.country}`);
        displaySuggestions(suggestions, data);
    } catch (error) {
        console.log('Error fetching suggestions:', error);
    }
}
}

//Function to display suggestions
function displaySuggestions(suggestions, data) {
suggestions.forEach((suggestion, index) => {
    const listItem = document.createElement('li');
    listItem.className = 'suggestion';

    const link = document.createElement('a');
    link.href = '#';
    link.textContent = suggestion;
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const clickedItem = data[index];
        const { lat, lon } = clickedItem;

        searchInput.value = clickedItem.name;
        searchWeatherData(lat, lon);
        suggestionsList.innerHTML = '';
    });

    listItem.appendChild(link);
    suggestionsList.appendChild(listItem);
});
}

//Function to search weather data
async function searchWeatherData(latitude, longitude) {
const searchValue = searchInput.value;

try {
    const cityResponse = await fetch(`${searchApiUrl}?q=${searchValue}`, {
        headers: searchHeaders
    });
    const cityData = await cityResponse.json();
    const { lat, lon } = cityData[0];

    const weatherResponse = await fetch(`${apiUrl}?lat=${lat}&lon=${lon}&days=16`, {
        headers: headers
    });
    const airResponse = await fetch(`${airApiUrl}?lat=${lat}&lon=${lon}`, {
        headers: airHeaders
    });

    const weatherData = await weatherResponse.json();
    const airQualityData = await airResponse.json();

    clearWeatherData();
    loadAirQualityData(airQualityData);
    loadWeeklyData(weatherData);
} catch (error) {
    console.log('An error occurred while fetching the data:', error);
}
}

//Function to clear weather data
function clearWeatherData() {
tabcontent3.innerHTML = '';
aside.innerHTML = '';
}

//Function to fetch data
async function fetchData() {
try {
    const weatherData = await getCurrentLocationWeather();
    console.log(weatherData);
    loadWeeklyData(weatherData);
    const airResponse = await fetch(`${airApiUrl}?lat=${weatherData.lat}&lon=${weatherData.lon}`, {
        headers: airHeaders
    });
    const airQualityData = await airResponse.json();
    loadAirQualityData(airQualityData);
    getNews();
} catch (error) {
    console.error(error);
}
}
fetchData();
})