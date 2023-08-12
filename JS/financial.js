
async function fetchData() {
  const url = 'https://mboum-finance.p.rapidapi.com/co/collections/growth_technology_stocks?start=0';
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'b059a9314dmshc7cfa4f532ef633p134d10jsne9b89f2993c7',
      'X-RapidAPI-Host': 'mboum-finance.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result);

    createBarChart(result.quotes);
    // createLineChart(result.quotes);
    createBubbleChart(result.quotes);

    console.log(result.quotes[0].marketCap);
  } catch (error) {
    console.error(error);
  }
}

let originalData;

function createBarChart(data) {
  const container = d3.select("#chart");

// Add a container for the label and dropdown
const labelContainer = container.append("div")
  .attr("class", "label-container")
  .style("margin-top", "40px");


// Add a label for the dropdown
labelContainer.append("label")
  .text("Order by:")
  .attr("for", "sort-dropdown"); // Associate the label with the dropdown

  // Add dropdown for sorting order
const dropdown = labelContainer.append("select")
.on("change", () => updateChart(dropdown.node().value))
.attr("class", "sort-dropdown")
.attr("id", "sort-dropdown"); // Add an id for associating with the label

dropdown.append("option").text("Highest Order").attr("value", "highest");
dropdown.append("option").text("Lowest Order").attr("value", "lowest");
dropdown.append("option").text("Alphabetical").attr("value", "alphabetical");


 // Create a container for the SVG with a fixed width
 const svgContainer = container.append("div")
 .attr("class", "svg-container")
 .style("width", "100%")
 .style("overflow-x", "auto");

const svg = svgContainer.append("svg")
.attr("width", 700*2) // Set an initial width for the SVG
.attr("height", 600);

  let chartData = data;
  originalData = [...chartData];

  const xScale = d3.scaleBand()
    .domain(chartData.map(d => d.symbol))
    .range([50, container.node().getBoundingClientRect().width - 40])
    .padding(0.2);

  
    const yScale = d3.scaleLinear()
    .domain([0, d3.max(chartData, d => parseFloat(d.regularMarketPrice))])
    .range([450, 2]);

  // Define the color scale for different companies
  const colorScale = d3.scaleOrdinal()
    .domain(chartData.map(d => d.symbol))
    .range(d3.schemeCategory10);

  const tooltip = container
    .append("div")
    .style("position", "absolute")
    .style("pointer-events", "none")
    .style("opacity", 0)
    .style("background-color", "black")
    .style("color", "#fff")
    .style("padding", "10px 20px")
    .style("border", "1px solid #ccc")
    .style("border-radius", "10px")
    .style("font-size", "14px");

  svg.selectAll("rect")
    .data(chartData)
    .enter()
    .append("rect")
    .attr("x", d => xScale(d.symbol))
    .attr("y", 450)
    .attr("width", xScale.bandwidth())
    .attr("height", 0)
    .attr("fill", (d, i) => getColor(i))
    .attr("fill", d => colorScale(d.symbol))
    .on("mouseover", function (event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("fill", "lightblue");

      const [x, y] = d3.pointer(event);
      tooltip.style("opacity", 1)
        .style("left", (x + 50) + "px")
        .style("top", (y + 80) + "px")
        .html(`Symbol: ${d.symbol}<br/>Price: ${d.regularMarketPrice}<br/>High: ${d.regularMarketDayHigh}<br/>Low: ${d.regularMarketDayLow}`);
    })
    .on("mouseout", function () {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("fill", d => colorScale(d.symbol));
      tooltip.style("opacity", 0);
    })
    .transition()
    .duration(800)
    .delay((d, i) => i * 100)
    .attr("y", d => yScale(parseFloat(d.regularMarketPrice)))
    .attr("height", d => 450 - yScale(parseFloat(d.regularMarketPrice)));

  svg.append("g")
    .attr("transform", "translate(0, 450)")
    .call(d3.axisBottom(xScale));

  svg.append("g")
    .attr("transform", "translate(50, 0)")
    .call(d3.axisLeft(yScale));

   // Adjust x-axis title position
   svg.append("text")
   .attr("x", container.node().getBoundingClientRect().width / 2)
   .attr("y", 500)
   .attr("text-anchor", "middle")
   .text("Companies");

  // Add y-axis title
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -250)
    .attr("y", 11)
    .attr("text-anchor", "middle")
    .text("Stock Regular Market Price");

  // Create legend
  const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(1100, 10)");

  const legendItems = legend.selectAll(".legend-item")
    .data(chartData)
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr("transform", (d, i) => `translate(0, ${i * 20})`);

  legendItems.append("rect")
    .attr("width", 15)
    .attr("height", 15)
    .attr("fill", d => colorScale(d.symbol));

  legendItems.append("text")
    .attr("x", 25)
    .attr("y", 10)
    .attr("font-size", "12px")
    .text(d => d.longName);

  function getColor(index) {
    const colors = ["steelblue", "green", "red", "orange", "purple"]; // Define an array of colors
    return colors[index % colors.length];
  }


  function updateChart(order) {
    switch (order) {
      case "highest":
        chartData.sort((a, b) => parseFloat(b.regularMarketPrice) - parseFloat(a.regularMarketPrice));
        break;
      case "lowest":
        chartData.sort((a, b) => parseFloat(a.regularMarketPrice) - parseFloat(b.regularMarketPrice));
        break;
      case "alphabetical":
        chartData.sort((a, b) => a.symbol.localeCompare(b.symbol));
        break;
    }
  
    selectedSymbolOrder = chartData.map(d => d.symbol);
    xScale.domain(selectedSymbolOrder);
  
    svg.selectAll("rect")
      .data(chartData, d => d.symbol)
      .transition()
      .duration(800)
      .attr("x", d => xScale(d.symbol))
      .attr("y", d => yScale(parseFloat(d.regularMarketPrice)))
      .attr("height", d => 450 - yScale(parseFloat(d.regularMarketPrice)))
      .attr("fill", (d, i) => getColor(i));
  
    // Update x-axis ticks
    svg.select(".x-axis")
      .transition()
      .duration(800)
      .call(d3.axisBottom(xScale)
        .tickValues(selectedSymbolOrder) // Set tick values to selected order
      );
  
    // Inside the switch statement
    svg.selectAll(".x-axis .tick text")
      .transition()
      .duration(800)
      .text(d => chartData.find(item => item.symbol === d).longName)
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em");
  
  }
  

}



// Function to create the bubble chart
function createBubbleChart(data) {
  const container = d3.select("#chart-container");
  // Create a container for the SVG with a fixed width
  const svgContainer = container.append("div")
    .attr("class", "svg-container")
    .style("width", "100%")
    .style("overflow-x", "auto")

  const svg = svgContainer.append("svg")
    .attr("width", 700*2) // Set an initial width for the SVG
    .attr("height", 750);

  const chartData = data.map(d => ({
    symbol: d.symbol,
    marketCap: parseFloat(d.marketCap),
    forwardPE: parseFloat(d.forwardPE),
    longName: d.longName,
  }));


  const xScale = d3.scaleBand()
    .domain(chartData.map(d => d.symbol))
    .range([100, 1000])
    .padding(0.2);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(chartData, d => d.marketCap)])
    .range([650, 50]);

  const radiusScale = d3.scaleLinear()
    .domain([0, d3.max(chartData, d => d.forwardPE)])
    .range([5, 25]);

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  const tooltip = container.append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  svg.selectAll("circle")
    .data(chartData)
    .enter()
    .append("circle")
    .attr("class", "bubbles")
    .attr("cx", d => xScale(d.symbol) + xScale.bandwidth() / 2)
    .attr("cy", d => yScale(d.marketCap))
    .attr("r", d => radiusScale(d.forwardPE))
    .attr("fill", d => colorScale(d.symbol))
    .on("mouseover", (event, d) => {
      tooltip.transition()
        .duration(200)
        .style("opacity", 1);

      tooltip.html(`Symbol: ${d.symbol}<br/>Market Cap: ${d.marketCap}<br/>Forward P/E: ${d.forwardPE}<br/>Company: ${d.longName}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 30) + "px");
    })
    .on("mouseout", () => {
      tooltip.transition()
        .duration(200)
        .style("opacity", 0);
    })

    .transition()
    .duration(800)
    .delay((d, i) => i * 100)
    .attr("cy", d => yScale(d.marketCap))
    .attr("r", d => radiusScale(d.forwardPE));

  svg.append("g")
    .attr("transform", "translate(0, 650)")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "rotate(45)")
    .style("text-anchor", "start");

  svg.append("g")
    .attr("transform", "translate(100, 0)")
    .call(d3.axisLeft(yScale));

  svg.append("text")
    .attr("x", 400)
    .attr("y", 700)
    .attr("text-anchor", "middle")
    .text("Symbol");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -200)
    .attr("y", 11)
    .attr("text-anchor", "middle")
    .text("Market Cap");

  // Add legend
  const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(950, 5)");

  const legendItems = legend.selectAll(".legend-item")
    .data(chartData)
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr("transform", (d, i) => `translate(0, ${i * 20})`);

  legendItems.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 5)
    .attr("fill", d => colorScale(d.symbol));

  legendItems.append("text")
    .attr("x", 10)
    .attr("y", 5)
    .style("font-size", "12px")
    .text(d => d.symbol);
}

fetchData();















