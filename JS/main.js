// import {
//   createDiv,
//   createDivWithLabel,
//   createSpan,
//   getCurrentLocationWeather,
//   handleSearchInput,
//   searchWeatherData,
//   fetchData,
// } from './weatherUtils.js';

// document.addEventListener("DOMContentLoaded", function () {
  
  
const tabcontent3 = document.getElementById('tabcontent3');
const aside = document.getElementById('aside');



//Function to create div
function createDiv(className, text) {
const div = document.createElement('div');
div.className = className;
div.textContent = text;
return div;
}

//Function to create div with label
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

//Function to create span
function createSpan(className, text) {
const span = document.createElement('span');
span.className = className;
span.textContent = text;
return span;
}



//Function to load air quality data
export function loadAirQualityData(airQualityData) {
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

  //weather News

// Rapid API
const newsApiUrl = 'https://weather338.p.rapidapi.com/news/list?offset=0&limit=10';
const newsHeaders = {
'X-RapidAPI-Key': '1bb0b0932amshadc927c7f447973p1e25e2jsn0eb548483795',
'X-RapidAPI-Host': 'weather338.p.rapidapi.com'
};

//Function to get weather news
export const getNews = async () => {
const weatherNewsDiv = document.getElementById('weather-news');
const weatherNewsLabel = createDiv('heading', 'Weather News');
  aside.appendChild(weatherNewsLabel);

try {
const response = await fetch(newsApiUrl, {
  headers: newsHeaders
});

if (!response.ok) {
  throw new Error('Network response was not ok');
}

const data = await response.json();
console.log(data);

data.forEach(item => {
  const listItem = document.createElement('li');
  listItem.className = 'news';
  const link = document.createElement('a');
  link.href = `https://weather338.p.rapidapi.com/news/list${item.url}`; // Fixed the issue by using `item.url` directly
  link.textContent = item.title;

  listItem.appendChild(link);
  weatherNewsDiv.appendChild(listItem);
  aside.appendChild(weatherNewsDiv);
});

} catch (error) {
console.error('Error fetching weather news:', error);
}
}

//Function to load weekly data
export function loadWeeklyData(weatherData) {
  console.log(weatherData);
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




