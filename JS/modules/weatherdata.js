import {
  createDiv,
  createDivWithLabel,
  createSpan,
} from './weatherUtils.js';


//DOM ELEMENTS
const tabcontent1 = document.getElementById('tabcontent1');
const tabcontent2 = document.getElementById('tabcontent2');
const tabcontent3 = document.getElementById('tabcontent3');
const aside = document.getElementById('aside');

// **********************************************************************************************************************
//LOAD CURRENT, NEXT DAY, AND HOURLY WEATHER DATA
// **********************************************************************************************************************

//Function to create the header
const createHeader = (weather, forecastIndex) => {
  const header = document.createElement('header');
  header.className = 'header';
  const headerLeft = document.createElement('div');
  headerLeft.className = 'header-left container';
  const locationDetails = document.createElement('div');
  const locationDiv = createDiv('location', `${weather.location.name}, ${weather.location.region}`);
  locationDiv.className = 'location';
  const countryDiv = createDiv('country', `${weather.location.country}`);
  countryDiv.className = 'country';
  locationDetails.appendChild(locationDiv);
  locationDetails.appendChild(countryDiv);
  const forecastDate = new Date(weather.forecast.forecastday[forecastIndex].date);
  const dateDiv = createDiv('date', `${forecastDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}`);
  dateDiv.className = 'date';
  locationDetails.appendChild(dateDiv);
  const timeDiv = createDiv('time', `${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`);
  timeDiv.className = 'time';
  locationDetails.appendChild(timeDiv);
  headerLeft.appendChild(locationDetails);

  const currentIcon = weather.current.condition.icon;
  const weatherIcon = document.createElement('img');
  weatherIcon.className = 'weather-icon large';
  weatherIcon.src = `https:${currentIcon}`;
  weatherIcon.alt = 'weather-icon';
  headerLeft.appendChild(weatherIcon);

  const currentTemp = weather.current.temp_c;
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

  const infoGroupLabels = ['Max', 'Min', 'Wind', 'Precip', 'UV index', 'R-Humid'];
  const forecastDay = weather.forecast.forecastday[forecastIndex].day;

  const infoGroupData = [
    `${forecastDay.maxtemp_c}`,
    `${forecastDay.mintemp_c}`,
    `${forecastDay.maxwind_mph}`,
    `${forecastDay.totalprecip_in}`,
    `${forecastDay.uv}`,
    `${forecastDay.avghumidity}`
  ]

  const infoGroupUnits = ['\u00B0C', '\u00B0C', 'mph', 'in', '', '%rh'];

  infoGroupLabels.forEach((label) => {
    const infoGroup = document.createElement('div');
    infoGroup.className = 'info-group';
    const infoGroupLabel = createDiv('label', label);
    const infoGroupDataDiv = createDiv('info-group-data', infoGroupData[infoGroupLabels.indexOf(label)]);
    const infoGroupUnitsSpan = createSpan('info-sub', infoGroupUnits[infoGroupLabels.indexOf(label)]);
    infoGroupDataDiv.appendChild(infoGroupUnitsSpan);
    infoGroup.appendChild(infoGroupLabel);
    infoGroup.appendChild(infoGroupDataDiv);
    headerRight.appendChild(infoGroup);
  });

  header.appendChild(headerRight);
  return header;
};

//Function to create the daytime section
const createDaytimeSection = (hourlyData) => {
  const daytimeSection = document.createElement('section');
  daytimeSection.className = 'daytime-section';
  daytimeSection.dataset.daytimeSection = '';

  const daytimeCardLabels = ['Morning', 'Afternoon', 'Evening', 'Midnight'];

  daytimeCardLabels.forEach((label, index) => {
    const daytimeCard = document.createElement('div');
    daytimeCard.className = 'daytime-card';

    const icon = document.createElement('img');
    icon.src = `https:${hourlyData[index].condition.icon}`;
    icon.alt = 'weather-icon';
    daytimeCard.appendChild(icon);

    const daytimeCardHour = createDiv('daytime-card-hour', label);
    const tempDiv = createDiv('', `${hourlyData[index].temp_c}\u00B0C`);

    daytimeCard.appendChild(daytimeCardHour);
    daytimeCard.appendChild(tempDiv);
    daytimeSection.appendChild(daytimeCard);
  });

  return daytimeSection;
};

//Function to create the hour row
const createHourRow = (hourlyData, index, forecastIndex) => {
  const hourRow = document.createElement('tr');
  hourRow.className = 'hour-row';
  //alternating row colors
  if (index % 2 === 0) {
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

  const labelDiv = createDivWithLabel('label', forecastIndex === 0 ? 'Today' : 'Tomorrow', new Date(hourlyData.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }));
  infoGroup.appendChild(labelDiv);
  timeCell.appendChild(infoGroup);
  hourRow.appendChild(timeCell);

  const iconCell = document.createElement('td');
  const icon = document.createElement('img');
  icon.src = `https:${hourlyData.condition.icon}`;
  icon.alt = 'weather-icon';
  iconCell.appendChild(icon);
  hourRow.appendChild(iconCell);

  const tempCell = document.createElement('td');
  const tempDiv = createDivWithLabel('info-group', 'Temp', `${hourlyData.temp_c}\u00B0C`);
  tempCell.appendChild(tempDiv);
  hourRow.appendChild(tempCell);

  const humidityCell = document.createElement('td');
  const humidityDiv = createDivWithLabel('info-group', 'Humidity', `${hourlyData.humidity}%rh`);
  humidityCell.appendChild(humidityDiv);
  hourRow.appendChild(humidityCell);

  const windCell = document.createElement('td');
  const windDiv = createDivWithLabel('info-group', 'Wind', `${hourlyData.wind_mph}mph`);
  windCell.appendChild(windDiv);
  hourRow.appendChild(windCell);

  const precipCell = document.createElement('td');
  const precipDiv = createDivWithLabel('info-group', 'Precip', `${hourlyData.precip_in}in`);
  precipCell.appendChild(precipDiv);
  hourRow.appendChild(precipCell);

  const uvCell = document.createElement('td');
  const uvDiv = createDivWithLabel('info-group', 'UV Index', `${hourlyData.uv}`);
  uvCell.appendChild(uvDiv);
  hourRow.appendChild(uvCell);
  hourRow.appendChild(arrowCell);

  return hourRow;
};

//Function to create the details row
const createDetailsRow = (hourlyData) => {
  const detailsRow = document.createElement('tr');
  detailsRow.className = 'hour-details-row';
  detailsRow.classList.add('hidden');

  const detailsCell = document.createElement('td');
  detailsCell.colSpan = '8';

  const detailsDiv = document.createElement('div');
  detailsDiv.className = 'hour-details';

  const additionalData = [
    { label: 'Condition', value: hourlyData.condition.text },
    { label: 'Feels Like', value: `${hourlyData.feelslike_c}\u00B0C` },
    { label: 'Chance of Rain', value: `${hourlyData.chance_of_rain}%` },
    { label: 'Chance of Snow', value: `${hourlyData.chance_of_snow}%` },
    { label: 'Dewpoint', value: `${hourlyData.dewpoint_c}\u00B0C` },
    { label: 'Gust', value: `${hourlyData.gust_mph} mph` },
    { label: 'Pressure', value: `${hourlyData.pressure_in} in` },
  ];

  additionalData.forEach((data) => {
    const dataDiv = createDivWithLabel('hour-detail', data.label, data.value);
    detailsDiv.appendChild(dataDiv);
  });

  detailsCell.appendChild(detailsDiv);
  detailsRow.appendChild(detailsCell);

  return detailsRow;
};

//Function to load weather data
export const loadWeatherData = async (weather) => {
  const currentWeather = weather.current;
  const forecastToday = weather.forecast.forecastday[0];
  const forecastTomorrow = weather.forecast.forecastday[1];
  const hourlyData = forecastToday.hour;
  const hourlyDataTomorrow = forecastTomorrow.hour;

  // Tab 1 ---> Today's weather data
  // Create tab 1 header
  const header1 = createHeader(weather, 0);
  const currentWeatherAlertDiv = createDivWithLabel('weather-alert', 'Weather Alert:', `${currentWeather.condition.text}`);
  tabcontent1.appendChild(header1);
  tabcontent1.appendChild(currentWeatherAlertDiv);

  // Create tab 1 daytime section
  const daytimeSection1 = createDaytimeSection(hourlyData);
  tabcontent1.appendChild(daytimeSection1);

  // Create tab 1 hour section
  const hourSection1 = document.createElement('table');
  hourSection1.className = 'hour-section';
  const hourSectionBody1 = document.createElement('tbody');
  hourSectionBody1.dataset.hourSection = '';

  hourlyData.forEach((hourData, index) => {
    const hourRow = createHourRow(hourData, index, 0);
    const detailsRow = createDetailsRow(hourData);

    hourSectionBody1.appendChild(hourRow);
    hourSectionBody1.appendChild(detailsRow);
  });

  hourSection1.appendChild(hourSectionBody1);
  tabcontent1.appendChild(hourSection1);

  // Tab 2 ---> Tomorrow's weather data
  // Create tab 2 header
  const header2 = createHeader(weather, 1);
  const forecastWeatherAlertDiv = createDivWithLabel('weather-alert', 'Weather Alert:', `${forecastTomorrow.day.condition.text}`);
  tabcontent2.appendChild(header2);
  tabcontent2.appendChild(forecastWeatherAlertDiv);

  // Create tab 2 daytime section
  const daytimeSection2 = createDaytimeSection(hourlyDataTomorrow);
  tabcontent2.appendChild(daytimeSection2);

  // Create tab 2 hour section
  const hourSection2 = document.createElement('table');
  hourSection2.className = 'hour-section';
  const hourSectionBody2 = document.createElement('tbody');
  hourSectionBody2.dataset.hourSection2 = '';

  hourlyDataTomorrow.forEach((hourData, index) => {
    const hourRow = createHourRow(hourData, index, 1);
    const detailsRow = createDetailsRow(hourData);

    hourSectionBody2.appendChild(hourRow);
    hourSectionBody2.appendChild(detailsRow);
  });

  hourSection2.appendChild(hourSectionBody2);
  tabcontent2.appendChild(hourSection2);
};

//Function to load weekly data
export function loadWeeklyData(weatherData) {
  console.log(weatherData);
  const weeklyData = weatherData.data;
  const weekSection = document.createElement('section');
  weekSection.className = 'week-section';
  weekSection.dataset.weekSection = '';

  const locationDiv = document.createElement('div');
  locationDiv.className = 'locationtz';
  const CityDiv = createDiv('location', `${weatherData.city_name}, ${weatherData.country_code}`);
  locationDiv.appendChild(CityDiv);
  const timezoneDiv = createDivWithLabel('timezone', 'Timezone:', `${weatherData.timezone}`);
  locationDiv.appendChild(timezoneDiv);
  tabcontent3.appendChild(locationDiv);

  for (let i = 0; i < weeklyData.length; i++) {
    const weekCard = document.createElement('div');
    weekCard.className = 'week-card';

    const icon = document.createElement('img');
    icon.src = `https://www.weatherbit.io/static/img/icons/${weeklyData[i].weather.icon}.png`;
    icon.alt = 'weather-icon';
    weekCard.appendChild(icon);

    const date = new Date(weeklyData[i].datetime);
    const weekCardDay = createDiv('week-card-hour', date.toLocaleDateString('en-US', { weekday: 'long' }));
    const weekCardDate = createDiv('week-card-hour', date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    const tempDiv = createDiv('', `${weeklyData[i].temp}\u00B0C`);
    const descriptionDiv = createDiv('', weeklyData[i].weather.description);
    weekCard.appendChild(weekCardDay);
    weekCard.appendChild(weekCardDate);
    weekCard.appendChild(tempDiv);
    weekCard.appendChild(descriptionDiv);

    const infoGroupLabels = ['Feels Like:', 'Humidity:', 'Cloud:', 'Wind:', 'Pressure:', 'Dewpoint:', 'Precipitation:', 'UV:', 'Snow:'];
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
    const infoGroupUnits = ['\u00B0C', '%rh', '%', 'm/s', 'mb', '\u00B0C', '%', '', 'mm'];

    for (let j = 0; j < infoGroupLabels.length; j++) {
      const infoGroupDataDiv = document.createElement('div');
      infoGroupDataDiv.className = 'info-group-container container';
      const infoGroup = document.createElement('div');
      infoGroup.className = 'data-group';

      const infoGroupLabel = createDiv('label', infoGroupLabels[j]);
      const infoDataDiv = createDiv('info-group-data', infoGroupData[j]);
      const infoGroupUnitsSpan = createSpan('info-sub', infoGroupUnits[j]);

      infoDataDiv.appendChild(infoGroupUnitsSpan);

      infoGroup.appendChild(infoGroupLabel);
      infoGroup.appendChild(infoDataDiv);
      infoGroupDataDiv.appendChild(infoGroup);

      weekCard.appendChild(infoGroupDataDiv);
    }

    weekSection.appendChild(weekCard);
  }

  tabcontent3.appendChild(weekSection);
}

//Function to load air quality data
export function loadAirQualityData(airQualityData) {
  const airQualityDiv = document.createElement('div');
  airQualityDiv.className = 'air-quality row';
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

//Function to get weather news
export function getNews(newsData) {
  const weatherNewsDiv = document.createElement('div');
  weatherNewsDiv.className = 'weather-news row';
  const weatherNewsLabel = createDiv('heading', 'News Headlines');
  aside.appendChild(weatherNewsLabel);

  newsData.forEach(item => {
    const listItem = document.createElement('li');
    listItem.className = 'news';
    listItem.textContent = item.title;

    weatherNewsDiv.appendChild(listItem);
    aside.appendChild(weatherNewsDiv);
  });
}

