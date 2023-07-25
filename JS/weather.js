import {
  handleSearchInput,
  searchWeatherData,
  displaySuggestions,
  fetchData,
  fetchVizData
} from './modules/weatherUtils.js';

import {
  loadAirQualityData,
  loadWeatherData,
  loadWeeklyData,
  getNews
} from './modules/weatherdata.js'

import { renderHeatmap, initMap } from './modules/weatherviz.js';

document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const tabs = document.querySelectorAll('.tab')
  const tabContents = document.querySelectorAll('.tabcontent')
  const darkModeSwitch = document.querySelector('#dark-mode-switch')
  const searchInput = document.getElementById('search-input');
  const suggestionsList = document.getElementById('suggestions');
  const searchButton = document.getElementById('search-button');

  //****************************************************************************************************
  // ACTIVATE TAB FUNCTION
  //****************************************************************************************************
  const activateTab = tabnum => {
    tabs.forEach(tab => {
      tab.classList.remove('active')
    });

    tabContents.forEach(tabContent => {
      tabContent.classList.remove('active')
    });

    document.querySelector('#tab' + tabnum).classList.add('active')
    document.querySelector('#tabcontent' + tabnum).classList.add('active')
    localStorage.setItem('jstabs-opentab', JSON.stringify(tabnum))

  };

  // Event Listeners
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      activateTab(tab.dataset.tab)
    });
  });

  //**********************************************************************************************************
  // DARK MODE SWITCH
  //**********************************************************************************************************

  darkModeSwitch.addEventListener('change', () => {
    document.querySelector('body').classList.toggle('darkmode')
    localStorage.setItem('jstabs-darkmode', JSON.stringify(!darkmode))
  });

  // Retrieve stored data
  let darkmode = JSON.parse(localStorage.getItem('jstabs-darkmode'))
  const opentab = JSON.parse(localStorage.getItem('jstabs-opentab')) || '3'

  if (darkmode === null) {
    darkmode = window.matchMedia("(prefers-color-scheme: dark)").matches // match to OS theme
  }
  if (darkmode) {
    document.querySelector('body').classList.add('darkmode')
    document.querySelector('#dark-mode-switch').checked = 'checked'
  }
  activateTab(opentab)


  //Handle search input
  searchInput.addEventListener('input', () => {
    handleSearchInput(searchInput, suggestionsList, displaySuggestions);
  });

  //Search weather data
  searchButton.addEventListener('click', () => {
    searchWeatherData(searchInput);
  });

  //Fetch and Load Weather Data
  fetchData(loadWeatherData, loadAirQualityData, loadWeeklyData, getNews);

  //Fetch and Visualize Weather Data
  fetchVizData(renderHeatmap, initMap);
});