

async function fetchInfo() {
  const url = 'https://mboum-finance.p.rapidapi.com/co/collections/undervalued_growth_stocks?start=0';
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'b059a9314dmshc7cfa4f532ef633p134d10jsne9b89f2993c7',
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

  const svg = d3.select("#chart-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const tooltip = d3.select("#chart-container")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

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
    .on("mouseover", (event, d) => {
      tooltip.transition()
        .duration(200)
        .style("opacity", 0.9);

      tooltip.html(`<strong>${d.displayName}</strong><br>
        Market Cap: $${d.marketCap.toFixed(2)}B<br>
        PE Ratio: ${d.trailingPE.toFixed(2)}<br>
        PEG Ratio: ${(d.epsForward / d.epsTrailingTwelveMonths).toFixed(2)}<br>
        Earnings Growth Rate: ${(d.epsForward * 100).toFixed(2)}%<br>
        Fifty Two Week Range: ${d.fiftyTwoWeekRange}<br>
        Dividend Yield: ${d.dividendYield.toFixed(2)}%<br>
        Trailing PE: ${d.trailingPE.toFixed(2)}<br>
        Forward PE: ${d.forwardPE.toFixed(2)}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 30) + "px");
    })
    .on("mouseout", () => {
      tooltip.transition()
        .duration(200)
        .style("opacity", 0);
    });

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

  // Bubble size legend
  const legendContainer = svg.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${width - 100}, ${height - 200})`);

  const legendData = [1, 10, 30]; // You can adjust these values based on your data

  // Adjust these values based on your layout
  const xCircle = 100;
  const yCircle = 100;
  const xLabel = 150;

  // Add legend: circles
  legendContainer.selectAll("legend")
    .data(legendData)
    .enter()
    .append("circle")
    .attr("cx", xCircle)
    .attr("cy", d => yCircle - marketCapScale(d))
    .attr("r", d => marketCapScale(d))
    .style("fill", "none")
    .attr("stroke", "black");

  // Add legend: segments
  legendContainer.selectAll("legend")
    .data(legendData)
    .enter()
    .append("line")
    .attr('x1', d => xCircle + marketCapScale(d))
    .attr('x2', xLabel)
    .attr('y1', d => yCircle - marketCapScale(d))
    .attr('y2', d => yCircle - marketCapScale(d))
    .attr('stroke', 'black')
    .style('stroke-dasharray', ('2,2'));

  // Add legend: labels
  legendContainer.selectAll("legend")
    .data(legendData)
    .enter()
    .append("text")
    .attr('x', xLabel)
    .attr('y', d => yCircle - marketCapScale(d))
    .text(d => d)
    .style("font-size", 10)
    .attr('alignment-baseline', 'middle');
}
fetchInfo();

let isChartCreated = false; // Define isChartCreated outside the function

async function fetchData() {
  const url = 'https://mboum-finance.p.rapidapi.com/co/collections/undervalued_growth_stocks?start=0';
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'b059a9314dmshc7cfa4f532ef633p134d10jsne9b89f2993c7',
      'X-RapidAPI-Host': 'mboum-finance.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    const table = document.querySelector('table');
    const tbody = table.querySelector('tbody');

    data.quotes.forEach(stock => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${stock.symbol}</td>
        <td>${stock.displayName}</td>
        <td>${stock.regularMarketPrice}</td>
        <td>${stock.dividendYield}</td>
        <td>${stock.trailingPE}</td>
        <td>${stock.marketCap}</td>
        <td>${stock.fiftyTwoWeekHighChangePercent}</td>
        <td>${stock.averageDailyVolume3Month}</td>
        <td>${stock.exchange}</td>

        <td>
          <div id="${stock.symbol}-price-chart"></div>
        </td>
        <td>
          <div id="${stock.symbol}-dividend-chart"></div>
        </td>
      `;
      tbody.appendChild(row);

      // Create Price Chart
      // createPriceChart(stock);

      // Create Dividend Yield Chart
      // createDividendChart(stock);
    });

    if (!isChartCreated) {
      const combinedData = data.quotes.map(stock => ({
        symbol: stock.symbol,
        priceData: [stock.regularMarketPrice, stock.fiftyDayAverage, stock.twoHundredDayAverage]
      }));

      createCombinedPriceChart(combinedData);
      isChartCreated = true;
    }

  } catch (error) {
    console.error(error);
  }
}


fetchData();

  // function createPriceChart(stock) {
  //   const margin = { top: 10, right: 30, bottom: 30, left: 60 };
  //   const width = 250 - margin.left - margin.right;
  //   const height = 120 - margin.top - margin.bottom;

  //   const svg = d3.select(`#${stock.symbol}-price-chart`)
  //     .append("svg")
  //     .attr("width", width + margin.left + margin.right)
  //     .attr("height", height + margin.top + margin.bottom)
  //     .append("g")
  //     .attr("transform", `translate(${margin.left},${margin.top})`);

  //   const priceData = [
  //     stock.regularMarketPrice,  // Example: Current price
  //     stock.fiftyDayAverage,     // Example: 50-day moving average
  //     stock.twoHundredDayAverage // Example: 200-day moving average
  //   ];

  //   const x = d3.scaleLinear().domain([0, priceData.length - 1]).range([0, width]);
  //   const y = d3.scaleLinear().domain([0, d3.max(priceData)]).range([height, 0]);

  //   const line = d3.line()
  //     .x((d, i) => x(i))
  //     .y(d => y(d));

  //   svg.append("path")
  //     .datum(priceData)
  //     .attr("class", "line")
  //     .attr("d", line);
  // }

  // function createDividendChart(stock) {
  //   const margin = { top: 10, right: 30, bottom: 30, left: 60 };
  //   const width = 250 - margin.left - margin.right;
  //   const height = 120 - margin.top - margin.bottom;

  //   const svg = d3.select(`#${stock.symbol}-dividend-chart`)
  //     .append("svg")
  //     .attr("width", width + margin.left + margin.right)
  //     .attr("height", height + margin.top + margin.bottom)
  //     .append("g")
  //     .attr("transform", `translate(${margin.left},${margin.top})`);

  //   const dividendData = [
  //     stock.dividendYield,              // Example: Dividend Yield
  //     stock.trailingAnnualDividendYield // Example: Trailing Annual Dividend Yield
  //   ];

  //   const x = d3.scaleLinear().domain([0, dividendData.length - 1]).range([0, width]);
  //   const y = d3.scaleLinear().domain([0, d3.max(dividendData)]).range([height, 0]);

  //   const line = d3.line()
  //     .x((d, i) => x(i))
  //     .y(d => y(d));

  //   svg.append("path")
  //     .datum(dividendData)
  //     .attr("class", "line")
  //     .attr("d", line);
  // }



 function createCombinedPriceChart(data) {
    const margin = { top: 30, right: 30, bottom: 70, left: 70 };
    const width = 800*3 - margin.left - margin.right;
    const height = 7 - margin.top - margin.bottom;

    const svg = d3.select("#chart-container2")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .call(d3.zoom().on("zoom", handleZoom))
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const colors = d3.scaleOrdinal(d3.schemeCategory10);

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    // Define a custom curve generator for the lines
    const curveGenerator = d3.line()
      .x((d, i) => x(i))
      .y(d => y(d))
      .curve(d3.curveBasis); // Choose the curve type you like

    x.domain([0, data[0].priceData.length - 1]);
    y.domain([0, d3.max(data, d => d3.max(d.priceData))]);

    const series = svg.selectAll(".series")
      .data(data)
      .enter().append("g")
      .attr("class", "series");

    series.append("path")
      .attr("class", "line")
      .attr("d", d => curveGenerator(d.priceData))
      .style("stroke", (d, i) => colors(i))
      .style("fill", "none");

    // Add x-axis
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Add y-axis
    svg.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y));

    // Add x-axis title
    svg.append("text")
      .attr("transform", `translate(${width / 2},${height + margin.top + 40})`)
      .style("text-anchor", "middle")
      .text("Time");

    // Add y-axis title
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Price");

    // Add legend
    const legend = svg.selectAll(".legend")
      .data(data)
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(0,${i * 20})`);

    legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", (d, i) => colors(i));

    legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(d => d.symbol);
  }

  function handleZoom(event) {
    const transform = event.transform;
    d3.select("#chart-container > g")
      .attr("transform", transform);
  }




