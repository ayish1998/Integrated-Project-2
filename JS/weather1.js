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
    const forecast = weatherData.forecast.forecastday[0];
    const hourlyData = weatherData.forecast.forecastday[0].hour;

    console.log(hourlyData);

    const {
      temp_c: currentTemp,
      feelslike_c: currentFeelsLike,
      gust_mph: currentGust,
      wind_mph: currentWindSpeed,
      precip_mm: currentPrecip,
      uv: currentUV,
      humidity: currentHumidity,
      condition: { icon: currentIcon },
    } = currentWeather;

    // Create the necessary div and table elements
    const tabcontent1 = document.getElementById('tabcontent1');

    // Create header elements
    const header = document.createElement('header');
    header.className = 'header d-flex align-items-center';

    const headerLeft = document.createElement('div');
    headerLeft.className = 'header-left d-flex align-items-center justify-content-center';

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

    const headerRight = document.createElement('div');
    headerRight.className = 'header-right';

    const infoGroupLabels = ['High', 'Low', 'Wind', 'Precip', 'UV index', 'R-Humid'];
    const infoGroupData = [
      `${forecast.day.maxtemp_c}`,
      `${forecast.day.mintemp_c}`,
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

    // Create daytime section
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

      const labelDiv = createDivWithLabel('label', 'Today', hourlyData[i].time.slice(11, 16));
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

      console.log(additionalData);
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
