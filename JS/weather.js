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

  // Rapid API
  const apiUrl = 'https://weatherbit-v1-mashape.p.rapidapi.com/forecast/daily';
  const headers = {
    'X-RapidAPI-Key': '1bb0b0932amshadc927c7f447973p1e25e2jsn0eb548483795',
    'X-RapidAPI-Host': 'weatherbit-v1-mashape.p.rapidapi.com'
  };

  const getCurrentLocationWeather = async () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          try {
            const response = await fetch(`${apiUrl}?lat=${latitude}&lon=${longitude}&days=7`, {
              headers: headers
            });
            const data = await response.json();
            resolve(data);
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  const renderHeatmap = (weatherData) => {
    

    const variables = ['temp', 'uv', 'precip', 'rh', 'wind_spd'];
    const variableLabels = {
      temp: 'Temperature',
      uv: 'UV Index',
      precip: 'Precipitation',
      rh: 'Relative Humidity',
      wind_spd: 'Wind Speed'
    };
    const dates = weatherData.data.map((day) => day.valid_date);
    const formatTime = d3.timeFormat("%d %B, %Y");

    const xScale = d3.scaleBand()
      .domain(dates)
      .range([padding, width - padding])
      .padding(0.1);

    const yScale = d3.scaleBand()
      .domain(variables)
      .range([padding, height - padding])
      .padding(0.1);

    const colorScales = {
      temp: d3.scaleSequential()
        .interpolator(d3.interpolateReds),
      uv: d3.scaleSequential()
        .interpolator(d3.interpolateGreens),
      precip: d3.scaleSequential()
        .interpolator(d3.interpolatePurples),
      rh: d3.scaleSequential()
        .interpolator(d3.interpolateBlues),
      wind_spd: d3.scaleSequential()
        .interpolator(d3.interpolateOranges)
    };

    variables.forEach((variable) => {
      const minVal = d3.min(weatherData.data, (day) => day[variable]);
      const maxVal = d3.max(weatherData.data, (day) => day[variable]);
      colorScales[variable].domain([minVal, maxVal]);
    });

    const svg = d3.select('svg');
    const tooltip = d3.select('#tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden');

    svg.append('g')
      .selectAll('g')
      .data(variables)
      .enter()
      .append('g')
      .attr('class', 'variable-group')
      .attr('transform', (d) => `translate(50, ${yScale(d)})`)
      .selectAll('rect')
      .data((variable) => weatherData.data.map((day) => ({ variable, day })))
      .enter()
      .append('rect')
      .attr('class', 'cell')
      .attr('x', (d) => xScale(d.day.valid_date))
      .attr('y', 0)
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('fill', (d) => colorScales[d.variable](d.day[d.variable]))
      .attr('data-variable', (d) => d.variable)
      .attr('data-value', (d) => d.day[d.variable] || '')
      .on('mouseover', function (event, d) {
        const cell = d3.select(this);

        // Get the mouse coordinates relative to the SVG
        const [x, y] = d3.pointer(event);

        // Get the position and dimensions of the cell
        const cellPosition = cell.node().getBoundingClientRect();
        const cellX = cellPosition.x;
        const cellY = cellPosition.y;
        const cellWidth = cellPosition.width;

        // Calculate the tooltip position relative to the cell
        const tooltipX = cellX + cellWidth / 2;
        const tooltipY = cellY;

        tooltip.transition()
          .style('visibility', 'visible')
          .style('left', `${tooltipX}px`)
          .style('top', `${tooltipY}px`);

        tooltip.text(`${variableLabels[d.variable]}: ${d.day[d.variable]}`);


        tooltip.attr('data-date', d.day.valid_date);
      })
      .on('mouseout', function (event, d) {
        tooltip.transition()
          .style('visibility', 'hidden');
      });

    const xAxis = d3.axisBottom(xScale)
      .tickFormat((date) => formatTime(new Date(date)));
    const yAxis = d3.axisLeft(yScale)
      .tickFormat((variable) => variableLabels[variable]);

    svg.append('g')
      .call(xAxis)
      .attr('id', 'x-axis')
      .attr('transform', `translate(50, ${height - padding})`);

    svg.append('g')
      .call(yAxis)
      .attr('id', 'y-axis')
      .attr('transform', `translate(${padding + 50}, 0)`);

    svg.append('text')
      .attr('class', 'x-axis-label')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', height - 20)
      .text('Date');

    svg.append('text')
      .attr('class', 'y-axis-label')
      .attr('text-anchor', 'middle')
      .attr('x', -height / 2)
      .attr('y', 25)
      .attr('transform', 'rotate(-90)')
      .text('Variable');
  };

  const width = 1200;
  const height = 600;
  const padding = 80;

  const fetchDataAndRenderHeatmap = async () => {
    try {
      const weatherData = await getCurrentLocationWeather();
      renderHeatmap(weatherData);
    } catch (error) {
      console.error(error);
    }
  };

  fetchDataAndRenderHeatmap();
});