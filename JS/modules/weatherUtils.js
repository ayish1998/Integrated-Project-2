import { renderHeatmap, initMap } from './weatherviz.js';
import{
  loadAirQualityData,
  loadWeatherData,
  loadWeeklyData,
  getNews
} from './weatherdata.js'


//Daily weather Rapid API
const dailyAPIUrl = 'https://weatherapi-com.p.rapidapi.com/forecast.json';
const dailyHeaders = {
  'X-RapidAPI-Key': '1bb0b0932amshadc927c7f447973p1e25e2jsn0eb548483795',
  'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
};

//Weekly weather data api
const apiUrl = 'https://weatherbit-v1-mashape.p.rapidapi.com/forecast/daily';
const headers = {
  'X-RapidAPI-Key': '1ca8a0fb66msh23fd26fd3e1d4f5p19d955jsndb437160b2d1', //'9ce3025d18msh24f6271c3e62f96p166c6djsn00ebb3963f6a', //'1bb0b0932amshadc927c7f447973p1e25e2jsn0eb548483795', //'6cbee0e4e6mshf61f1a0cbd22aa9p124cc0jsnfd36b4991892', //'1ca8a0fb66msh23fd26fd3e1d4f5p19d955jsndb437160b2d1', 
  'X-RapidAPI-Host': 'weatherbit-v1-mashape.p.rapidapi.com'
};

//Search autocomplete Rapid API
const searchApiUrl = 'https://weatherapi-com.p.rapidapi.com/search.json';
const searchHeaders = {
  'X-RapidAPI-Key': '6cbee0e4e6mshf61f1a0cbd22aa9p124cc0jsnfd36b4991892',
  'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
};

//Air Quality Rapid API
const airApiUrl = 'https://air-quality-by-api-ninjas.p.rapidapi.com/v1/airquality';
const airHeaders = {
  'X-RapidAPI-Key': 'dc4b4555fdmsh5c18d8c366dfd18p132b94jsnf94eb119e74c',
  'X-RapidAPI-Host': 'air-quality-by-api-ninjas.p.rapidapi.com'
};

//News Rapid API
const newsApiUrl = 'https://weather338.p.rapidapi.com/news/list?offset=0&limit=10';
const newsHeaders = {
  'X-RapidAPI-Key': '1bb0b0932amshadc927c7f447973p1e25e2jsn0eb548483795',
  'X-RapidAPI-Host': 'weather338.p.rapidapi.com'
};

//Function to get current location's weather data
export async function getCurrentLocationWeather() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(`${dailyAPIUrl}?q=${latitude},${longitude}&days=2`, {
            headers: dailyHeaders
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
export async function handleSearchInput(searchInput, suggestionsList, displaySuggestions) {
  const searchQuery = searchInput.value.trim();
  suggestionsList.innerHTML = '';

  if (searchQuery.length > 0) {
    try {
      const response = await fetch(`${searchApiUrl}?q=${searchQuery}`, {
        headers: searchHeaders
      });
      const data = await response.json();
      console.log(data);
      const suggestions = data.map(item => `${item.name}, ${item.country}`);
      displaySuggestions(suggestions, data, searchInput, suggestionsList);
    } catch (error) {
      console.log('Error fetching suggestions:', error);
    }
  }
}

//Function to display suggestions
export function displaySuggestions(suggestions, data, searchInput, suggestionsList) {
  console.log(data);
  suggestions.forEach((suggestion, index) => {
    const listItem = document.createElement('li');
    listItem.className = 'suggestion';

    const link = document.createElement('a');
    link.href = '#';
    link.textContent = suggestion;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const clickedItem = data[index];

      searchInput.value = clickedItem.name;
      searchWeatherData(searchInput);
      suggestionsList.innerHTML = '';
    });

    listItem.appendChild(link);
    suggestionsList.appendChild(listItem);
    suggestionsList.addEventListener('mouseleave', () => {
      suggestionsList.innerHTML = '';
    });
  });
}

//Function to search weather data
export async function searchWeatherData(searchInput) {
  const searchValue = searchInput.value;

  try {
    const cityResponse = await fetch(`${searchApiUrl}?q=${searchValue}`, {
      headers: searchHeaders
    });
    const cityData = await cityResponse.json();
    console.log(cityData);
    const { lat, lon } = cityData[0];

    //Fetch daily weather data
    const dailyResponse = await fetch(`${dailyAPIUrl}?q=${lat},${lon}&days=2`, {
      headers: dailyHeaders
    });
    const weather = await dailyResponse.json();

    //Fetch weekly weather data
    const weatherResponse = await fetch(`${apiUrl}?lat=${lat}&lon=${lon}&days=16`, {
      headers: headers
    });
    const weatherData = await weatherResponse.json();

    //Fetch air quality data
    const airResponse = await fetch(`${airApiUrl}?lat=${lat}&lon=${lon}`, {
      headers: airHeaders
    });
    const airQualityData = await airResponse.json();

    //Fetch news data
    const newsResponse = await fetch(newsApiUrl, {
      headers: newsHeaders
    });
    const newsData = await newsResponse.json();

    //Fetch weather heatmap visualization data
    const heatmapResponse = await fetch(`${apiUrl}?lat=${lat}&lon=${lon}&days=7`, {
      headers: headers
    });
    const heatmapData = await heatmapResponse.json();

    const userLatLng = { lat: lat, lng: lon };
    console.log(userLatLng);

    clearWeatherData();
    loadWeatherData(weather);
    loadAirQualityData(airQualityData);
    loadWeeklyData(weatherData);
    getNews(newsData);
    renderHeatmap(heatmapData)
    initMap(userLatLng)
  } catch (error) {
    console.log('An error occurred while fetching the data:', error);
  }
}

//Function to clear weather data
export function clearWeatherData() {
  tabcontent1.innerHTML = '';
  tabcontent2.innerHTML = '';
  tabcontent3.innerHTML = '';
  aside.innerHTML = '';
  document.getElementById('title').innerHTML = '';
}

//Function to fetch data
export async function fetchData(loadWeatherData, loadAirQualityData, loadWeeklyData, getNews) {
  try {
    //Fetch Weather Data for current weather
    const weather = await getCurrentLocationWeather();
    console.log(weather);
    const lat = weather.location.lat;
    const lon = weather.location.lon;

    //Fetch Weather Data for weekly forecast
    const weatherResponse = await fetch(`${apiUrl}?lat=${lat}&lon=${lon}&days=16`, {
      headers: headers
    });
    const weatherData = await weatherResponse.json();

    //Fetch Air Quality Data
    const airResponse = await fetch(`${airApiUrl}?lat=${lat}&lon=${lon}`, {
      headers: airHeaders
    });
    const airQualityData = await airResponse.json();

    //Fetch News Data
    const newsResponse = await fetch(newsApiUrl, {
      headers: newsHeaders
    });
    const newsData = await newsResponse.json();

    loadWeatherData(weather);
    loadWeeklyData(weatherData);
    loadAirQualityData(airQualityData);
    getNews(newsData);
  } catch (error) {
    console.error(error);
  }
}

//Function to fetch weather visualization data
export async function fetchVizData(renderHeatMap, initMap) {
  try {
     //Fetch Weather Data for current weather
     const weather = await getCurrentLocationWeather();
     console.log(weather);
     const lat = weather.location.lat;
     const lon = weather.location.lon;

     //Fetch weather heatmap data
    const heatmapResponse = await fetch(`${apiUrl}?lat=${lat}&lon=${lon}&days=7`, {
      headers: headers
    });
    const heatmapData = await heatmapResponse.json();
    const userLatLng = {lat, lon};

    renderHeatMap(heatmapData);
    initMap(userLatLng);
  } catch (error) {
    console.error(error);
  }
}
//**********************************************************************************************************************
//HELPER FUNCTIONS
//**********************************************************************************************************************
//Function to create div
export function createDiv(className, text) {
  const div = document.createElement('div');
  div.className = className;
  div.textContent = text;
  return div;
}

//Function to create div with label
export function createDivWithLabel(className, label, text) {
  const div = document.createElement('div');
  div.className = className;

  const labelDiv = document.createElement('div');
  labelDiv.className = 'label';
  labelDiv.textContent = label;

  const dataDiv = document.createElement('div');
  dataDiv.textContent = text;

  div.appendChild(labelDiv);
  div.appendChild(dataDiv);

  return div;
}

//Function to create span
export function createSpan(className, text) {
  const span = document.createElement('span');
  span.className = className;
  span.textContent = text;
  return span;
}
