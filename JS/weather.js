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

    // API endpoint and headers
    var apiUrl = 'https://weatherbit-v1-mashape.p.rapidapi.com/forecast/daily';
    var headers = {
        'X-RapidAPI-Key': '6cbee0e4e6mshf61f1a0cbd22aa9p124cc0jsnfd36b4991892',
        'X-RapidAPI-Host': 'weatherbit-v1-mashape.p.rapidapi.com'
    };

    // Fetch user's location
    navigator.geolocation.getCurrentPosition(function (position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        // Fetch weather data
        var xhr = new XMLHttpRequest();
        xhr.open("GET", apiUrl + '?lat=' + latitude + '&lon=' + longitude + '&days=7');
        xhr.setRequestHeader('X-RapidAPI-Key', headers['X-RapidAPI-Key']);
        xhr.setRequestHeader('X-RapidAPI-Host', headers['X-RapidAPI-Host']);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    var weatherData = response.data;
                    var data = [];

                    // Extract dates and weather variables from the response
                    weatherData.forEach(function (dataPoint) {
                        var date = new Date(dataPoint.datetime);
                        var temperature = dataPoint.temp;
                        var humidity = dataPoint.rh;
                        var precipitation = dataPoint.precip;
                        var wind = dataPoint.wind_spd;
                        var uv = dataPoint.uv;

                        data.push({
                            group: date,
                            variables: [
                                { name: "Temperature", value: temperature },
                                { name: "Humidity", value: humidity },
                                { name: "Precipitation", value: precipitation },
                                { name: "Wind Speed", value: wind },
                                { name: "UV Index", value: uv }
                            ]
                        });
                    });

                    // Create heatmap using D3.js
                    // Set dimensions and margins of the graph
                    var margin = { top: 80, right: 25, bottom: 30, left: 40 },
                        width = 450 - margin.left - margin.right,
                        height = 450 - margin.top - margin.bottom;

                    // Append SVG object to the body of the page
                    var svg = d3.select("#heatmap")
                        .append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    // Labels of rows and columns
                    var myGroups = data.map(function (d) { return d.group; });
                    var myVars = ["Temperature", "Humidity", "Precipitation", "Wind Speed", "UV Index"];

                    // Build X scales and axis
                    var x = d3.scaleBand()
                        .range([0, width])
                        .domain(myGroups)
                        .padding(0.05);
                    svg.append("g")
                        .style("font-size", 15)
                        .attr("transform", "translate(0," + height + ")")
                        .call(d3.axisBottom(x).tickSize(0).tickFormat(function (d) {
                            var date = new Date(d);
                            var day = date.getDate();
                            var month = date.toLocaleString('default', { month: 'short' });
                            return day + ", " + month;
                        }))
                        .select(".domain").remove();

                    // Build Y scales and axis
                    var y = d3.scaleBand()
                        .range([height, 0])
                        .domain(myVars)
                        .padding(0.05);
                    svg.append("g")
                        .style("font-size", 15)
                        .call(d3.axisLeft(y).tickSize(0))
                        .select(".domain").remove();

                    // Build color scales for each parameter
                    var tempExtent = d3.extent(data, function (d) { return d.variables[0].value; });
                    var humidityExtent = d3.extent(data, function (d) { return d.variables[1].value; });
                    var precipExtent = d3.extent(data, function (d) { return d.variables[2].value; });
                    var windExtent = d3.extent(data, function (d) { return d.variables[3].value; });
                    var uvExtent = d3.extent(data, function (d) { return d.variables[4].value; });

                    var colorScales = {
                        "Temperature": d3.scaleSequential().interpolator(d3.interpolateInferno).domain(tempExtent),
                        "Humidity": d3.scaleSequential().interpolator(d3.interpolateViridis).domain(humidityExtent),
                        "Precipitation": d3.scaleSequential().interpolator(d3.interpolateBlues).domain(precipExtent),
                        "Wind Speed": d3.scaleSequential().interpolator(d3.interpolateOranges).domain(windExtent),
                        "UV Index": d3.scaleSequential().interpolator(d3.interpolatePurples).domain(uvExtent)
                    };


                    // Create a tooltip
                    var tooltip = d3.select("#heatmap")
                        .append("div")
                        .style("opacity", 0)
                        .attr("class", "tooltip")
                        .style("background-color", "white")
                        .style("border", "solid")
                        .style("border-width", "2px")
                        .style("border-radius", "5px")
                        .style("padding", "5px");

                    // Functions for tooltip interactions
                    var mouseover = function (event, d) {
                        tooltip.style("opacity", 1);
                        d3.select(this)
                            .style("stroke", "black")
                            .style("opacity", 1);
                    };
                    var mousemove = function (event, d) {
                        var variable = d3.select(this.parentNode).datum().name;
                        var value = d.variables.find(varItem => varItem.name === variable)?.value;
                        console.log(value)
                        if (value !== undefined) {
                            tooltip
                                .html("The exact value of<br>" + variable + " is: " + value)
                                .style("left", (event.pageX + 70) + "px")
                                .style("top", (event.pageY) + "px");
                        }
                        };
                        var mouseleave = function (event, d) {
                            tooltip.style("opacity", 0);
                            d3.select(this)
                                .style("stroke", "none")
                                .style("opacity", 0.8);
                        };

                        // Add the squares
                        svg.selectAll()
                            .data(data)
                            .enter()
                            .append("rect")
                            .attr("x", function (d) { return x(d.group); })
                            .attr("y", function (d) { return y(d.variables[0].name); })
                            .attr("rx", 4)
                            .attr("ry", 4)
                            .attr("width", x.bandwidth())
                            .attr("height", y.bandwidth())
                            .style("fill", function (d) {
                                var variableName = d.variables.find(varItem => varItem.name === "Temperature")?.name;
                                var variableValue = d.variables.find(varItem => varItem.name === "Temperature")?.value;
                                return colorScales[variableName](variableValue);
                            })
                            .style("stroke-width", 4)
                            .style("stroke", "none")
                            .style("opacity", "0.8")
                            .on("mouseover", mouseover)
                            .on("mousemove", mousemove)
                            .on("mouseleave", mouseleave);

                        // Add title to graph
                        svg.append("text")
                            .attr("x", 0)
                            .attr("y", -50)
                            .attr("text-anchor", "left")
                            .style("font-size", "22px")
                            .text("A d3.js heatmap");

                        // Add subtitle to graph
                        svg.append("text")
                            .attr("x", 0)
                            .attr("y", -20)
                            .attr("text-anchor", "left")
                            .style("fill", "grey")
                            .style("max-width", 400)
                            .text("A short description");

                    } else {
                        alert("Error fetching weather data.");
                }
            }
        };

        xhr.send();
    }, function (error) {
        alert("Error retrieving location data.");
    });


    // // API endpoint and headers
    // var apiUrl = 'https://weatherbit-v1-mashape.p.rapidapi.com/forecast/daily';
    // var headers = {
    //     'X-RapidAPI-Key': '6cbee0e4e6mshf61f1a0cbd22aa9p124cc0jsnfd36b4991892',
    //     'X-RapidAPI-Host': 'weatherbit-v1-mashape.p.rapidapi.com'
    // };

    // // Fetch user's location
    // navigator.geolocation.getCurrentPosition(function (position) {
    //     var latitude = position.coords.latitude;
    //     var longitude = position.coords.longitude;

    //     // Fetch weather data
    //     var xhr = new XMLHttpRequest();
    //     xhr.open("GET", apiUrl + '?lat=' + latitude + '&lon=' + longitude + '&days=7');
    //     xhr.setRequestHeader('X-RapidAPI-Key', headers['X-RapidAPI-Key']);
    //     xhr.setRequestHeader('X-RapidAPI-Host', headers['X-RapidAPI-Host']);
    //     xhr.onreadystatechange = function () {
    //         if (xhr.readyState === XMLHttpRequest.DONE) {
    //             if (xhr.status === 200) {
    //                 var response = JSON.parse(xhr.responseText);
    //                 var weatherData = response.data;
    //                 var data = [];

    //                 // Extract dates and weather variables from the response
    //                 for (var i = 0; i < weatherData.length; i++) {
    //                     var dateParts = weatherData[i].datetime.split("-");
    //                     var date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    //                     var temperature = weatherData[i].temp;
    //                     var humidity = weatherData[i].rh;
    //                     var precipitation = weatherData[i].precip;
    //                     var wind = weatherData[i].wind_spd;
    //                     var uv = weatherData[i].uv;

    //                     data.push({
    //                         group: date,
    //                         variables: [
    //                             { name: "Temperature", value: temperature },
    //                             { name: "Humidity", value: humidity },
    //                             { name: "Precipitation", value: precipitation },
    //                             { name: "Wind Speed", value: wind },
    //                             { name: "UV Index", value: uv }
    //                         ]
    //                     });
    //                 }

    //                 // Create heatmap using D3.js
    //                 // Set dimensions and margins of the graph
    //                 var margin = { top: 80, right: 25, bottom: 30, left: 40 },
    //                     width = 450 - margin.left - margin.right,
    //                     height = 450 - margin.top - margin.bottom;

    //                 // Append SVG object to the body of the page
    //                 var svg = d3.select("#heatmap")
    //                     .append("svg")
    //                     .attr("width", width + margin.left + margin.right)
    //                     .attr("height", height + margin.top + margin.bottom)
    //                     .append("g")
    //                     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //                 // Labels of rows and columns
    //                 var myGroups = d3.map(data, function (d) { return d.group; }).keys();
    //                 var myVars = ["Temperature", "Humidity", "Precipitation", "Wind Speed", "UV Index"];

    //                 // Build X scales and axis
    //                 var x = d3.scaleBand()
    //                     .range([0, width])
    //                     .domain(myGroups)
    //                     .padding(0.05);
    //                 svg.append("g")
    //                     .style("font-size", 15)
    //                     .attr("transform", "translate(0," + height + ")")
    //                     .call(d3.axisBottom(x).tickSize(0).tickFormat(function (d) {
    //                         var date = new Date(d);
    //                         var day = date.getDate();
    //                         var month = date.toLocaleString('default', { month: 'short' });
    //                         return day + ", " + month;
    //                     }))
    //                     .select(".domain").remove();

    //                 // Build Y scales and axis
    //                 var y = d3.scaleBand()
    //                     .range([height, 0])
    //                     .domain(myVars)
    //                     .padding(0.05);
    //                 svg.append("g")
    //                     .style("font-size", 15)
    //                     .call(d3.axisLeft(y).tickSize(0))
    //                     .select(".domain").remove();

    //                 // Build color scales for each parameter
    //                 var tempExtent = d3.extent(data, function (d) { return d.variables[0].value; });
    //                 var humidityExtent = d3.extent(data, function (d) { return d.variables[1].value; });
    //                 var precipExtent = d3.extent(data, function (d) { return d.variables[2].value; });
    //                 var windExtent = d3.extent(data, function (d) { return d.variables[3].value; });
    //                 var uvExtent = d3.extent(data, function (d) { return d.variables[4].value; });

    //                 var colorScales = {
    //                     "Temperature": d3.scaleSequential().interpolator(d3.interpolateInferno).domain(tempExtent),
    //                     "Humidity": d3.scaleSequential().interpolator(d3.interpolateViridis).domain(humidityExtent),
    //                     "Precipitation": d3.scaleSequential().interpolator(d3.interpolateBlues).domain(precipExtent),
    //                     "Wind": d3.scaleSequential().interpolator(d3.interpolateOranges).domain(windExtent),
    //                     "UV": d3.scaleSequential().interpolator(d3.interpolatePurples).domain(uvExtent)
    //                 };


    //                 // Create a tooltip
    //                 var tooltip = d3.select("#heatmap")
    //                     .append("div")
    //                     .style("opacity", 0)
    //                     .attr("class", "tooltip")
    //                     .style("background-color", "white")
    //                     .style("border", "solid")
    //                     .style("border-width", "2px")
    //                     .style("border-radius", "5px")
    //                     .style("padding", "5px");

    //                 // Functions for tooltip interactions
    //                 var mouseover = function (d) {
    //                     tooltip.style("opacity", 1);
    //                     d3.select(this)
    //                         .style("stroke", "black")
    //                         .style("opacity", 1);
    //                 };
    //                 var mousemove = function (event, d) {
    //                     var variable = d3.select(this.parentNode).datum().name;
    //                     var value = d.value;
    //                     tooltip
    //                         .html("The exact value of<br>" + variable + " is: " + value)
    //                         .style("left", (event.pageX + 70) + "px")
    //                         .style("top", (event.pageY) + "px");
    //                 };
    //                 var mouseleave = function (d) {
    //                     tooltip.style("opacity", 0);
    //                     d3.select(this)
    //                         .style("stroke", "none")
    //                         .style("opacity", 0.8);
    //                 };

    //                 // Add the squares
    //                 svg.selectAll()
    //                     .data(data, function (d) { return d.group + ':' + d.variables[0].name; })
    //                     .enter()
    //                     .append("rect")
    //                     .attr("x", function (d) { return x(d.group); })
    //                     .attr("y", function (d, i) { return y(d.variables[i].name); })
    //                     .attr("rx", 4)
    //                     .attr("ry", 4)
    //                     .attr("width", x.bandwidth())
    //                     .attr("height", y.bandwidth())
    //                     .style("fill", function (d, i) { return colorScales[d.variables[i].name](d.variables[i].value); })
    //                     .style("stroke-width", 4)
    //                     .style("stroke", "none")
    //                     .style("opacity", "0.8")
    //                     .on("mouseover", mouseover)
    //                     .on("mousemove", mousemove)
    //                     .on("mouseleave", mouseleave);

    //                 // Add title to graph
    //                 svg.append("text")
    //                     .attr("x", 0)
    //                     .attr("y", -50)
    //                     .attr("text-anchor", "left")
    //                     .style("font-size", "22px")
    //                     .text("A d3.js heatmap");

    //                 // Add subtitle to graph
    //                 svg.append("text")
    //                     .attr("x", 0)
    //                     .attr("y", -20)
    //                     .attr("text-anchor", "left")
    //                     .style("fill", "grey")
    //                     .style("max-width", 400)
    //                     .text("A short description");

    //             } else {
    //                 alert("Error fetching weather data.");
    //             }
    //         }
    //     };

    //     xhr.send();
    // }, function (error) {
    //     alert("Error retrieving location data.");
    // });


    // // HeatMap
    // var country = prompt("Enter a country name");

    // // API endpoint and headers
    // var apiUrl = 'https://weatherapi-com.p.rapidapi.com';
    // var headers = {
    //     'X-RapidAPI-Key': '6cbee0e4e6mshf61f1a0cbd22aa9p124cc0jsnfd36b4991892',
    //     'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
    // };

    // // Fetch weather data
    // var xhr = new XMLHttpRequest();
    // xhr.open("GET", apiUrl + '/forecast.json?q=' + country + "&days=3");
    // xhr.setRequestHeader('X-RapidAPI-Key', headers['X-RapidAPI-Key']);
    // xhr.setRequestHeader('X-RapidAPI-Host', headers['X-RapidAPI-Host']);
    // xhr.onreadystatechange = function () {
    //     if (xhr.readyState === XMLHttpRequest.DONE) {
    //         if (xhr.status === 200) {
    //             var response = JSON.parse(xhr.responseText);
    //             var weatherData = response.forecast.forecastday;
    //             var data = [];
    //             // var temperatures = [];


    //             //Extract dates and temperatures from the response
    //             for (var i = 0; i < weatherData.length; i++) {
    //                 var date = weatherData[i].date;
    //                 var temperature = weatherData[i].day.avgtemp_c;
    //                 var humidity = weatherData[i]

    //                 data.push({
    //                     group: date,
    //                     variable: "Temperature",
    //                     value: temperature
    //                 });
    //             }

    //             // Create heatmap using D3.js
    //             //Set dimensions and margins of the graph
    //             var margin = { top: 80, right: 25, bottom: 30, left: 40 },
    //                 width = 450 - margin.left - margin.right,
    //                 height = 450 - margin.top - margin.bottom;

    //             // Append SVG object to the body of the page
    //             var svg = d3.select("#heatmap1")
    //                 .append("svg")
    //                 .attr("width", width + margin.left + margin.right)
    //                 .attr("height", height + margin.top + margin.bottom)
    //                 .append("g")
    //                 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //             // Labels of rows and columns
    //             var myGroups = d3.map(data, function (d) { return d.group; }).keys();
    //             var myVars = d3.map(data, function (d) { return d.variable; }).keys();

    //             //Build X scales and axis
    //             var x = d3.scaleBand()
    //                 .range([0, width])
    //                 .domain(myGroups)
    //                 .padding(0.05);
    //             svg.append("g")
    //                 .style("font-size", 15)
    //                 .attr("transform", "translate(0," + height + ")")
    //                 .call(d3.axisBottom(x).tickSize(0))
    //                 .select(".domain").remove();

    //             //Build Y scales and axis
    //             var y = d3.scaleBand()
    //                 .range([height, 0])
    //                 .domain(myVars)
    //                 .padding(0.05);
    //             svg.append("g")
    //                 .style("font-size", 15)
    //                 .call(d3.axisLeft(y).tickSize(0))
    //                 .select(".domain").remove();

    //             //Build color scale 
    //             var tempExtent = d3.extent(data, function(d) {
    //                 return d.value;
    //             });
    //             var myColor = d3.scaleSequential()
    //                 .interpolator(d3.interpolateInferno)
    //                 .domain(tempExtent);

    //             //Create a tooltip
    //             var tooltip = d3.select("#heatmap1")
    //                 .append("div")
    //                 .style("opacity", 0)
    //                 .attr("class", "tooltip")
    //                 .style("background-color", "white")
    //                 .style("border", "solid")
    //                 .style("border-width", "2px")
    //                 .style("border-radius", "5px")
    //                 .style("padding", "5px");

    //             //Functions for tooltip interactions
    //             var mouseover = function (d) {
    //                 tooltip.style("opacity", 1)
    //                 d3.select(this)
    //                     .style("stroke", "black")
    //                     .style("opacity", 1);
    //             };
    //             var mousemove = function (event, d) {
    //                 console.log(d.value);
    //                 tooltip
    //                     .html("The exact value of<br>this cell is: " + d.value)
    //                     .style("left", (event.pageX + 70) + "px")
    //                     .style("top", (event.pageY) + "px");
    //             };
    //             var mouseleave = function (d) {
    //                 tooltip.style("opacity", 0);
    //                 d3.select(this)
    //                     .style("stroke", "none")
    //                     .style("opacity", 0.8);
    //             };

    //             //Add the squares
    //             svg.selectAll()
    //                 .data(data, function (d) { return d.group + ':' + d.variable; })
    //                 .enter()
    //                 .append("rect")
    //                 .attr("x", function (d) { return x(d.group); })
    //                 .attr("y", function (d) { return y(d.variable); })
    //                 .attr("rx", 4)
    //                 .attr("ry", 4)
    //                 .attr("width", x.bandwidth())
    //                 .attr("height", y.bandwidth())
    //                 .style("fill", function (d) { return myColor(d.value); })
    //                 .style("stroke-width", 4)
    //                 .style("stroke", "none")
    //                 .style("opacity", "0.8")
    //                 .on("mouseover", mouseover)
    //                 .on("mousemove", mousemove)
    //                 .on("mouseleave", mouseleave);

    //             //Add title to graph
    //             svg.append("text")
    //                 .attr("x", 0)
    //                 .attr("y", -50)
    //                 .attr("text-anchor", "left")
    //                 .style("font-size", "22px")
    //                 .text("A d3.js heatmap");

    //             // Add subtitle to graph
    //             svg.append("text")
    //                 .attr("x", 0)
    //                 .attr("y", -20)
    //                 .attr("text-anchor", "left")
    //                 .style("fill", "grey")
    //                 .style("max-width", 400)
    //                 .text("A short description");

    //         } else {
    //             alert("Error fetching weather data.");
    //         }
    //     }
    // }

    // xhr.send();

});