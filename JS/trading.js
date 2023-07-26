async function fetchData() {
    const url = 'https://mboum-finance.p.rapidapi.com/v1/sec/form4';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'fc67e2b7c2mshc96a0a884cc6c68p17e57fjsn3458cd46e49a',
            'X-RapidAPI-Host': 'mboum-finance.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);
        return result.form_4_filings;

    } catch (error) {
        console.error(error);
        return [];
    }
}
async function drawBubbleChart() {
  const data = await fetchData();

  const width = 1000;
  const height = 800;
  const margin = 40;

  const svg = d3.select("#chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

  const maxTotalValue = d3.max(data, d => d.tot_value);
  const maxShares = d3.max(data, d => +d.num_shares_own);
  const maxPrice = d3.max(data, d => +d.aveg_pricePerShare);

  const radiusScale = d3.scaleSqrt()
      .domain([0, maxTotalValue])
      .range([0, 50]);

  const xScale = d3.scaleLinear()
      .domain([0, maxPrice])
      .range([margin, width - margin]);

  const yScale = d3.scaleLinear()
      .domain([0, maxShares])
      .range([height - margin, margin]);

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  // Create tooltips
  const tooltip = d3.select("#chart")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(+d.aveg_pricePerShare))
      .attr("cy", d => yScale(+d.num_shares_own))
      .attr("r", d => radiusScale(d.tot_value))
      .attr("fill", d => colorScale(d.relationship))
      .attr("opacity", 0.7)
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);

  function handleMouseOver(d) {
      // Enlarge the bubble when hovered
      d3.select(this)
          .transition()
          .duration(200)
          .attr("r", d => radiusScale(d.tot_value) + 10)
          .attr("opacity", 1);

      // Show the tooltip with additional details about the insider's trading activity
      tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);

      // Calculate the position for the tooltip based on the mouse position
      const [xPos, yPos] = d3.pointer(event);

      tooltip.style("left", `${xPos + 10}px`)
          .style("top", `${yPos - 10}px`)
          .html(
              `Insider: ${d.relationship}<br/>` +
              `Company: ${d.symbol}<br/>` +
              `Number of Shares: ${d.num_shares_own}<br/>` +
              `Average Price per Share: ${d.aveg_pricePerShare}<br/>` +
              `Total Value: ${d.tot_value}`
          );
  }

  function handleMouseOut(d) {
      // Restore the original size of the bubble when not hovered
      d3.select(this)
          .transition()
          .duration(200)
          .attr("r", d => radiusScale(d.tot_value))
          .attr("opacity", 0.7);

      // Hide the tooltip when the mouse is moved away from the bubble.
      tooltip.transition()
          .duration(500)
          .style("opacity", 0);
  }

  // Add axes titles
  svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .text("Average Price per Share");

  svg.append("text")
      .attr("x", 10)
      .attr("y", height / 2)
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90, 10, " + height / 2 + ")")
      .text("Number of Shares Owned");

  // Append axes
  svg.append("g")
      .attr("transform", `translate(0, ${height - margin})`)
      .call(d3.axisBottom(xScale));

  svg.append("g")
      .attr("transform", `translate(${margin}, 0)`)
      .call(d3.axisLeft(yScale));
}


drawBubbleChart();

async function createTable() {
    const data = await fetchData();
    const table = d3.select("#data-table");

    // Create table rows
    const rows = table.selectAll("tr")
      .data(data)
      .enter()
      .append("tr");

    // Create table cells (td) within rows
    rows.selectAll("td")
      .data(d => [
        d.date,
        d.num_shares_own,
        d.relationship,
        d.reportingOwnerAddress,
        d.sum_transactionShares,
        d.symbol,
        d.tot_value,
        d.transactionCode
      ])
      .enter()
      .append("td")
      .text((d, i) => {
        if (i === 0) { // Check if it's the first column (Date column)
          // Format the date and time separately with a line break
          const [date, time] = d.split("T");
          return `${date}\n${time}`;
        } else {
          return d;
        }
      });

    // Add click event to table headers for sorting
    table.selectAll("th")
      .style("cursor", "pointer")
      .on("click", function (event, d) {
        const header = d3.select(this).text().toLowerCase();
        sortTable(header);
      });

    // Add tooltips to table cells
    rows.selectAll("td")
      .on("mouseover", function (event, d) {
        const tooltip = d3.select("#tooltip");
        tooltip.style("opacity", 0.9);
        tooltip.html(d)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 30) + "px");
      })
      .on("mouseout", function () {
        const tooltip = d3.select("#tooltip");
        tooltip.style("opacity", 0);
      });
  }

  createTable();
