// // Initialize the map
// function initMap() {
//     const map = L.map('map').setView([0, 0], 2);
  
//     // Add a tile layer (you can choose different map styles)
//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  
//     // Fetch weather data from OpenWeatherMap API (Replace 'YOUR_API_KEY' with your actual API key)
//     const API_KEY = '016f93dbec5b02a9dc90028632589b08';
//     const API_URL = `https://api.openweathermap.org/data/2.5/box/city?bbox=-180,-90,180,90,2&appid=${API_KEY}`;
  
//     fetch(API_URL)
//       .then(response => response.json())
//       .then(data => {
//         // Process weather data and add markers to the map
//         processWeatherData(data, map);
//       })
//       .catch(error => {
//         console.error('Error fetching weather data:', error);
//       });
//   }
  
//   // Process weather data and add markers to the map
//   function processWeatherData(data, map) {
//     if (data && data.list) {
//       data.list.forEach(city => {
//         const { coord, main, weather } = city;
//         const { lat, lon } = coord;
//         const temperature = main.temp - 273.15; // Convert temperature from Kelvin to Celsius
//         const description = weather[0].description;
  
//         // Create a marker for each city
//         const marker = L.marker([lat, lon]).addTo(map);
  
//         // Add pop-up with weather information when the marker is clicked
//         marker.bindPopup(
//           `Temperature: ${temperature.toFixed(2)} °C<br> Description: ${description}`
//         );
//       });
//     }
//   }
  
//   // Load the map when the document is ready
//   document.addEventListener('DOMContentLoaded', initMap);

  // Initialize the map and add event listeners for zooming and clicking
document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map').setView([0, 0], 2); // Using Leaflet.js for the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  
    // Function to fetch weather data from the OpenWeatherMap API
    async function fetchWeatherDataForLocation(location) {
      const apiKey = 'df918deb135cc4c83828b9026095bfc1';
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;
  
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Weather data not available.');
        }
        const data = await response.json();
        return data;
      } catch (error) {
        throw new Error('Error fetching weather data: ' + error.message);
      }
    }
  
    // Function to handle click event on map markers
    function onMapClick(e) {
      const { lat, lng } = e.latlng;
  
      // Fetch weather data for the clicked location
      fetchWeatherDataForLocation(`${lat},${lng}`)
        .then(weatherData => {
          // Display weather information in a popup
          const locationName = weatherData.name;
          const temperature = weatherData.main.temp;
          const description = weatherData.weather[0].description;
          const iconURL = `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
  
          const popupContent = `
            <strong>${locationName}</strong><br>
            Temperature: ${temperature}°C<br>
            Description: ${description}<br>
            <img src="${iconURL}" alt="${description}">
          `;
  
          L.popup().setLatLng([lat, lng]).setContent(popupContent).openOn(map);
        })
        .catch(error => {
          alert(error.message);
        });
    }
  
    // Add the click event listener to the map
    map.on('click', onMapClick);
  });
  
  