// Author: Ganiyat Adekunle
//*******************************************************************************************************
//RENDER HEATMAP FUNCTION
//*******************************************************************************************************

export const renderHeatmap = (heatmapData) => {
  const titleDiv = document.getElementById('title');
  console.log(heatmapData);
  const variables = ['temp', 'uv', 'precip', 'rh', 'wind_spd'];
  const variableLabels = {
    temp: 'Temperature',
    uv: 'UV Index',
    precip: 'Precipitation',
    rh: 'Relative Humidity',
    wind_spd: 'Wind Speed'
  };
  const dates = heatmapData.data.map((day) => day.valid_date);
  const formatTime = d3.timeFormat("%d %B, %Y");
  const title = document.createElement('h5');
  title.textContent = `Weather Heatmap: ${heatmapData.city_name}, ${heatmapData.country_code}`;
  titleDiv.appendChild(title);

  const xScale = d3.scaleBand()
    .domain(dates)
    .range([padding, width - padding])
    .padding(0.1);

  const yScale = d3.scaleBand()
    .domain(variables)
    .range([padding, height - padding])
    .padding(0.1);

  const colorScales = {
    temp: d3.scaleSequential()
      .interpolator(d3.interpolateReds),
    uv: d3.scaleSequential()
      .interpolator(d3.interpolateGreens),
    precip: d3.scaleSequential()
      .interpolator(d3.interpolatePurples),
    rh: d3.scaleSequential()
      .interpolator(d3.interpolateBlues),
    wind_spd: d3.scaleSequential()
      .interpolator(d3.interpolateOranges)
  };

  variables.forEach((variable) => {
    const minVal = d3.min(heatmapData.data, (day) => day[variable]);
    const maxVal = d3.max(heatmapData.data, (day) => day[variable]);
    colorScales[variable].domain([minVal, maxVal]);
  });

  const svg = d3.select('svg');
  const tooltip = d3.select('#tooltip')
    .style('position', 'absolute')
    .style('visibility', 'hidden');

  svg.append('g')
    .selectAll('g')
    .data(variables)
    .enter()
    .append('g')
    .attr('class', 'variable-group')
    .attr('transform', (d) => `translate(50, ${yScale(d)})`)
    .selectAll('rect')
    .data((variable) => heatmapData.data.map((day) => ({ variable, day })))
    .enter()
    .append('rect')
    .attr('class', 'cell')
    .attr('x', (d) => xScale(d.day.valid_date))
    .attr('y', 0)
    .attr('width', xScale.bandwidth())
    .attr('height', yScale.bandwidth())
    .attr('fill', (d) => colorScales[d.variable](d.day[d.variable]))
    .attr('data-variable', (d) => d.variable)
    .attr('data-value', (d) => d.day[d.variable] || '')
    .on('mouseover', function (event, d) {
      const cell = d3.select(this);

      // Get the mouse coordinates relative to the SVG
      const [x, y] = d3.pointer(event);

      // Get the position and dimensions of the cell
      const cellPosition = cell.node().getBoundingClientRect();
      const cellX = cellPosition.x;
      const cellY = cellPosition.y;
      const cellWidth = cellPosition.width;

      // Calculate the tooltip position relative to the cell
      const tooltipX = cellX + cellWidth / 2;
      const tooltipY = cellY;

      tooltip.transition()
        .style('visibility', 'visible')
        .style('left', `${tooltipX}px`)
        .style('top', `${tooltipY}px`);

      tooltip.text(`${variableLabels[d.variable]}: ${d.day[d.variable]}`);


      tooltip.attr('data-date', d.day.valid_date);
    })
    .on('mouseout', function (event, d) {
      tooltip.transition()
        .style('visibility', 'hidden');
    });

  const xAxis = d3.axisBottom(xScale)
    .tickFormat((date) => formatTime(new Date(date)));
  const yAxis = d3.axisLeft(yScale)
    .tickFormat((variable) => variableLabels[variable]);

  svg.append('g')
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr('transform', `translate(50, ${height - padding})`);

  svg.append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr('transform', `translate(${padding + 50}, 0)`);

  svg.append('text')
    .attr('class', 'x-axis-label')
    .attr('text-anchor', 'middle')
    .attr('x', width / 2)
    .attr('y', height - 20)
    .text('Date');

  svg.append('text')
    .attr('class', 'y-axis-label')
    .attr('text-anchor', 'middle')
    .attr('x', -height / 2)
    .attr('y', 25)
    .attr('transform', 'rotate(-90)')
    .text('Variable');
};

const width = 1200;
const height = 600;
const padding = 80;

//*******************************************************************************************************
//INIT MAP FUNCTION
//*******************************************************************************************************
// const apiKey = "df918deb135cc4c83828b9026095bfc1";
// const units = "metric";

export function initMap(userLatLng) {
  console.log(userLatLng);
  const map = new google.maps.Map(document.getElementById("map"), {
    center: userLatLng,
    zoom: 6,
  });

  // Create a new Google Map instance centered on a specific location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLatLng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // Create and center map centered on the user's current location
        const map = new google.maps.Map(document.getElementById("map"), {
          center: userLatLng,
          zoom: 3,
        });

        // Add legend to the map container
        const legend = document.getElementById("map-legend");
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(legend);

        // Call the fetchWeatherData function to fetch weather data for all countries
        fetchWeatherData(map);
      },
      (error) => {
        console.error("Error getting user's current location:", error);
        // If geolocation is not available or denied, center the map on a default location
        const defaultLatLng = { lat: 0, lng: 0 };
        const map = new google.maps.Map(document.getElementById("map"), {
          center: defaultLatLng,
          zoom: 2,
        });
        //fetchWeatherData function to fetch weather data for all countries
        fetchWeatherData(map);
      }
    );
  }
}

//Fetch weather data for all countries
async function fetchWeatherData(map) {
  try {
    const countriesData = await fetch('https://restcountries.com/v2/all');
    const countries = await countriesData.json();
    const weatherDataArray = [];

    for (const country of countries) {
      try {
        const weatherData = await getWeatherDataForCountry(country.name);
        weatherDataArray.push(weatherData);
      } catch (error) {
        console.error(`Error fetching weather data for ${country.name}:`, error);
      }
    }

    //Create polygons on the map and customize its appearance
    customizeMapAppearance(map);
    createMapWithPolygon(map, weatherDataArray);
  } catch (error) {
    console.error('Error fetching countries data:', error);
  }
}

//Fetch weather data for an individual country
async function getWeatherDataForCountry(country) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${country}&units=${units}&appid=${apiKey}`;

  const response = await fetch(apiUrl);
  const data = await response.json();

  if (response.ok) {
    const weatherData = {
      country: country,
      temperature: Math.round(data.main.temp),
      weatherDescription: data.weather[0].description,
    };
    return weatherData;
  } else {
    throw new Error(`Error fetching weather data for ${country}: ${data.message}`);
  }
}

//Create the map with color-coded polygons
function createMapWithPolygon(map, weatherDataArray) {
  weatherDataArray.forEach((weatherData) => {
    const country = weatherData.country;
    const temperature = Math.round(weatherData.temperature);

    // Get the GeoJSON data for the country's border
    fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson')
      .then((response) => response.json())
      .then((data) => {
        const countryFeature = data.features.find(
          (feature) => feature.properties.ADMIN.toLowerCase() === country.toLowerCase()
        );

        if (!countryFeature) {
          console.error(`Country ${country} not found in GeoJSON data.`);
          return;
        }

        // Convert the country feature to a GeoJSON object
        const countryGeoJSON = {
          type: 'FeatureCollection',
          features: [countryFeature],
        };

        // Create a polygon for the country using its GeoJSON data
        const countryPolygon = new google.maps.Data({
          map: map,
          style: {
            fillColor: getColorBasedOnTemperature(temperature),
            strokeColor: 'red',
            strokeWeight: 2,
          },
        });
        countryPolygon.addGeoJson(countryGeoJSON);

        // Add a click event listener to the polygon to show weather information in an info window
        google.maps.event.addListener(countryPolygon, 'click', (event) => {
          const infoWindow = new google.maps.InfoWindow({
            content: `${country}: ${temperature}°C, ${weatherData.weatherDescription}`,
          });
          infoWindow.setPosition(event.latLng);
          infoWindow.open(map);
        });
      })
      .catch((error) => {
        console.error(`Error fetching GeoJSON data for ${country}:`, error);
      });
  });

}

// Function to get polygon coordinates based on country center
function getPolygonCoordinates(countryCenter) {
  // Calculate the polygon coordinates based on the country center
  const latitudeOffset = 0.1;
  const longitudeOffset = 0.1;
  const polygonCoordinates = [
    { lat: countryCenter.lat + latitudeOffset, lng: countryCenter.lng - longitudeOffset },
    { lat: countryCenter.lat + latitudeOffset, lng: countryCenter.lng + longitudeOffset },
    { lat: countryCenter.lat - latitudeOffset, lng: countryCenter.lng + longitudeOffset },
    { lat: countryCenter.lat - latitudeOffset, lng: countryCenter.lng - longitudeOffset },
  ];
  return polygonCoordinates;
}

//Function to color-code the polygons based on temperature
function getColorBasedOnTemperature(temperature) {
  // Define temperature ranges and their corresponding colors
  const colorRanges = [
    { minTemperature: -10, maxTemperature: 0, color: "blue" },
    { minTemperature: 1, maxTemperature: 10, color: "cyan" },
    { minTemperature: 11, maxTemperature: 20, color: "green" },
    { minTemperature: 21, maxTemperature: 30, color: "yellow" },
    { minTemperature: 31, maxTemperature: 40, color: "orange" },
    { minTemperature: 41, maxTemperature: 100, color: "red" },
  ];

  // Find the color range that matches the temperature
  const matchingRange = colorRanges.find(
    (range) => temperature >= range.minTemperature && temperature <= range.maxTemperature
  );

  // Return the corresponding color for the temperature range
  return matchingRange ? matchingRange.color : "gray"; // Default color for undefined ranges
}

//Customize the map appearance
function customizeMapAppearance(map) {
  // Create a new MapTypeStyle object to customize the map style
  const customMapStyle = new google.maps.StyledMapType([
    {
      featureType: "administrative",
      stylers: [{ visibility: "on" }],
    },
    {
      featureType: "poi", // Hide points of interest
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "road", // Hide roads
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "water", // Show water bodies
      elementType: "geometry",
      stylers: [{ visibility: "on" }],
    },
    {
      featureType: "water", // Customize water color
      elementType: "geometry.fill",
      stylers: [{ color: "#AEDFFA" }],
    },
    {
      featureType: "landscape", // Customize landscape color
      elementType: "geometry.fill",
      stylers: [{ color: "#EAEAEA" }],
    },
  ]);

  // Set the custom map style to the map
  map.mapTypes.set("custom_style", customMapStyle);
  map.setMapTypeId("custom_style");
}

