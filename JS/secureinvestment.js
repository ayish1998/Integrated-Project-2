async function fetchData() {
  try {
    const url = 'https://interest-rate-by-api-ninjas.p.rapidapi.com/v1/interestrate';
    const apiKey = '24dbfe44c4msha0165c201d9d8b4p10f359jsn843b7d2bdb3a';
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'interest-rate-by-api-ninjas.p.rapidapi.com'
      }
    };

    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result);

    const data = result.central_bank_rates.map((item, index) => ({
      rank: index + 1,
      country: item.country,
      rate: parseFloat(item.rate_pct),
      last_updated: item.last_updated
    }));

    // Define the dimensions of the chart
    const width = 900;
    const height = 500;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
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

    // Define the x-scale and y-scale for the chart
    const xScale = d3.scaleBand()
      .domain(data.map((d) => d.country))
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => d.rate)])
      .range([innerHeight, 0]);

    // Create the bars with different colors
    const colorScale = d3.scaleOrdinal(d3.schemeSet3); // Using a different color scheme
    const bars = chartGroup.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.country))
      .attr("y", innerHeight)
      .attr("width", xScale.bandwidth())
      .attr("height", 0)
      .attr("fill", (d) => colorScale(d.rank)) // Use the new color scale based on the rank
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("click", handleClick);

    bars.transition()
      .duration(800)
      .delay((d, i) => i * 100)
      .attr("y", (d) => yScale(d.rate))
      .attr("height", (d) => innerHeight - yScale(d.rate));

    function handleMouseOver(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("fill", "orange");

      const tooltip = d3.select("#tooltips");
      tooltip.style("opacity", 1)
        .style("left", event.pageX + "px")
        .style("top", event.pageY + "px")
        .html(`
          <strong>Rank:</strong> ${d.rank}<br>
          <strong>Country:</strong> ${d.country}<br>
          <strong>Rate:</strong> ${d.rate}%<br>
          <strong>Last Updated:</strong> ${d.last_updated}
        `);
    }

    function handleMouseOut() {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("fill", (d) => colorScale(d.rank)); // Restore the new color scale based on the rank

      const tooltip = d3.select("#tooltips");
      tooltip.style("opacity", 0);
    }

    function handleClick(event, d) {
      const selectedBar = d3.select(this);
      const isActive = selectedBar.classed("active");

      // Toggle active class on click
      selectedBar.classed("active", !isActive);

      // Adjust bar color
      selectedBar.attr("fill", (d) => isActive ? colorScale(d.rank) : "red");

      // Add custom animation
      if (isActive) {
        selectedBar.transition()
          .duration(500)
          .attr("y", innerHeight)
          .attr("height", 0);
      } else {
        selectedBar.transition()
          .duration(800)
          .attr("y", (d) => yScale(d.rate))
          .attr("height", (d) => innerHeight - yScale(d.rate));
      }
    }

    // Add chart title
    svg.append("text")
      .attr("class", "chart-title")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .text("Interest Rate");

    // Add y-axis label
    svg.append("text")
      .attr("class", "axis-label")
      .attr("x", -height / 2)
      .attr("y", margin.left / 2)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("Rate (%)");

    // Add x-axis label
    svg.append("text")
      .attr("class", "axis-label")
      .attr("x", width / 2)
      .attr("y", height - margin.bottom / 4)
      .attr("text-anchor", "middle")
      .text("");

    // Add x-axis ticks and labels
    const xAxis = svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(${margin.right}, ${margin.top + innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-0.8em")
      .attr("dy", "0.15em")
      .attr("transform", "rotate(-45)")
      .attr("opacity", 0)
      .transition()
      .duration(800)
      .delay((d, i) => i * 100)
      .attr("opacity", 1);

    // Add y-axis ticks and labels
    svg.append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.right}, ${margin.top})`)
      .call(d3.axisLeft(yScale));

  } catch (error) {
    console.error(error);
  }
}

// Call the function to fetch data and create the chart
fetchData();