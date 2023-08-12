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
    console.log(result);

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
  const width = Math.max(transactions.length * 10, 600 * 2) - margin.left - margin.right; // Adjust the width based on data points
  const height = 600 - margin.top - margin.bottom;

  const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


  // Create scales and axes
  const xScale = d3.scaleTime()
    .domain(d3.extent(transactions, d => d.date))
    .range([10, width]);

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
    .on("mouseout", handleMouseOut)
    .on("click", handleClick);

  let selectedCircle = null;

  function handleClick(event, d) {
    if (selectedCircle === this) {
      d3.select(this).attr("stroke", "none");
      selectedCircle = null;
    } else {
      if (selectedCircle) {
        d3.select(selectedCircle).attr("stroke", "none");
      }
      d3.select(this).attr("stroke", "black").attr("stroke-width", "2");
      selectedCircle = this;
    }
  }


  const tooltips = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  function handleMouseOver(event, d) {
    if (selectedCircle !== this) {
      d3.select(this)
        .attr("r", d => Math.sqrt(d.num_shares_own) * 0.02) // Increase the radius on hover
        .attr("opacity", 1);
    }

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
    if (selectedCircle !== this) {
      d3.select(this)
        .attr("r", d => Math.sqrt(d.num_shares_own) * 0.01) // Reset the radius on mouseout
        .attr("opacity", 0.7);
    }

    tooltips.transition()
      .duration(500)
      .style("opacity", 0);
  }

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

  const legendContainer = d3.select("#legend-container");

  const legend = legendContainer.selectAll(".legend")
    .data(colorScale.domain())
    .enter().append("div")
    .attr("class", "legend")
    .style("display", "inline-block")
    .style("margin", "0 10px");

  legend.append("div")
    .style("width", "18px")
    .style("height", "18px")
    .style("background-color", colorScale)
    .style("display", "inline-block");

  legend.append("div")
    .style("display", "inline-block")
    .style("margin-left", "5px")
    .text(d => d);

}

createChart();




async function createTable() {
  const data = await fetchData();
  const table = d3.select("#data-table");

  // Create table rows
  const rows = table.select("tbody")
    .selectAll("tr")
    .data(data)
    .enter()
    .append("tr");

  // Create table cells (td) within rows
  rows.selectAll("td")
    .data(d => [
      d.date,
      d.num_shares_own,
      d.aveg_pricePerShare,
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
  const pageSize = 10;
  let currentPage = 1;
  const totalPages = Math.ceil(data.length / pageSize);

  const prevButton = d3.select("#prev-page");
  const nextButton = d3.select("#next-page");
  const pageInfo = d3.select("#page-info");


  const sortButton = d3.select("#sort-button");

  function applyFilterAndSort() {
    let filteredData = data.slice(); // Make a copy of the original data array

    // Apply filtering based on search input
    const searchText = searchInput.property("value").toLowerCase();
    if (searchText) {
      filteredData = filteredData.filter(d =>
        Object.values(d).some(val =>
          typeof val === 'string' && val.toLowerCase().includes(searchText)
        )
      );
    }

    // Apply sorting based on selected column and order
    const selectedColumn = sortSelect.property("value");
    const sortOrder = d3.select("#sort-order").property("value");

    filteredData.sort((a, b) => {
      if (sortOrder === "asc") {
        return d3.ascending(a[selectedColumn], b[selectedColumn]);
      } else {
        return d3.descending(a[selectedColumn], b[selectedColumn]);
      }
    });

    // Re-render the table with filtered and sorted data
    renderPage(currentPage, filteredData);
  }




  function renderPage(page, data) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, data.length);
    const pageData = data.slice(startIndex, endIndex);

    // Clear existing rows
    table.select("tbody").selectAll("tr").remove();

    // Create table rows
    const newRows = table.select("tbody")
      .selectAll("tr")
      .data(pageData)
      .enter()
      .append("tr");

    // Create table cells (td) within rows
    newRows.selectAll("td")
      .data(d => [
        d.date,
        d.num_shares_own,
        d.aveg_pricePerShare,
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
        if (i === 0) {
          const [date, time] = d.split("T");
          return `${date}\n${time}`;
        } else {
          return d;
        }
      });

    // Update page info
    pageInfo.text(`Page ${page} of ${totalPages}`);

    // Update button states
    prevButton.attr("disabled", page === 1 ? true : null);
    nextButton.attr("disabled", page === totalPages ? true : null);
  }



  // Initial rendering
  renderPage(currentPage, data);

  // Previous and Next button click events
  prevButton.on("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderPage(currentPage, data);
    }
  });

  nextButton.on("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderPage(currentPage, data);
    }
  });

  // Sorting button click event
  sortButton.on("click", applyFilterAndSort);

  // Apply filtering and sorting on input change
  const searchInput = d3.select("#search-input");
  const sortSelect = d3.select("#sort-select");
  const sortOrderSelect = d3.select("#sort-order");
  // sortOrderSelect.on("change", applyFilterAndSort);
  // searchInput.on("input", applyFilterAndSort);
  // sortSelect.on("change", applyFilterAndSort);

  // Tooltip behavior
  table.selectAll("td")
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



