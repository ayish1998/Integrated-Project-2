
//   // Initialize the map and add event listeners for zooming and clicking
//   document.addEventListener('DOMContentLoaded', () => {
//     const mapOptions = {
//       center: { lat: 0, lng: 0 },
//       zoom: 2,
//     };


//     const map = new google.maps.Map(document.getElementById('map'), mapOptions);

//     // Function to fetch weather data from the OpenWeatherMap API
//     async function fetchWeatherDataForLocation(lat, lng) {
//       const apiKey = '016f93dbec5b02a9dc90028632589b08'; // Replace this with your actual API key
//       const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`;

//       try {
//         const response = await fetch(url);
//         if (!response.ok) {
//           throw new Error('Weather data not available.');
//         }
//         const data = await response.json();
//         return data;
//       } catch (error) {
//         throw new Error('Error fetching weather data: ' + error.message);
//       }
//     }

//     // Function to create color-coded overlays for temperature
// function createTemperatureOverlay(map, lat, lng, temperature) {
//   const temperatureValue = parseFloat(temperature);
//   let color = '#00ff00'; // Default color (green)

//   if (temperatureValue >= 25) {
//     color = '#ff0000'; // Hot temperatures (red)
//   } else if (temperatureValue >= 15) {
//     color = '#ffa500'; // Warm temperatures (orange)
//   } else if (temperatureValue >= 5) {
//     color = '#ffff00'; // Mild temperatures (yellow)
//   } else if (temperatureValue >= -5) {
//     color = '#00ffff'; // Cool temperatures (cyan)
//   } // Add more color codes as per your preference

//   const temperatureCircle = new google.maps.Circle({
//     center: { lat: lat, lng: lng },
//     radius: 50000, // Adjust the radius as per your preference
//     strokeColor: color,
//     strokeOpacity: 0.8,
//     strokeWeight: 2,
//     fillColor: color,
//     fillOpacity: 0.35,
//     map: map,
//   });

//   // You can add an event listener to the circle to display a tooltip or info window with temperature information
// }

// // Function to create a wind direction arrow marker
// function createWindDirectionArrow(map, lat, lng, windDirection) {
//   const arrowIcon = {
//     path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
//     scale: 5,
//     rotation: parseFloat(windDirection),
//     fillColor: '#0000ff', // Blue color for the arrow
//     fillOpacity: 1,
//     strokeWeight: 0,
//   };

//   const windArrowMarker = new google.maps.Marker({
//     position: { lat: lat, lng: lng },
//     icon: arrowIcon,
//     map: map,
//   });

//   // You can add an event listener to the marker to display a tooltip or info window with wind direction information
// }


//     // Function to handle click event on map markers
//     function onMapClick(e) {
//       const { lat, lng } = e.latLng;

//       // Fetch weather data for the clicked location
//       fetchWeatherDataForLocation(lat(), lng())
//         .then(weatherData => {
//           // Display weather information in a popup
//           const locationName = weatherData.name;
//           const temperature = weatherData.main.temp;
//           const description = weatherData.weather[0].description;
//           const iconURL = `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;

//           const popupContent = `
//             <strong>${locationName}</strong><br>
//             Temperature: ${temperature}°C<br>
//             Description: ${description}<br>
//             <img src="${iconURL}" alt="${description}">
//           `;

//           const infowindow = new google.maps.InfoWindow({
//             content: popupContent,
//           });

//           infowindow.setPosition({ lat: lat(), lng: lng() });
//           infowindow.open(map);
//           // Create temperature overlay
//       createTemperatureOverlay(map, lat(), lng(), weatherData.main.temp);

//       // Create wind direction arrow
//       createWindDirectionArrow(map, lat(), lng(), weatherData.wind.deg);
//         })
//         .catch(error => {
//           alert(error.message);
//         });
//     }

//     // Add the click event listener to the map
//     map.addListener('click', onMapClick);
//   });


// Initialize the map and add event listeners for zooming and clicking
  function initMap() {
  const mapOptions = {
    center: { lat: 0, lng: 0 },
    zoom: 2,
  };

  const map = new google.maps.Map(document.getElementById('map'), mapOptions);

  // Function to fetch weather data from the OpenWeatherMap API
  async function fetchWeatherDataForLocation(lat, lng) {
    const apiKey = '016f93dbec5b02a9dc90028632589b08'; // Replace this with your actual API key
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`;

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

  // Function to map temperature values to colors
  function getTemperatureColor(temperature) {
    if (temperature >= 25) {
      return '#FF0000'; // Red
    } else if (temperature >= 15) {
      return '#FFA500'; // Orange
    } else if (temperature >= 5) {
      return '#FFFF00'; // Yellow
    } else if (temperature >= -5) {
      return '#00FFFF'; // Cyan
    } else {
      return '#00FF00'; // Green
    }
  }

  // // Function to create color-coded overlays for temperature
  // function createTemperatureOverlay(map, lat, lng, temperature) {
  //   const temperatureValue = parseFloat(temperature);
  //   const color = getTemperatureColor(temperatureValue);

  //   const temperatureCircle = new google.maps.Circle({
  //     center: { lat: lat, lng: lng },
  //     radius: 50000, // Adjust the radius as per your preference
  //     strokeColor: color,
  //     strokeOpacity: 0.8,
  //     strokeWeight: 2,
  //     fillColor: color,
  //     fillOpacity: 0.35,
  //     map: map,
  //   });
  // }

  // Function to create a wind direction arrow marker
  function createWindDirectionArrow(map, lat, lng, windDirection) {
    const arrowIcon = {
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      scale: 5,
      rotation: parseFloat(windDirection),
      fillColor: '#0000ff', // Blue color for the arrow
      fillOpacity: 1,
      strokeWeight: 0,
    };

    const windArrowMarker = new google.maps.Marker({
      position: { lat: lat, lng: lng },
      icon: arrowIcon,
      map: map,
    });

    // You can add an event listener to the marker to display a tooltip or info window with wind direction information
  }

  // Define the number of rows and columns in the grid
  const numberOfRows = 10;
  const numberOfColumns = 10;
  const latIncrement = 180 / numberOfRows;
  const lngIncrement = 360 / numberOfColumns;

  async function createTemperatureHeatmapData() {
    const heatmapData = [];
    const promises = [];
  
    for (let row = 0; row < numberOfRows; row++) {
      for (let col = 0; col < numberOfColumns; col++) {
        const lat = -90 + row * latIncrement + latIncrement / 2;
        const lng = -180 + col * lngIncrement + lngIncrement / 2;
  
        // Fetch weather data for each cell and store the promise
        const promise = fetchWeatherDataForLocation(lat, lng)
          .then((weatherData) => {
            const temperatureValue = parseFloat(weatherData.main.temp);
            const color = getTemperatureColor(temperatureValue);
  
            if (!isNaN(lat) && !isNaN(lng)) {
              // Add data point to heatmap array
            heatmapData.push({
              location: new google.maps.LatLng(lat, lng),
              weight: 1, // You can adjust the weight based on the intensity of the parameter
              gradient: { colors: [color] },
            });
          }
          })
          .catch((error) => {
            console.error(error);
          });
  
        promises.push(promise);
      }
    }
  
    // Wait for all promises to resolve before returning the heatmap data
    await Promise.all(promises);
  
    return heatmapData;
  }
  
  function createTemperatureHeatmap() {
    createTemperatureHeatmapData().then((heatmapData) => {
      if (google.maps.visualization && google.maps.visualization.HeatmapLayer) {
        // Convert the heatmap data to a google.maps.MVCArray
        const mvcArray = new google.maps.MVCArray(heatmapData.map((data) => data.location));
  
        const heatmap = new google.maps.visualization.HeatmapLayer({
          data: mvcArray,
          radius: 50, // Adjust the radius as per your preference
          dissipating: true,
          map: map,
        });
  
        return heatmap;
      } else {
        console.error('HeatmapLayer not available. Please make sure the heatmap.js library is loaded.');
        return null;
      }
    });
  }

  async function createTemperatureChoropleth() {
    const temperatureData = await createTemperatureChoroplethData();
    const colorScale = d3.scaleSequential(d3.interpolateViridis).domain(d3.extent(temperatureData, (d) => d.temperature));
  
    for (const dataPoint of temperatureData) {
      const lat = dataPoint.lat;
      const lng = dataPoint.lng;
      const temperature = dataPoint.temperature;
      const color = d3.rgb(colorScale(temperature));
  
      const polygon = new google.maps.Polygon({
        paths: [
          { lat: lat - latIncrement / 2, lng: lng - lngIncrement / 2 },
          { lat: lat - latIncrement / 2, lng: lng + lngIncrement / 2 },
          { lat: lat + latIncrement / 2, lng: lng + lngIncrement / 2 },
          { lat: lat + latIncrement / 2, lng: lng - lngIncrement / 2 },
        ],
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.6,
        map: map,
      });
  
      // You can add an event listener to the polygon to display a tooltip or info window with temperature information
      google.maps.event.addListener(polygon, 'click', (event) => {
        const temperature = dataPoint.temperature;
        const infowindow = new google.maps.InfoWindow({
          content: `Temperature: ${temperature}°C`,
        });
        infowindow.setPosition(event.latLng);
        infowindow.open(map);
      });
    }
  }

  async function createTemperatureChoroplethData() {
    const temperatureData = [];
    const promises = [];
  
    for (let row = 0; row < numberOfRows; row++) {
      for (let col = 0; col < numberOfColumns; col++) {
        const lat = -90 + row * latIncrement + latIncrement / 2;
        const lng = -180 + col * lngIncrement + lngIncrement / 2;
  
        const promise = fetchWeatherDataForLocation(lat, lng)
          .then((weatherData) => {
            const temperatureValue = parseFloat(weatherData.main.temp);
  
            if (!isNaN(lat) && !isNaN(lng)) {
              temperatureData.push({
                lat: lat,
                lng: lng,
                temperature: temperatureValue,
              });
            }
          })
          .catch((error) => {
            console.error(error);
          });
  
        promises.push(promise);
      }
    }
  
    // Wait for all promises to resolve before returning the temperature data
    await Promise.all(promises);
  
    return temperatureData;
  }

  

  // Function to handle click event on map markers
  function onMapClick(e) {
    const { lat, lng } = e.latLng;

    // Fetch weather data for the clicked location
    fetchWeatherDataForLocation(lat(), lng())
      .then((weatherData) => {
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

        const infowindow = new google.maps.InfoWindow({
          content: popupContent,
        });

        infowindow.setPosition({ lat: lat(), lng: lng() });
        infowindow.open(map);
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  // Add the click event listener to the map
  map.addListener('click', onMapClick);

  // CSS for the wind direction arrow animation
const arrowAnimationStyle = `
.animated-arrow {
  -webkit-animation: rotation 2s infinite linear;
  -moz-animation: rotation 2s infinite linear;
  -o-animation: rotation 2s infinite linear;
  animation: rotation 2s infinite linear;
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
`;
  // Define the number of rows and columns in the grid

  // Fetch weather data for each cell on load
  for (let row = 0; row < numberOfRows; row++) {
    for (let col = 0; col < numberOfColumns; col++) {
      const lat = -90 + row * latIncrement + latIncrement / 2;
      const lng = -180 + col * lngIncrement + lngIncrement / 2;

      fetchWeatherDataForLocation(lat, lng)
        .then((weatherData) => {
          // Create color-coded overlays for each cell on load
          createTemperatureOverlay(map, lat, lng, weatherData.main.temp);
          createWindDirectionArrow(map, lat, lng, weatherData.wind.deg);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }
  // Add the CSS to the document head
const style = document.createElement('style');
style.innerHTML = arrowAnimationStyle;
document.head.appendChild(style);

createTemperatureHeatmap();
  createWindDirectionArrow();
  createTemperatureChoropleth(); // Call the new function
  createWindDirectionArrow();
}


