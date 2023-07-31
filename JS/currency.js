async function fetchData() {
  const url = 'https://mboum-finance.p.rapidapi.com/co/collections/undervalued_growth_stocks?start=0';
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'fc67e2b7c2mshc96a0a884cc6c68p17e57fjsn3458cd46e49a',
      'X-RapidAPI-Host': 'mboum-finance.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

function filterStocks(data) {
  const filteredStocks = data.quotes.filter(stock => {
    const earningsGrowthRate = (stock.epsTrailingTwelveMonths / stock.epsForward - 1) * 100;
    const peRatio = stock.trailingPE;
    const pegRatio = peRatio / earningsGrowthRate;
    return earningsGrowthRate > 25 && peRatio < 20 && pegRatio < 1.5;
  });
  return filteredStocks;
}

// Fetch data and create the visualization
fetchData().then(data => {
  const filteredData = filterStocks(data);

  // Extract stock symbols and earnings growth rates from filtered data
  const stockSymbols = filteredData.map(stock => stock.symbol);
  const earningsGrowthRates = filteredData.map(stock => (stock.epsTrailingTwelveMonths / stock.epsForward - 1) * 100);

  // Create a bar chart using d3.js
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const width = 900 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  const xAxisLabel = "Stock Symbols";
  const yAxisLabel = "Earnings Growth Rate (%)";

  const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const x = d3.scaleBand()
    .domain(stockSymbols)
    .range([0, width])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(earningsGrowthRates)])
    .range([height, 0]);


  // Create a tooltip element
  const tooltip = d3.select("#chart")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Mouseover event handler for the bars
  function handleMouseOver(event, stock) {
    tooltip.transition()
      .duration(200)
      .style("opacity", 0.9);

    const earningsGrowthRate = (stock.epsTrailingTwelveMonths / stock.epsForward - 1) * 100;
    const peRatio = stock.trailingPE;
    const pegRatio = peRatio / earningsGrowthRate;

    tooltip.html(
      `<strong>${stock.symbol}</strong><br>
        Earnings Growth Rate: ${earningsGrowthRate.toFixed(2)}%<br>
        PE Ratio: ${peRatio.toFixed(2)}<br>
        PEG Ratio: ${pegRatio.toFixed(2)}`
    )
      .style("left", event.pageX + "px")
      .style("top", (event.pageY - 28) + "px");
  }

  // Mouseout event handler for the bars
  function handleMouseOut() {
    tooltip.transition()
      .duration(500)
      .style("opacity", 0);
  }

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  svg.selectAll(".bar")
    .data(filteredData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", stock => x(stock.symbol))
    .attr("y", stock => y((stock.epsTrailingTwelveMonths / stock.epsForward - 1) * 100))
    .attr("width", x.bandwidth())
    .attr("height", stock => height - y((stock.epsTrailingTwelveMonths / stock.epsForward - 1) * 100))
    .attr("fill", stock => colorScale(stock.symbol))
    // Add mouseover and mouseout event handlers to the bars
    .on("mouseover", (event, stock) => handleMouseOver(event, stock))
    .on("mouseout", () => handleMouseOut());

  // Add x and y axis with labels
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Append the x-axis label
  svg.append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 10) // Adjust the position of the x-axis label
    .style("text-anchor", "middle")
    .text(xAxisLabel);

  svg.append("g")
    .call(d3.axisLeft(y));

  // Append the y-axis label
  svg.append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 20) // Adjust the position of the y-axis label
    .style("text-anchor", "middle")
    .text(yAxisLabel);

    // Bubble pie chart

    // Add x and y axis with labels
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Append the x-axis label
    svg.append("text")
      .attr("class", "axis-label")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10) // Adjust the position of the x-axis label
      .style("text-anchor", "middle")
      .text(xAxisLabel);

    svg.append("g")
      .call(d3.axisLeft(y));

    // Append the y-axis label
    svg.append("text")
      .attr("class", "axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 20) // Adjust the position of the y-axis label
      .style("text-anchor", "middle")
      .text(yAxisLabel);

  // Create a complex D3.js bubble pie chart
  const bubbleChartWidth = 400;
  const bubbleChartHeight = 400;
  const bubbleChartMargin = 50;

  const bubbleSvg = d3.select("#bubble-chart")
    .append("svg")
    .attr("width", bubbleChartWidth)
    .attr("height", bubbleChartHeight)
    .append("g")
    .attr("transform", "translate(" + bubbleChartWidth / 2 + "," + bubbleChartHeight / 2 + ")");

  // Create a pie layout and specify the value accessor
  const pie = d3.pie()
    .value(d => d.epsTrailingTwelveMonths);

  // Define the radius for the bubble chart
  const radius = d3.scaleLinear()
    .domain([0, d3.max(filteredData, d => d.epsTrailingTwelveMonths)])
    .range([0, bubbleChartWidth / 2 - bubbleChartMargin]);

  // Create arc data for the pie chart
  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

  // Append the pie chart slices as paths
  const arcs = bubbleSvg.selectAll("path")
    .data(pie(filteredData))
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", (d, i) => colorScale(filteredData[i].symbol))
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    // Add mouseover and mouseout event handlers to the pie chart slices
    .on("mouseover", (event, d) => handleMouseOver(event, d.data))
    .on("mouseout", () => handleMouseOut());
});


async function fetchInfo() {
  const url = 'https://mboum-finance.p.rapidapi.com/co/collections/undervalued_growth_stocks?start=0';
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'fc67e2b7c2mshc96a0a884cc6c68p17e57fjsn3458cd46e49a',
      'X-RapidAPI-Host': 'mboum-finance.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    createVisualization(data.quotes);

    console.log(data.quotes);
  } catch (error) {
    console.error(error);
  }
}

function createVisualization(data) {
  // Define dimensions for the chart
  const width = 900;
  const height = 700;

  // Define the scale for market cap (bubble size)
  const marketCapScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.marketCap))
    .range([5, 30]);

  // Define the scale for earnings growth rate (bubble color)
  const growthRateScale = d3.scaleLinear()
    .domain([25, d3.max(data, d => d.epsForward)])
    .range(['lightgreen', 'darkgreen']);

  // Define the scale for PE ratio (x-axis)
  const peRatioScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.trailingPE))
    .range([50, width - 50]);

  // Define the scale for PEG ratio (y-axis)
  const pegRatioScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.epsForward / d.epsTrailingTwelveMonths))
    .range([height - 50, 50]);

  // Create the SVG container for the chart
  const svg = d3.select("#chart-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


  const customTooltip = d3.select("#chart-container")
    .append("div")
    .attr("class", "custom-tooltip")
    .style("opacity", 0)
    .style("display", "none");


  // Show custom tooltip on mouseover and hide it on mouseout
  function handleMouseOver(event, d) {
    const [x, y] = d3.pointer(event);
    customTooltip
      .style("display", "block")
      .style("left", x + 10 + "px")
      .style("top", y + 10 + "px")
      .html(`
       <strong>${d.displayName}</strong><br>
       Market Cap: $${d.marketCap.toFixed(2)}B<br>
       PE Ratio: ${d.trailingPE.toFixed(2)}<br>
       PEG Ratio: ${(d.epsForward / d.epsTrailingTwelveMonths).toFixed(2)}<br>
       Earnings Growth Rate: ${(d.epsForward * 100).toFixed(2)}%
     `);
  }

  function handleMouseOut() {
    customTooltip.style("display", "none");
  }

  // Create circles for each stock (bubble chart)
  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => peRatioScale(d.trailingPE))
    .attr("cy", d => pegRatioScale(d.epsForward / d.epsTrailingTwelveMonths))
    .attr("r", d => marketCapScale(d.marketCap))
    .attr("fill", d => growthRateScale(d.epsForward))
    .attr("opacity", 0.7)
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);

  // Add x-axis
  svg.append("g")
    .attr("transform", "translate(0," + (height - 50) + ")")
    .call(d3.axisBottom(peRatioScale));

  // Add y-axis
  svg.append("g")
    .attr("transform", "translate(50,0)")
    .call(d3.axisLeft(pegRatioScale));

  // Add the chart title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .text("Undervalued Growth Stocks Bubble Chart");

  // Add x-axis title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height - 10)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Price-to-Earnings (PE) Ratio");

  // Add y-axis title
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Price/Earnings-to-Growth (PEG) Ratio");
}

fetchInfo();




// async function fetchData() {
//   const url =
//     'https://exchange-rate-api1.p.rapidapi.com/latest?base=USD';
//   const options = {
//     method: 'GET',
//     headers: {
//       'X-RapidAPI-Key': 'fc67e2b7c2mshc96a0a884cc6c68p17e57fjsn3458cd46e49a',
//       'X-RapidAPI-Host': 'exchange-rate-api1.p.rapidapi.com',
//     },
//   };

//   try {
//     const response = await fetch(url, options);
//     const data = await response.json();
//     const rates = data.rates;

//     const geojsonUrl = 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson';
//     const mapResponse = await fetch(geojsonUrl);
//     const mapData = await mapResponse.json();

//     // Map currency codes to country codes
//     const countryToCurrency = {
//       // Insert the currency code mappings here
//     };

//     for (const currencyCode in rates) {
//       const countryCodes = countryToCurrency[currencyCode];
//       if (countryCodes) {
//         countryCodes.forEach((countryCode) => {
//           mapData.features.forEach((feature) => {
//             if (feature.properties.iso_a2 === countryCode) {
//               feature.properties.currency = currencyCode;
//             }
//           });
//         });
//       }
//     }

//     // Create the choropleth map
//     createChoroplethMap(mapData, rates);
//   } catch (error) {
//     console.error(error);
//   }
// }

// function createChoroplethMap(mapData, rates) {
//   const mapDiv = d3.select('#map');
//   const width = 960;
//   const height = 600;

//   const svg = mapDiv.append('svg')
//     .attr('width', width)
//     .attr('height', height);

//   const projection = d3.geoMercator()
//     .fitSize([width, height], mapData);

//   const path = d3.geoPath().projection(projection);

//   const currencies = mapData.features.map((feature) => feature.properties.currency);

//   // Choose a color scale of your preference
//   const colorScale = d3.scaleOrdinal()
//     .domain(currencies)
//     .range(d3.schemeCategory10);


//   svg.selectAll('path')
//     .data(mapData.features)
//     .enter().append('path')
//     .attr('d', path)
//     .style('fill', (d) => colorScale(d.properties.currency))
//     .style('stroke', 'white')
//     .style('stroke-width', 0.5)
//     .on('mouseover', function (event, d) {
//       const currencyCode = d.properties.currency;
//       const rate = rates[currencyCode];

//       const tooltip = d3.select('.tooltip');
//       tooltip.style('display', 'inline-block');
//       tooltip.html(`<strong>Country:</strong> ${d.properties.name}<br><strong>Currency Code:</strong> ${currencyCode}<br><strong>Rate:</strong> ${rate ? rate.toFixed(2) : 'N/A'}`)
//         .style('left', (event.pageX + 10) + 'px')
//         .style('top', (event.pageY - 10) + 'px');
//     })
//     .on('mousemove', function (event) {
//       const tooltip = d3.select('.tooltip');
//       tooltip.style('left', (event.pageX + 10) + 'px')
//         .style('top', (event.pageY - 10) + 'px');
//     })
//     .on('mouseout', function () {
//       d3.select('.tooltip').style('display', 'none');
//     });



//   // Add a legend (optional)
//   const legend = svg.selectAll('.legend')
//     .data(colorScale.domain())
//     .enter().append('g')
//     .attr('class', 'legend')
//     .attr('transform', (d, i) => 'translate(0,' + (height - 20 - i * 20) + ')');

//   legend.append('rect')
//     .attr('x', width - 18)
//     .attr('width', 18)
//     .attr('height', 18)
//     .style('fill', colorScale);

//   legend.append('text')
//     .attr('x', width - 24)
//     .attr('y', 9)
//     .attr('dy', '.35em')
//     .style('text-anchor', 'end')
//     .text((d) => d);
// }

// fetchData();





// // // Fetch API Data
// // async function fetchExchangeRates() {
// //   const options = {
// //     method: 'GET',
// //     url: 'https://currency-conversion-and-exchange-rates.p.rapidapi.com/timeseries',
// //     params: {
// //       start_date: '2022-07-20',
// //       end_date: '2023-07-21',
// //       from: 'USD',
// //       to: 'EUR'
// //     },
// //     headers: {
// //       'X-RapidAPI-Key': 'fc67e2b7c2mshc96a0a884cc6c68p17e57fjsn3458cd46e49a',
// //       'X-RapidAPI-Host': 'currency-conversion-and-exchange-rates.p.rapidapi.com'
// //     }
// //   };

// //   try {
// //     const response = await axios.request(options);
// //     // Parse the API response data into currencyData array
// //     const responseData = response.data.rates;
// //     const currencyData = Object.entries(responseData).map(([date, rates]) => {
// //       return {
// //         date: new Date(date),
// //         ...rates
// //       };
// //     });

// //     console.log(responseData);

// //     // Call the function to create the D3.js chart
// //     createLineChart(currencyData);
// //   } catch (error) {
// //     console.error(error);
// //   }
// // }



// // fetchExchangeRates();

// // const createLineChart = data => {
// //   const margin = { top: 50, right: 50, bottom: 50, left: 50 };
// //   const width = window.innerWidth - margin.left - margin.right;
// //   const height = window.innerHeight - margin.top - margin.bottom;

// //   // Add SVG to the page
// //   const svg = d3
// //     .select('#chart')
// //     .append('svg')
// //     .attr('width', width + margin.left + margin.right)
// //     .attr('height', height + margin.top + margin.bottom)
// //     .call(responsivefy)
// //     .append('g')
// //     .attr('transform', `translate(${margin.left},  ${margin.top})`);