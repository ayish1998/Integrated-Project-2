async function fetchCurrencies() {
  const url = 'https://currency-conversion-and-exchange-rates.p.rapidapi.com/symbols';
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'fc67e2b7c2mshc96a0a884cc6c68p17e57fjsn3458cd46e49a',
      'X-RapidAPI-Host': 'currency-conversion-and-exchange-rates.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    const symbols = data.symbols;

    console.log(symbols);

    // Sort the symbols alphabetically
    const sortedSymbols = Object.keys(symbols).sort();

    const fromCurrencySelect = document.getElementById('fromCurrency');
    const toCurrencySelect = document.getElementById('toCurrency');

    // Populate the dropdowns with sorted currencies
    for (const symbol of sortedSymbols) {
      const option = document.createElement('option');
      option.value = symbol;
      option.textContent = `${symbol} - ${symbols[symbol]}`;
      fromCurrencySelect.appendChild(option);

      const option2 = document.createElement('option');
      option2.value = symbol;
      option2.textContent = `${symbol} - ${symbols[symbol]}`;
      toCurrencySelect.appendChild(option2);
    }
  } catch (error) {
    console.error(error);
  }
}


async function convertCurrency() {
  const amount = parseFloat(document.getElementById('amount').value);
  const fromCurrency = document.getElementById('fromCurrency').value;
  const toCurrency = document.getElementById('toCurrency').value;

  if (isNaN(amount)) {
    alert('Please enter a valid amount.');
    return;
  }

  try {
    const url = `https://currency-conversion-and-exchange-rates.p.rapidapi.com/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'fc67e2b7c2mshc96a0a884cc6c68p17e57fjsn3458cd46e49a',
        'X-RapidAPI-Host': 'currency-conversion-and-exchange-rates.p.rapidapi.com'
      }
    };

    const response = await fetch(url, options);
    const resultData = await response.json();

    const rate = resultData.info.rate.toFixed(6);
    const rawDate = new Date(resultData.date);
    const formattedDate = rawDate.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const convertedAmount = resultData.result.toFixed(2);
    const fromCurrencyName = resultData.query.from;
    const toCurrencyName = resultData.query.to;

    const conversionText = `
  <div id="conversionResult">
    <div id="amount">${amount} ${fromCurrencyName} = <br> <span> ${convertedAmount} ${toCurrencyName} </span></div>
    <div id="rate"> Rate: 1 ${fromCurrencyName} = ${rate} ${toCurrencyName}</div>
  </div>
  
  <div id="date">Last updated: ${formattedDate}</div>
`;
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = conversionText;

    // Hide the Convert button
    document.getElementById('convertBtn').style.display = 'none';
  } catch (error) {
    console.error(error);
    const resultElement = document.getElementById('result');
    resultElement.textContent = 'Conversion failed. Please try again later.';
  }
}

// Clear the result and show the Convert button when a new currency is selected
function clearResult() {
  const resultElement = document.getElementById('result');
  resultElement.textContent = '';
  document.getElementById('convertBtn').style.display = 'block';
}


document.addEventListener('DOMContentLoaded', () => {
  fetchCurrencies();
  document.getElementById('convertBtn').addEventListener('click', convertCurrency);
  document.getElementById('swapBtn').addEventListener('click', swapCurrencies);

  // Call clearResult when new currency selections are made
  document.getElementById('fromCurrency').addEventListener('change', clearResult);
  document.getElementById('toCurrency').addEventListener('change', clearResult);
});


function swapCurrencies() {
  const fromCurrencySelect = document.getElementById('fromCurrency');
  const toCurrencySelect = document.getElementById('toCurrency');

  const fromCurrencyValue = fromCurrencySelect.value;
  const toCurrencyValue = toCurrencySelect.value;

  // Swap the selected currencies
  fromCurrencySelect.value = toCurrencyValue;
  toCurrencySelect.value = fromCurrencyValue;
}




//     const fetchData = async () => {
//         const ratesUrl = 'https://currency-conversion-and-exchange-rates.p.rapidapi.com/latest?from=USD&to=EUR%2CGBP';
//         const countryCodeUrl = 'https://geosource-api.p.rapidapi.com/currencyByCountry.php?country=us';
//         const ratesHeaders = {
//             'X-RapidAPI-Key': 'fc67e2b7c2mshc96a0a884cc6c68p17e57fjsn3458cd46e49a',
//             'X-RapidAPI-Host': 'currency-conversion-and-exchange-rates.p.rapidapi.com'
//         };
//         const countryCodeHeaders = {
//             'X-RapidAPI-Key': 'b059a9314dmshc7cfa4f532ef633p134d10jsne9b89f2993c7',
//             'X-RapidAPI-Host': 'geosource-api.p.rapidapi.com'
//         };

//         try {
//             const ratesResponse = await fetch(ratesUrl, { method: 'GET', headers: ratesHeaders });
//             const countryCodeResponse = await fetch(countryCodeUrl, { method: 'GET', headers: countryCodeHeaders });

//             const ratesResult = await ratesResponse.json();
//             const countryCodeResult = await countryCodeResponse.json();

//             const currencyToCountryMap = {}; // Initialize an empty mapping

//             // Check if ratesResult and ratesResult.rates are defined
//             if (ratesResult && ratesResult.rates) {
//                 // Map currency codes to country codes and rates
//                 for (const currency of countryCodeResult) {
//                     const countryCode = currency.CountryCode;
//                     if (ratesResult.rates.hasOwnProperty(currency.Currency)) {
//                         currencyToCountryMap[countryCode] = ratesResult.rates[currency.Currency];
//                     }
//                 }
//             }

//             visualizeMap(currencyToCountryMap);
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     const visualizeMap = (currencyToCountryMap) => {
// d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson').then((data) => {
//     const svg = d3.select('#map').append('svg')
//         .attr('width', 900)
//         .attr('height', 500);

//     // Create a color scale based on currency rates
//     const colorScale = d3.scaleSequential(d3.interpolateViridis)
//         .domain([0, d3.max(Object.values(currencyToCountryMap))]);

//     // Create a map projection
//     const projection = d3.geoMercator()
//         .fitSize([800, 500], data);

//     // Create a path generator
//     const path = d3.geoPath().projection(projection);

//     // Create a tooltip
//     const tooltip = d3.select('body').append('div')
//         .attr('class', 'tooltip')
//         .style('position', 'absolute')
//         .style('visibility', 'hidden')
//         .style('background-color', 'rgba(0, 0, 0, 0.7)')
//         .style('color', 'white')
//         .style('font-size', '12px')
//         .style('border-radius', '4px')
//         .style('padding', '8px')
//         .style('pointer-events', 'none');

//     // Draw map
//     svg.selectAll('path')
//         .data(data.features)
//         .enter().append('path')
//         .attr('d', path)
//         .attr('fill', (d) => {
//             const countryCode = d.properties.ISO_A2;
//             const rate = currencyToCountryMap[countryCode];
//             return rate !== undefined ? colorScale(rate) : 'gray';
//         })
//         .on('mouseover', function (event, d) {
//             const countryCode = d.properties.ISO_A2;
//             const rate = currencyToCountryMap[countryCode];
//             const countryName = d.properties.NAME;
//             const tooltipText = rate !== undefined ? `${countryName}: ${rate.toFixed(6)}` : `${countryName}: N/A`;

//             // Show tooltip
//             tooltip
//                 .style('visibility', 'visible')
//                 .html(tooltipText)
//                 .style('top', event.pageY + 'px')
//                 .style('left', event.pageX + 'px');
//         })
//         .on('mouseout', function () {
//             // Hide tooltip
//             tooltip.style('visibility', 'hidden');
//         });

//             // ... Rest of the code ...

//             // Add a legend
//             // ... Add legend code from previous responses ...
//         });
//     };

//     // Call the fetchData function to fetch data and visualize the map
//     fetchData();

async function fetchCurrent() {
  const url = 'https://currency-conversion-and-exchange-rates.p.rapidapi.com/latest?from=USD&to=EUR%2CGBP';
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'fc67e2b7c2mshc96a0a884cc6c68p17e57fjsn3458cd46e49a',
      'X-RapidAPI-Host': 'currency-conversion-and-exchange-rates.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const apiData = await response.json();
    populateTable(apiData);
  } catch (error) {
    console.error(error);
  }
}

function populateTable(apiData) {
  const currencyTable = document.getElementById('currency-table');
  const tbody = currencyTable.querySelector('tbody');

  const currencies = Object.keys(apiData.rates);
  const rates = Object.values(apiData.rates);

  const headerRow = document.createElement('tr');
  headerRow.innerHTML = '<th>Currency</th>' + currencies.map(currency => `<th>${currency}</th>`).join('');
  tbody.appendChild(headerRow);

  const rateRow = document.createElement('tr');
  rateRow.innerHTML = `<th>Exchange Rate</th>${rates.map(rate => `<td>${rate}</td>`).join('')}`;
  tbody.appendChild(rateRow);
}

fetchCurrent();


