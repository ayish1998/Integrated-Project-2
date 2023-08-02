export function initMap(userLatLng) {
    console.log(userLatLng);
    const map = new google.maps.Map(document.getElementById("map"), {
        center: userLatLng,
        zoom: 3, // You can adjust the zoom level as needed
    });

    // Create a new Google Map instance centered on a specific location (e.g., center of the world)
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLatLng = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                // Create the map centered on the user's current location
                const map = new google.maps.Map(document.getElementById("map"), {
                    center: userLatLng,
                    zoom: 3, // You can adjust the zoom level as needed
                });

                // Add the legend to the map container
                const legend = document.getElementById("map-legend");
                map.controls[google.maps.ControlPosition.TOP_RIGHT].push(legend);

                // Call the fetchWeatherData function to fetch weather data for all countries
                fetchWeatherData(map);
            },
            (error) => {
                console.error("Error getting user's current location:", error);
                // If geolocation is not available or denied, you can handle the error here
                // For now, we'll center the map on a default location
                const defaultLatLng = { lat: 0, lng: 0 };
                const map = new google.maps.Map(document.getElementById("map"), {
                    center: defaultLatLng,
                    zoom: 2,
                });
                // Call the fetchWeatherData function to fetch weather data for all countries
                fetchWeatherData(map);
            }
        );
    }
}

const apiKey = "df918deb135cc4c83828b9026095bfc1";
const units = "metric";

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

        // Proceed with creating polygons on the map and customizing its appearance
        customizeMapAppearance(map);
        createMapWithMarkers(map, weatherDataArray);
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
            temperature: data.main.temp,
            weatherDescription: data.weather[0].description,
        };
        return weatherData;
    } else {
        throw new Error(`Error fetching weather data for ${country}: ${data.message}`);
    }
}

//Create the map with markers and color-coded polygons
function createMapWithMarkers(map, weatherDataArray) {

    weatherDataArray.forEach((weatherData) => {
        const country = weatherData.country;
        const temperature = weatherData.temperature;

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
    // Calculate the polygon coordinates (customize based on the desired shape)
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

//Color-code the polygons based on temperature
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
            featureType: "administrative", // Hide administrative labels
            elementType: "labels",
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

