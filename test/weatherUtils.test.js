// weatherUtils.test.js
import * as weatherUtils from '../JS/modules/weatherUtils';
import * as weather from '../JS/modules/weatherdata';
//jest-fetch-mock for mocking fetch
const fetchMock = require('jest-fetch-mock'); 

// Setting up the fetchMock before each test
beforeEach(() => {
  fetchMock.resetMocks();
});

// Mocking navigator.geolocation.getCurrentPosition using beforeAll and afterAll hooks
const originalGeolocation = global.navigator.geolocation;
beforeAll(() => {
  global.navigator.geolocation = {
    getCurrentPosition: jest.fn((success, error) => {
      success({
        coords: { latitude: 40.7128, longitude: -74.0060 }, // Assuming a location in New York, you can adjust this as needed
      });
    }),
  };
});

afterAll(() => {
  global.navigator.geolocation = originalGeolocation;
});

// Test getCurrentLocationWeather
test('getCurrentLocationWeather should return weather data', async () => {
  // Mocking the response for the fetch call
  const mockWeatherData = {};
  jest.spyOn(global, 'fetch').mockResolvedValue({
    json: jest.fn().mockResolvedValue(mockWeatherData),
  });

  const weatherData = await weatherUtils.getCurrentLocationWeather();
  expect(weatherData).toEqual(mockWeatherData);
});

document.body.innerHTML = `
    <input type="text" id="searchInput" />
    <ul id="suggestionsList"></ul>
  `;

// Mock other global variables used in weatherUtils.js
global.tabcontent1 = document.createElement('div');
global.tabcontent2 = document.createElement('div');
global.tabcontent3 = document.createElement('div');
global.aside = document.createElement('div');

// Test getCurrentLocationWeather
test('loadWeatherData should load weather data', async () => {
  const weatherData = await weatherUtils.getCurrentLocationWeather();
  weather.loadWeatherData(weatherData);

  expect(weatherData).toBeDefined();
  expect(weather.loadWeatherData).toHaveBeenCalled();
  expect(tabcontent1.innerHTML).not.toBe('');
  expect(tabcontent2.innerHTML).not.toBe('');
});

// Test clearWeatherData
test('clearWeatherData should clear weather data elements', () => {

   // Mock the DOM elements for testing
   document.body.innerHTML = `
   <div id="tabcontent1"></div>
   <div id="tabcontent2"></div>
   <div id="tabcontent3"></div>
   <div id="aside"></div>
 `;
  weatherUtils.clearWeatherData();
  
  // Assert that the elements were cleared 
  // Check if the DOM elements are empty after calling the function
  expect(tabcontent1.innerHTML).toBe('');
  expect(tabcontent2.innerHTML).toBe('');
  expect(tabcontent3.innerHTML).toBe('');
  expect(aside.innerHTML).toBe('');
});


