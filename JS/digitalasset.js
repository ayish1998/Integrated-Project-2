const url = 'https://apistocks.p.rapidapi.com/daily?symbol=AAPL&dateStart=2021-07-01&dateEnd=2021-07-31';
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '24dbfe44c4msha0165c201d9d8b4p10f359jsn843b7d2bdb3a',
    'X-RapidAPI-Host': 'apistocks.p.rapidapi.com',
  },
};

async function fetchData() {
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result);

    const data = result.Results;
    console.log(data);

    // Define the dimensions of the chart
    const width = 800;
    const height = 400;
    const margin = { top: 30, right: 30, bottom: 50, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create the SVG container for the chart
    const svg = d3.select("#chart-containerrr")
      .append("svg")
      .attr("class", "chart")
      .attr("width", width)
      .attr("height", height);

    const chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Extract necessary information for the bubble chart
    const dates = data.map((item) => item.Date);
    const openPrices = data.map((item) => item.Open);
    const closePrices = data.map((item) => item.Close);
    const highPrices = data.map((item) => item.High);
    const lowPrices = data.map((item) => item.Low);
    const volumes = data.map((item) => item.Volume);

    // Create the x-scale and y-scale based on the data
    const xScale = d3.scaleLinear()
      .domain([d3.min(lowPrices), d3.max(highPrices)])
      .range([0, innerWidth]);

    const yScale = d3.scaleBand()
      .domain(dates)
      .range([0, innerHeight])
      .paddingInner(0.2)
      .paddingOuter(0.2);

    const radiusScale = d3.scaleSqrt()
      .domain([0, d3.max(volumes)])
      .range([0, 15]); // Increased the maximum radius to 15

    // Define different colors for the bubbles
    const colors = d3.scaleOrdinal(d3.schemeCategory10);

    // Create the bubbles for the stock volumes
    const bubbles = chartGroup.selectAll(".bubble")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "bubble")
      .attr("cx", 0)
      .attr("cy", (d) => yScale(d.Date) + yScale.bandwidth() / 2)
      .attr("r", (d) => radiusScale(d.Volume))
      .attr("fill", (d, i) => colors(i))
      .on("mouseover", handleBubbleMouseOver)
      .on("mouseout", handleBubbleMouseOut)
      .on("click", handleBubbleClick);

    // Create the x-axis and y-axis
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Add the axes to the chart
    chartGroup.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(xAxis);

    chartGroup.append("g")
      .attr("class", "y-axis")
      .call(yAxis);

    // Add axis labels and title
    svg.append("text")
      .attr("class", "x-axis-label")
      .attr("x", width / 2)
      .attr("y", height - margin.bottom / 2)
      .style("text-anchor", "middle")
      .text("Price");

    svg.append("text")
      .attr("class", "y-axis-label")
      .attr("x", -height / 2)
      .attr("y", margin.left / 2)
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "middle")
      .text("");

    svg.append("text")
      .attr("class", "chart-title")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .style("text-anchor", "middle")
      .text(" Analyze historical assets data");

    // Add interactivity and tooltips
    const tooltips = d3.select("#tooltips");

    function handleBubbleMouseOver(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("fill", "orange");

      tooltips.style("opacity", 1)
        .html(`
          <strong>Date:</strong> ${d.Date}<br>
          <strong>Open:</strong> ${d.Open}<br>
          <strong>Close:</strong> ${d.Close}<br>
          <strong>Volume:</strong> ${d.Volume}
        `)
        .style("right", event.pageX + "px")
        .style("top", event.pageY + "px");
    }

    function handleBubbleMouseOut() {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("fill", (d, i) => colors(i));

      tooltips.style("opacity", 0);
    }

    function handleBubbleClick(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("fill", "red");

      console.log("Clicked bubble:", d);
    }

    bubbles.transition()
      .duration(800)
      .delay((d, i) => i * 100)
      .attr("cx", (d) => xScale((d.Low + d.High) / 2));

    chartGroup.selectAll(".x-axis, .y-axis")
      .style("opacity", 0)
      .transition()
      .duration(800)
      .style("opacity", 1);
  } catch (error) {
    console.error(error);
  }
}

fetchData();