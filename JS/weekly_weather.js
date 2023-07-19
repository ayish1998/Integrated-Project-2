document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const tabs = document.querySelectorAll('.tab')
  const tabContents = document.querySelectorAll('.tabcontent')
  const darkModeSwitch = document.querySelector('#dark-mode-switch')

  // Functions
  const activateTab = tabnum => {

    tabs.forEach(tab => {
      tab.classList.remove('active')
    })

    tabContents.forEach(tabContent => {
      tabContent.classList.remove('active')
    })

    document.querySelector('#tab' + tabnum).classList.add('active')
    document.querySelector('#tabcontent' + tabnum).classList.add('active')
    localStorage.setItem('jstabs-opentab', JSON.stringify(tabnum))

  }

  // Event Listeners
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      activateTab(tab.dataset.tab)
    })
  })

  darkModeSwitch.addEventListener('change', () => {
    document.querySelector('body').classList.toggle('darkmode')
    localStorage.setItem('jstabs-darkmode', JSON.stringify(!darkmode))
  })

  // Retrieve stored data
  let darkmode = JSON.parse(localStorage.getItem('jstabs-darkmode'))
  const opentab = JSON.parse(localStorage.getItem('jstabs-opentab')) || '3'

  // and..... Action!
  if (darkmode === null) {
    darkmode = window.matchMedia("(prefers-color-scheme: dark)").matches // match to OS theme
  }
  if (darkmode) {
    document.querySelector('body').classList.add('darkmode')
    document.querySelector('#dark-mode-switch').checked = 'checked'
  }
  activateTab(opentab)

  const apiUrl = 'https://weatherbit-v1-mashape.p.rapidapi.com/forecast/daily';
  const headers = {
    'X-RapidAPI-Key': '1bb0b0932amshadc927c7f447973p1e25e2jsn0eb548483795',
    'X-RapidAPI-Host': 'weatherbit-v1-mashape.p.rapidapi.com'
  };
  
  const searchApiUrl = 'https://weatherapi-com.p.rapidapi.com/search.json';
  const searchHeaders = {
    'X-RapidAPI-Key': '1bb0b0932amshadc927c7f447973p1e25e2jsn0eb548483795',
    'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
  };
  
  const airApiUrl = 'https://air-quality-by-api-ninjas.p.rapidapi.com/v1/airquality';
  const airHeaders = {
    'X-RapidAPI-Key': 'dc4b4555fdmsh5c18d8c366dfd18p132b94jsnf94eb119e74c',
    'X-RapidAPI-Host': 'air-quality-by-api-ninjas.p.rapidapi.com'
  };
  
  const searchInput = document.getElementById('search-input');
  const suggestionsList = document.getElementById('suggestions');
  const searchButton = document.getElementById('search-button');
  const tabcontent3 = document.getElementById('tabcontent3');
  const aside = document.getElementById('aside');
  
  searchInput.addEventListener('input', handleSearchInput);
  searchButton.addEventListener('click', searchWeatherData);
  
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
  
  function clearWeatherData() {
    tabcontent3.innerHTML = '';
    aside.innerHTML = '';
  }
  
  function createDiv(className, text) {
    const div = document.createElement('div');
    div.className = className;
    div.textContent = text;
    return div;
  }
  
  function createDivWithLabel(className, label, text) {
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
  
  function createSpan(className, text) {
    const span = document.createElement('span');
    span.className = className;
    span.textContent = text;
    return span;
  }
  
  function loadAirQualityData(airQualityData) {
    const airQualityDiv = document.createElement('div');
    airQualityDiv.className = 'air-quality';
    const airQualityLabel = createDiv('heading', 'Air Quality');
    aside.appendChild(airQualityLabel);
  
    const airDataGroupLabels = ['CO', 'NO2', 'O3', 'SO2', 'PM2.5', 'PM10'];
    const airDataGroupData = airDataGroupLabels.map(label => `${airQualityData[label].concentration}`);
  
    for (let i = 0; i < airDataGroupLabels.length; i++) {
      const airDataGroup = document.createElement('div');
      airDataGroup.className = 'info-group';
  
      const airDataGroupLabel = createDiv('label', airDataGroupLabels[i]);
      const airDataGroupSpan = createSpan('info-group-data', airDataGroupData[i]);
  
      airDataGroup.appendChild(airDataGroupLabel);
      airDataGroup.appendChild(airDataGroupSpan);
  
      airQualityDiv.appendChild(airDataGroup);
    }
  
    const airData = airQualityData.overall_aqi;
    aside.appendChild(airQualityDiv);
    aside.appendChild(createDivWithLabel('air-data-group', 'Total Air Quality Index', airData));
  }
  
  function loadWeeklyData(weatherData) {
    const weeklyData = weatherData.data;
    const weekSection = document.createElement('section');
    weekSection.className = 'daytime-section';
    weekSection.dataset.weekSection = '';
  
    for (let i = 0; i < weeklyData.length; i++) {
      const weekCard = document.createElement('div');
      weekCard.className = 'daytime-card';
  
      const icon = document.createElement('img');
      icon.src = `https://www.weatherbit.io/static/img/icons/${weeklyData[i].weather.icon}.png`;
      icon.alt = 'weather-icon';
      weekCard.appendChild(icon);
  
      const date = new Date(weeklyData[i].datetime);
      const weekCardDay = createDiv('daytime-card-hour', date.toLocaleDateString('en-US', { weekday: 'long' }));
      const weekCardDate = createDiv('daytime-card-hour', date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      const tempDiv = createDiv('', `${weeklyData[i].temp}\u00B0C`);
      const descriptionDiv = createDiv('', weeklyData[i].weather.description);
      weekCard.appendChild(weekCardDay);
      weekCard.appendChild(weekCardDate);
      weekCard.appendChild(tempDiv);
      weekCard.appendChild(descriptionDiv);
  
      const infoGroupLabels = ['Feels Like', 'Humidity', 'Cloud', 'Wind', 'Pressure', 'Dewpoint', 'Precipitation', 'UV', 'Snow'];
      const infoGroupData = [
        weeklyData[i].app_min_temp,
        weeklyData[i].rh,
        weeklyData[i].clouds,
        weeklyData[i].wind_spd,
        weeklyData[i].pres,
        weeklyData[i].dewpt,
        weeklyData[i].pop,
        weeklyData[i].uv,
        weeklyData[i].snow
      ];
      const infoGroupUnits = ['\u00B0C', '%', '%', 'm/s', 'mb', '\u00B0C', '%', '', 'mm'];
  
      for (let j = 0; j < infoGroupLabels.length; j++) {
        const infoGroup = document.createElement('div');
        infoGroup.className = 'info-group';
  
        const infoGroupLabel = createDiv('label', infoGroupLabels[j]);
        const infoGroupDataDiv = document.createElement('div');
        const infoGroupDataSpan = createSpan('info-group-data', infoGroupData[j]);
        const infoGroupUnitsSpan = createSpan('info-sub', infoGroupUnits[j]);
  
        infoGroupDataDiv.appendChild(infoGroupDataSpan);
        infoGroupDataDiv.appendChild(infoGroupUnitsSpan);
  
        infoGroup.appendChild(infoGroupLabel);
        infoGroup.appendChild(infoGroupDataDiv);
  
        weekCard.appendChild(infoGroup);
      }
  
      weekSection.appendChild(weekCard);
    }
  
    tabcontent3.appendChild(weekSection);
  }
  
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
  
  async function fetchData() {
    try {
      const weatherData = await getCurrentLocationWeather();
      loadWeeklyData(weatherData);
      const airResponse = await fetch(`${airApiUrl}?lat=${weatherData.lat}&lon=${weatherData.lon}`, {
        headers: airHeaders
      });
      const airQualityData = await airResponse.json();
      loadAirQualityData(airQualityData);
    } catch (error) {
      console.error(error);
    }
  }
  
  fetchData();
  


});