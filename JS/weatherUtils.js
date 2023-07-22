//Daily weather Rapid API
const dailyAPIUrl = 'https://weatherapi-com.p.rapidapi.com/forecast.json';
const dailyHeaders = {
  'X-RapidAPI-Key': '1bb0b0932amshadc927c7f447973p1e25e2jsn0eb548483795',
  'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
};

//Weekly weather data api
export const apiUrl = 'https://weatherbit-v1-mashape.p.rapidapi.com/forecast/daily';
export const headers = {
  'X-RapidAPI-Key': '1ca8a0fb66msh23fd26fd3e1d4f5p19d955jsndb437160b2d1', //'9ce3025d18msh24f6271c3e62f96p166c6djsn00ebb3963f6a', //'6cbee0e4e6mshf61f1a0cbd22aa9p124cc0jsnfd36b4991892', //'1ca8a0fb66msh23fd26fd3e1d4f5p19d955jsndb437160b2d1', 
  'X-RapidAPI-Host': 'weatherbit-v1-mashape.p.rapidapi.com'
};

export const searchApiUrl = 'https://weatherapi-com.p.rapidapi.com/search.json';
export const searchHeaders = {
  'X-RapidAPI-Key': '6cbee0e4e6mshf61f1a0cbd22aa9p124cc0jsnfd36b4991892',
  'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
};

export const airApiUrl = 'https://air-quality-by-api-ninjas.p.rapidapi.com/v1/airquality';
export const airHeaders = {
  'X-RapidAPI-Key': 'dc4b4555fdmsh5c18d8c366dfd18p132b94jsnf94eb119e74c',
  'X-RapidAPI-Host': 'air-quality-by-api-ninjas.p.rapidapi.com'
};

// Rapid API
export const newsApiUrl = 'https://weather338.p.rapidapi.com/news/list?offset=0&limit=10';
export const newsHeaders = {
  'X-RapidAPI-Key': '1bb0b0932amshadc927c7f447973p1e25e2jsn0eb548483795',
  'X-RapidAPI-Host': 'weather338.p.rapidapi.com'
};

//Function to get current location weather
export async function getCurrentLocationWeather() {
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
export async function handleSearchInput(searchInput, suggestionsList, displaySuggestions, loadWeatherData, loadAirQualityData, loadWeeklyData, getNews) {
  const searchQuery = searchInput.value.trim();
  suggestionsList.innerHTML = '';

  if (searchQuery.length > 0) {
    try {
      const response = await fetch(`${searchApiUrl}?q=${searchQuery}`, {
        headers: searchHeaders
      });
      const data = await response.json();
      const suggestions = data.map(item => `${item.name}, ${item.country}`);
      displaySuggestions(suggestions, data, searchInput, suggestionsList, searchWeatherData, loadWeatherData, loadAirQualityData, loadWeeklyData, getNews);
    } catch (error) {
      console.log('Error fetching suggestions:', error);
    }
  }
}

//Function to display suggestions
export function displaySuggestions(suggestions, data, searchInput, suggestionsList, searchWeatherData, loadWeatherData, loadAirQualityData, loadWeeklyData, getNews) {
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
      searchWeatherData(searchInput, loadWeatherData, loadAirQualityData, loadWeeklyData, getNews);
      suggestionsList.innerHTML = '';
    });

    listItem.appendChild(link);
    suggestionsList.appendChild(listItem);
  });
}

//Function to search weather data
export async function searchWeatherData(searchInput, loadWeatherData, loadAirQualityData, loadWeeklyData, getNews) {
  const searchValue = searchInput.value;

  try {
    const cityResponse = await fetch(`${searchApiUrl}?q=${searchValue}`, {
      headers: searchHeaders
    });
    const cityData = await cityResponse.json();
    console.log(cityData);
    const { lat, lon } = cityData[0];

    const dailyResponse = await fetch(`${dailyAPIUrl}?q=${lat},${lon}&days=2`, {
      headers: dailyHeaders
    });
    const weather = await dailyResponse.json();

    const weatherResponse = await fetch(`${apiUrl}?lat=${lat}&lon=${lon}&days=16`, {
      headers: headers
    });
    const weatherData = await weatherResponse.json();

    const airResponse = await fetch(`${airApiUrl}?lat=${lat}&lon=${lon}`, {
      headers: airHeaders
    });
    const airQualityData = await airResponse.json();

    const newsResponse = await fetch(newsApiUrl, {
      headers: newsHeaders
    });
    const newsData = await newsResponse.json();

    clearWeatherData();
    loadWeatherData(weather);
    loadAirQualityData(airQualityData);
    loadWeeklyData(weatherData);
    getNews(newsData);
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
}

//Function to fetch data
export async function fetchData(loadWeatherData, loadAirQualityData, loadWeeklyData, getNews) {
  try {
    const weatherData = await getCurrentLocationWeather();
    
    const dailyResponse = await fetch(`${dailyAPIUrl}?q=${weatherData.lat},${weatherData.lon}&days=2`, {
      headers: dailyHeaders
    });
    const weather = await dailyResponse.json();

    const airResponse = await fetch(`${airApiUrl}?lat=${weatherData.lat}&lon=${weatherData.lon}`, {
      headers: airHeaders
    });
    const airQualityData = await airResponse.json();

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
