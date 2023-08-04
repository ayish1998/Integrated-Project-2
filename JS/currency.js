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



