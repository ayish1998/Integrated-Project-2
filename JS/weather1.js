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

  // Rapid API
  const apiUrl = 'https://weatherapi-com.p.rapidapi.com/forecast.json';
  const headers = {
    'X-RapidAPI-Key': '1bb0b0932amshadc927c7f447973p1e25e2jsn0eb548483795',
    'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
  };

  const getCurrentLocationWeather = async () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          try {
            const response = await fetch(`${apiUrl}?q=${latitude},${longitude}&days=2`, {
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
  };

  const searchInput = document.getElementById('search-input');
  const suggestionsList = document.getElementById('suggestions');
  const searchButton = document.getElementById('search-button');

  searchInput.addEventListener('input', async () => {
    const searchQuery = searchInput.value.trim();

    // Clear previous suggestions
    suggestionsList.innerHTML = '';

    if (searchQuery.length > 0) {
      try {
        const response = await fetch(`https://weatherapi-com.p.rapidapi.com/search.json?q=${searchQuery}`, {
          headers: {
            'X-RapidAPI-Key': '1bb0b0932amshadc927c7f447973p1e25e2jsn0eb548483795',
            'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
          }
        });
        const data = await response.json();

        // Parse suggestions from the response
        const suggestions = data.map(item => `${item.name}, ${item.country}`);

        // Display suggestions in the suggestion list
        suggestions.forEach((suggestion, index) => {
          const listItem = document.createElement('li');
          listItem.className = 'suggestion';
          const link = document.createElement('a');
          link.href = '#';
          link.textContent = suggestion;
          link.addEventListener('click', (e) => {
            e.preventDefault();
            const clickedItem = data[index]; // Get the clicked item from the data array
            const lat = clickedItem.lat;
            const lon = clickedItem.lon;
            searchInput.value = `${clickedItem.name}`;
            searchWeatherData(lat, lon);
            suggestionsList.innerHTML = ''; // Clear suggestion list after selecting an item
          });
          listItem.appendChild(link);
          suggestionsList.appendChild(listItem);
        });

      } catch (error) {
        console.log('Error fetching suggestions:', error);
      }
    }
  });

  // Attach event listener to search button
  searchButton.addEventListener('click', searchWeatherData);

  // Search function
  async function searchWeatherData(latitude, longitude) {
    const searchValue = searchInput.value;

    try {
      // Fetch city data
      const cityResponse = await fetch(`https://weatherapi-com.p.rapidapi.com/search.json?q=${searchValue}`, {
        headers: headers
      });
      const cityData = await cityResponse.json();

      // Get lat and lon of the searched city
      const { lat, lon } = cityData[0];

      // Fetch weather data for the searched city
      const weatherResponse = await fetch(`${apiUrl}?q=${lat},${lon}&days=2`, {
        headers: headers
      });
      const weatherData = await weatherResponse.json();

      // Clear existing weather data and load new weather data
      clearWeatherData();
      loadWeatherData(weatherData);
    } catch (error) {
      console.log('An error occurred while fetching the data:', error);
    }
  }

  // Function to clear existing weather data
  function clearWeatherData() {
    const tabcontent1 = document.getElementById('tabcontent1');
    tabcontent1.innerHTML = '';
    const tabcontent2 = document.getElementById('tabcontent2');
    tabcontent2.innerHTML = '';
  }


  const createDiv = (className, text) => {
    const div = document.createElement('div');
    div.className = className;
    div.textContent = text;
    return div;
  };

  const createDivWithLabel = (className, label, text) => {
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
  };

  const createSpan = (className, text) => {
    const span = document.createElement('span');
    span.className = className;
    span.textContent = text;
    return span;
  };

  const loadWeatherData = (weatherData) => {
    const currentWeather = weatherData.current;
    const forecastToday = weatherData.forecast.forecastday[0];
    const forecastTomorrow = weatherData.forecast.forecastday[1];
    const hourlyData = forecastToday.hour;
    const hourlyDataTomorrow = forecastTomorrow.hour;

    const {
      temp_c: currentTemp,
      wind_mph: currentWindSpeed,
      precip_in: currentPrecip,
      uv: currentUV,
      humidity: currentHumidity,
      condition: { icon: currentIcon },
    } = currentWeather;

    // Tab 1 header
    const tabcontent1 = document.getElementById('tabcontent1');

    // Tab1 header-left elements
    const header = document.createElement('header');
    header.className = 'header';
    const headerLeft = document.createElement('div');
    headerLeft.className = 'header-left';
    const locationDetails = document.createElement('div');
    const locationDiv = createDiv('location', `${weatherData.location.name}, ${weatherData.location.region}`);
    locationDiv.className = 'location';
    const countryDiv = createDiv('country', `${weatherData.location.country}`);
    countryDiv.className = 'country';
    locationDiv.appendChild(countryDiv);
    locationDetails.appendChild(locationDiv);
    const forecastDate = new Date(forecastToday.date);
    const dateDiv = createDiv('date', `${forecastDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}`);
    dateDiv.className = 'date';
    locationDetails.appendChild(dateDiv);
    const timeDiv = createDiv('time', `${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`);
    timeDiv.className = 'time';
    locationDetails.appendChild(timeDiv);
    headerLeft.appendChild(locationDetails);

    const weatherIcon = document.createElement('img');
    weatherIcon.className = 'weather-icon large';
    weatherIcon.src = `https:${currentIcon}`;
    weatherIcon.alt = 'weather-icon';
    headerLeft.appendChild(weatherIcon);

    const currentTempDiv = document.createElement('div');
    currentTempDiv.className = 'current-temp';

    const currentTempSpan = createSpan('current-temp', `${currentTemp}`);
    const degreeSymbol = document.createTextNode('\u00B0C');
    currentTempDiv.appendChild(currentTempSpan);
    currentTempDiv.appendChild(degreeSymbol);

    headerLeft.appendChild(currentTempDiv);
    header.appendChild(headerLeft);

    // Tab1 header-right elements
    const headerRight = document.createElement('div');
    headerRight.className = 'header-right';

    const infoGroupLabels = ['Max', 'Min', 'Wind', 'Precip', 'UV index', 'R-Humid'];
    const infoGroupData = [
      `${forecastToday.day.maxtemp_c}`,
      `${forecastToday.day.mintemp_c}`,
      `${currentWindSpeed}`,
      `${currentPrecip}`,
      `${currentUV}`,
      `${currentHumidity}`,
    ];
    const infoGroupUnits = ['\u00B0C', '\u00B0C', 'mph', 'in', '', 'h'];

    for (let i = 0; i < infoGroupLabels.length; i++) {
      const infoGroup = document.createElement('div');
      const infoGroupDataDiv = document.createElement('div');
      infoGroup.className = 'info-group';

      const infoGroupLabel = createDiv('label', infoGroupLabels[i]);
      const infoGroupDataSpan = createSpan('info-group-data', infoGroupData[i]);
      const infoGroupUnitsSpan = createSpan('info-sub', infoGroupUnits[i]);

      infoGroupDataDiv.appendChild(infoGroupDataSpan);
      infoGroupDataDiv.appendChild(infoGroupUnitsSpan);

      infoGroup.appendChild(infoGroupLabel);
      infoGroup.appendChild(infoGroupDataDiv);

      headerRight.appendChild(infoGroup);
    }

    header.appendChild(headerRight);
    tabcontent1.appendChild(header);

    
    // Tab2 content elements
    const forecastTemp = forecastTomorrow.day.avgtemp_c;
    const forecastMaxTemp = forecastTomorrow.day.maxtemp_c;
    const forecastMinTemp = forecastTomorrow.day.mintemp_c;
    const forecastWind = forecastTomorrow.day.maxwind_mph;
    const forecastPrecip = forecastTomorrow.day.totalprecip_in;
    const forecastUV = forecastTomorrow.day.uv;
    const forecastHumidity = forecastTomorrow.day.avghumidity;
    const forecastIcon = forecastTomorrow.day.condition.icon;
    // Tab2 header
    const tabcontent2 = document.getElementById('tabcontent2');
    //Tab2 header-left elements
    const header2 = document.createElement('header');
    header2.className = 'header';
    const headerLeft2 = document.createElement('div');
    headerLeft2.className = 'header-left';
    const locationDetails2 = document.createElement('div');
    const locationDiv2 = createDiv('location', `${weatherData.location.name}, ${weatherData.location.region}`);
    locationDiv2.className = 'location';
    const countryDiv2 = createDiv('country', `${weatherData.location.country}`);
    countryDiv2.className = 'country';
    locationDiv2.appendChild(countryDiv2);
    locationDetails2.appendChild(locationDiv2);
    const forecastDate2 = new Date(forecastTomorrow.date);
    const dateDiv2 = createDiv('date', `${forecastDate2.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}`);
    dateDiv2.className = 'date';
    locationDetails2.appendChild(dateDiv2);
    const timeDiv2 = createDiv('time', `${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`);
    timeDiv2.className = 'time';
    locationDetails2.appendChild(timeDiv2);
    headerLeft2.appendChild(locationDetails2);

    const weatherIcon2 = document.createElement('img');
    weatherIcon2.className = 'weather-icon large';
    weatherIcon2.src = `https:${forecastIcon}`;
    weatherIcon2.alt = 'weather-icon';
    headerLeft2.appendChild(weatherIcon2);

    const forecastTempDiv = document.createElement('div');
    forecastTempDiv.className = 'forecast-temp';

    const forecastTempSpan = createSpan('forecast-temp', `${forecastTemp}`);
    const symbol = document.createTextNode('\u00B0C');
    forecastTempDiv.appendChild(forecastTempSpan);
    forecastTempDiv.appendChild(symbol);

    headerLeft2.appendChild(forecastTempDiv);
    header2.appendChild(headerLeft2);

    // Tab2 header-right elements
    const headerRight2 = document.createElement('div');
    headerRight2.className = 'header-right';

    const infoGroupData2 = [
      `${forecastMaxTemp}`,
      `${forecastMinTemp}`,
      `${forecastWind}`,
      `${forecastPrecip}`,
      `${forecastUV}`,
      `${forecastHumidity}`,
      `${forecastIcon}`,
    ];

    for (let i = 0; i < infoGroupLabels.length; i++) {
      const infoGroup2 = document.createElement('div');
      const infoGroupDataDiv2 = document.createElement('div');
      infoGroup2.className = 'info-group';

      const infoGroupLabel = createDiv('label', infoGroupLabels[i]);
      const infoGroupDataSpan2 = createSpan('info-group-data', infoGroupData2[i]);
      const infoGroupUnitsSpan = createSpan('info-sub', infoGroupUnits[i]);

      infoGroupDataDiv2.appendChild(infoGroupDataSpan2);
      infoGroupDataDiv2.appendChild(infoGroupUnitsSpan);

      infoGroup2.appendChild(infoGroupLabel);
      infoGroup2.appendChild(infoGroupDataDiv2);

      headerRight2.appendChild(infoGroup2);
    }

    header2.appendChild(headerRight2);
    tabcontent2.appendChild(header2);


    // Create current daytime section
    const daytimeSection = document.createElement('section');
    daytimeSection.className = 'daytime-section';
    daytimeSection.dataset.daytimeSection = '';

    const daytimeCardLabels = ['Morning', 'Afternoon', 'Evening', 'Midnight'];

    for (let i = 0; i < daytimeCardLabels.length; i++) {
      const daytimeCard = document.createElement('div');
      daytimeCard.className = 'daytime-card';

      const icon = document.createElement('img');
      icon.src = `https:${hourlyData[i].condition.icon}`;
      icon.alt = 'weather-icon';
      daytimeCard.appendChild(icon);

      const daytimeCardHour = createDiv('daytime-card-hour', daytimeCardLabels[i]);
      const tempDiv = createDiv('', `${hourlyData[i].temp_c}\u00B0C`);

      daytimeCard.appendChild(daytimeCardHour);
      daytimeCard.appendChild(tempDiv);
      daytimeSection.appendChild(daytimeCard);
    }

    tabcontent1.appendChild(daytimeSection);

    // Create tomorrow daytime section
    const daytimeSection2 = document.createElement('section');
    daytimeSection2.className = 'daytime-section';
    daytimeSection2.dataset.daytimeSection = '';

    for (let i = 0; i < daytimeCardLabels.length; i++) {
      const daytimeCard2 = document.createElement('div');
      daytimeCard2.className = 'daytime-card';

      const icon2 = document.createElement('img');
      icon2.src = `https:${hourlyDataTomorrow[i].condition.icon}`;
      icon2.alt = 'weather-icon';
      daytimeCard2.appendChild(icon2);

      const daytimeCardHour2 = createDiv('daytime-card-hour', daytimeCardLabels[i]);
      const tempDiv = createDiv('', `${hourlyDataTomorrow[i].temp_c}\u00B0C`);

      daytimeCard2.appendChild(daytimeCardHour2);
      daytimeCard2.appendChild(tempDiv);
      daytimeSection2.appendChild(daytimeCard2);
    }

    tabcontent2.appendChild(daytimeSection2);

    // Create hour section
    const hourSection = document.createElement('table');
    hourSection.className = 'hour-section';
    const hourSectionBody = document.createElement('tbody');
    hourSectionBody.dataset.hourSection = '';

    for (let i = 0; i < hourlyData.length; i++) {
      const hourRow = document.createElement('tr');
      hourRow.className = 'hour-row';
      //alternating row colors
      if (i % 2 === 0) {
        hourRow.style.backgroundColor = '#198754';
      } else {
        hourRow.style.backgroundColor = '#6adaa5';
      }

      const arrowCell = document.createElement('td');
      const arrowIcon = document.createElement('i');
      arrowIcon.className = 'fas fa-chevron-down';
      arrowCell.appendChild(arrowIcon);

      const handleClick = () => {
        const detailsRow = hourRow.nextElementSibling;
        detailsRow.classList.toggle('show');
      };

      const timeCell = document.createElement('td');
      const infoGroup = document.createElement('div');
      infoGroup.className = 'info-group';
      hourRow.addEventListener('click', handleClick);

      const labelDiv = createDivWithLabel('label', 'Today', new Date(hourlyData[i].time).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }));
      infoGroup.appendChild(labelDiv);
      timeCell.appendChild(infoGroup);
      hourRow.appendChild(timeCell);

      const iconCell = document.createElement('td');
      const icon = document.createElement('img');
      icon.src = `https:${hourlyData[i].condition.icon}`;
      icon.alt = 'weather-icon';
      iconCell.appendChild(icon);
      hourRow.appendChild(iconCell);

      const tempCell = document.createElement('td');
      const tempDiv = createDivWithLabel('info-group', 'Temp', `${hourlyData[i].temp_c}\u00B0C`);
      tempCell.appendChild(tempDiv);
      hourRow.appendChild(tempCell);

      const humidityCell = document.createElement('td');
      const humidityDiv = createDivWithLabel('info-group', 'Humidity', `${hourlyData[i].humidity}in`);
      humidityCell.appendChild(humidityDiv);
      hourRow.appendChild(humidityCell);

      const windCell = document.createElement('td');
      const windDiv = createDivWithLabel('info-group', 'Wind', `${hourlyData[i].wind_mph}mph`);
      windCell.appendChild(windDiv);
      hourRow.appendChild(windCell);

      const precipCell = document.createElement('td');
      const precipDiv = createDivWithLabel('info-group', 'Precip', `${hourlyData[i].precip_in}in`);
      precipCell.appendChild(precipDiv);
      hourRow.appendChild(precipCell);

      const uvCell = document.createElement('td');
      const uvDiv = createDivWithLabel('info-group', 'UV Index', `${hourlyData[i].uv}`);
      uvCell.appendChild(uvDiv);
      hourRow.appendChild(uvCell);
      hourRow.appendChild(arrowCell);
      hourSectionBody.appendChild(hourRow);

      const detailsRow = document.createElement('tr');
      detailsRow.className = 'hour-details-row';
      detailsRow.classList.add('hidden');

      const detailsCell = document.createElement('td');
      detailsCell.colSpan = '7';

      const detailsDiv = document.createElement('div');
      detailsDiv.className = 'hour-details';

      // Create the additional weather data for the details row
      const additionalData = [
        { label: 'Condition', value: hourlyData[i].condition.text },
        { label: 'Feels Like', value: `${hourlyData[i].feelslike_c}\u00B0C` },
        { label: 'Chance of Rain', value: `${hourlyData[i].chance_of_rain}%` },
        { label: 'Chance of Snow', value: `${hourlyData[i].chance_of_snow}%` },
        { label: 'Dewpoint', value: `${hourlyData[i].dewpoint_c}\u00B0C` },
        { label: 'Gust', value: `${hourlyData[i].gust_mph} mph` },
        { label: 'Pressure', value: `${hourlyData[i].pressure_in} in` },
      ];

      additionalData.forEach((data) => {
        const dataDiv = createDivWithLabel('hour-detail', data.label, data.value);
        detailsDiv.appendChild(dataDiv);
      });
      detailsCell.appendChild(detailsDiv);
      detailsRow.appendChild(detailsCell);
      hourSectionBody.appendChild(detailsRow);

    }

    hourSection.appendChild(hourSectionBody);
    tabcontent1.appendChild(hourSection);

    // Create tomorrow hour section
    const hourSection2 = document.createElement('table');
    hourSection2.className = 'hour-section';
    const hourSectionBody2 = document.createElement('tbody');
    hourSectionBody2.dataset.hourSection2 = '';

    for (let i = 0; i < hourlyDataTomorrow.length; i++) {
      const hourRow2 = document.createElement('tr');
      hourRow2.className = 'hour-row';
      //alternating row colors
      if (i % 2 === 0) {
        hourRow2.style.backgroundColor = '#198754';
      } else {
        hourRow2.style.backgroundColor = '#6adaa5';
      }

      const arrowCell2 = document.createElement('td');
      const arrowIcon2 = document.createElement('i');
      arrowIcon2.className = 'fas fa-chevron-down';
      arrowCell2.appendChild(arrowIcon2);

      const handleClick = () => {
        const detailsRow2 = hourRow2.nextElementSibling;
        detailsRow2.classList.toggle('show');
      };

      const timeCell2 = document.createElement('td');
      const infoGroup2 = document.createElement('div');
      infoGroup2.className = 'info-group';
      hourRow2.addEventListener('click', handleClick);

      const labelDiv2 = createDivWithLabel('label', 'Tomorrow', new Date(hourlyDataTomorrow[i].time).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }));
      infoGroup2.appendChild(labelDiv2);
      timeCell2.appendChild(infoGroup2);
      hourRow2.appendChild(timeCell2);

      const iconCell2 = document.createElement('td');
      const icon2 = document.createElement('img');
      icon2.src = `https:${hourlyDataTomorrow[i].condition.icon}`;
      icon2.alt = 'weather-icon';
      iconCell2.appendChild(icon2);
      hourRow2.appendChild(iconCell2);

      const tempCell2 = document.createElement('td');
      const tempDiv2 = createDivWithLabel('info-group', 'Temp', `${hourlyDataTomorrow[i].temp_c}\u00B0C`);
      tempCell2.appendChild(tempDiv2);
      hourRow2.appendChild(tempCell2);

      const humidityCell2 = document.createElement('td');
      const humidityDiv2 = createDivWithLabel('info-group', 'Humidity', `${hourlyDataTomorrow[i].humidity}%rh`);
      humidityCell2.appendChild(humidityDiv2);
      hourRow2.appendChild(humidityCell2);

      const windCell2 = document.createElement('td');
      const windDiv2 = createDivWithLabel('info-group', 'Wind', `${hourlyDataTomorrow[i].wind_mph}mph`);
      windCell2.appendChild(windDiv2);
      hourRow2.appendChild(windCell2);

      const precipCell2 = document.createElement('td');
      const precipDiv2 = createDivWithLabel('info-group', 'Precip', `${hourlyDataTomorrow[i].precip_in}in`);
      precipCell2.appendChild(precipDiv2);
      hourRow2.appendChild(precipCell2);

      const uvCell2 = document.createElement('td');
      const uvDiv2 = createDivWithLabel('info-group', 'UV Index', `${hourlyDataTomorrow[i].uv}`);
      uvCell2.appendChild(uvDiv2);
      hourRow2.appendChild(uvCell2);
      hourRow2.appendChild(arrowCell2);
      hourSectionBody2.appendChild(hourRow2);

      const detailsRow2 = document.createElement('tr');
      detailsRow2.className = 'hour-details-row';
      detailsRow2.classList.add('hidden');

      const detailsCell2 = document.createElement('td');
      detailsCell2.colSpan = '7';

      const detailsDiv2 = document.createElement('div');
      detailsDiv2.className = 'hour-details';

      // Create the additional weather data for the details row
      const additionalData = [
        { label: 'Condition', value: hourlyDataTomorrow[i].condition.text },
        { label: 'Feels Like', value: `${hourlyDataTomorrow[i].feelslike_c}\u00B0C` },
        { label: 'Chance of Rain', value: `${hourlyDataTomorrow[i].chance_of_rain}%` },
        { label: 'Chance of Snow', value: `${hourlyDataTomorrow[i].chance_of_snow}%` },
        { label: 'Dewpoint', value: `${hourlyDataTomorrow[i].dewpoint_c}\u00B0C` },
        { label: 'Gust', value: `${hourlyDataTomorrow[i].gust_mph} mph` },
        { label: 'Pressure', value: `${hourlyDataTomorrow[i].pressure_in} in` },
      ];

      additionalData.forEach((data) => {
        const dataDiv2 = createDivWithLabel('hour-detail', data.label, data.value);
        detailsDiv2.appendChild(dataDiv2);
      });
      detailsCell2.appendChild(detailsDiv2);
      detailsRow2.appendChild(detailsCell2);
      hourSectionBody2.appendChild(detailsRow2);

    }

    hourSection2.appendChild(hourSectionBody2);
    tabcontent2.appendChild(hourSection2);
  };

  const fetchData = async () => {
    try {
      const weatherData = await getCurrentLocationWeather();
      loadWeatherData(weatherData);
    } catch (error) {
      console.error(error);
    }
  };

  fetchData();


})
