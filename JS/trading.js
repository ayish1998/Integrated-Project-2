// Fetch data from the API
async function fetchData() {
  const url = 'https://mboum-finance.p.rapidapi.com/v1/sec/form4';
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '24dbfe44c4msha0165c201d9d8b4p10f359jsn843b7d2bdb3a',
      'X-RapidAPI-Host': 'mboum-finance.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result.form_4_filings;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Create the chart
async function createChart() {
  const data = await fetchData();

  const transactions = data.map(entry => ({
    date: new Date(entry.date),
    symbol: entry.symbol,
    relationship: entry.relationship,
    aveg_pricePerShare: +entry.aveg_pricePerShare,
    num_shares_own: +entry.num_shares_own,
    tot_value: +entry.tot_value
  }));

  const margin = { top: 50, right: 50, bottom: 50, left: 70 };
  const width = 900 - margin.left - margin.right;
  const height = 650 - margin.top - margin.bottom;

  const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Create scales and axes
  const xScale = d3.scaleTime()
    .domain(d3.extent(transactions, d => d.date))
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(transactions, d => d.aveg_pricePerShare)])
    .range([height, 0]);

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

  svg.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(yScale));



  svg.selectAll("circle")
    .data(transactions)
    .enter().append("circle")
    .attr("cx", d => xScale(d.date))
    .attr("cy", d => yScale(d.aveg_pricePerShare))
    .attr("r", d => Math.sqrt(d.num_shares_own) * 0.01)
    .attr("fill", d => colorScale(d.relationship))
    .attr("opacity", 0.7)
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);

  const tooltips = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  function handleMouseOver(event, d) {
    tooltips.transition()
      .duration(200)
      .style("opacity", 0.9);
    tooltips.html(
      `Date: ${d.date.toISOString().split("T")[0]}<br>
       Symbol: ${d.symbol}<br>
       Relationship: ${d.relationship}<br>
       Average Price: $${d.aveg_pricePerShare.toFixed(2)}<br>
       Shares Owned: ${d.num_shares_own}<br>
       Total Value: $${d.tot_value.toFixed(2)}`
    )
      .style("left", `${event.pageX}px`)
      .style("top", `${event.pageY - 28}px`);
  }

  function handleMouseOut() {
    tooltips.transition()
      .duration(500)
      .style("opacity", 0);
  }

  // Add chart title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .text("Insider Trading Transactions");

  // Add x-axis label
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 5)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Date");

  // Add y-axis label
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - height / 2)
    .attr("y", -margin.left + 15)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Average Price Per Share ($)");

  // Legend
  const legend = svg.selectAll(".legend")
    .data(colorScale.domain())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => `translate(0,${i * 20})`);

  legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", colorScale);

  legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(d => d);
}

createChart();




async function createTable() {
  const data = await fetchData();
  const table = d3.select("#data-table");

   // Create a responsive container for the table
   const tableContainer = table.append("div")
   .attr("class", "table-container");

    // Create the actual table within the container
  const dataTable = tableContainer.append("table");

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
    dataTable.selectAll("th")
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

    // Pagination
  const itemsPerPage = 10;
  let currentPage = 1;

  function updatePagination() {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    d3.select("#page-info").text(`Page ${currentPage} of ${totalPages}`);
    d3.select("#prev-page").attr("disabled", currentPage === 1 ? true : null);
    d3.select("#next-page").attr("disabled", currentPage === totalPages ? true : null);
  }

  function updateTable(pageData) {
    const table = d3.select("#data-table");
    const rows = table.selectAll("tr").data(pageData, d => d.reportingOwnerAddress);
  
    // Exit: Remove any rows that are no longer needed
    rows.exit().remove();
  
    // Enter + Update: Create or update rows and cells
    const newRows = rows.enter().append("tr");
    rows.merge(newRows).selectAll("td")
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
  
    // Pagination controls
    updatePagination();
  }

  updateTable();
  updatePagination();

  d3.select("#prev-page").on("click", () => {
    if (currentPage > 1) {
      currentPage--;
      updateTable();
      updatePagination();
    }
  });

  d3.select("#next-page").on("click", () => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      updateTable();
      updatePagination();
    }
  });

  // Search and Filtering
  d3.select("#search-input").on("input", () => {
    const searchTerm = d3.event.target.value.toLowerCase();
    const filteredData = data.filter(item => {
      return Object.values(item).some(value => value.toLowerCase().includes(searchTerm));
    });

}

createTable();



