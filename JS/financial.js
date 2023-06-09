// technology stocks API starts here

async function fetchData() {
  const url = 'https://mboum-finance.p.rapidapi.com/co/collections/growth_technology_stocks?start=0';
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

    console.log(data);

    // Extract relevant data for the chart
    const companies = data.quotes.map((quote) => quote.longName);
    const revenueGrowth = data.quotes.map((quote) => quote.fiftyDayAverageChangePercent * 100);
    const earningsGrowth = data.quotes.map((quote) => quote.epsForward * 100);

    // Extract current date
    const currentDate = new Date(data.quotes[0].nameChangeDate);
    console.log(data.quotes[0].nameChangeDate);
    document.getElementById('currentDate').innerText = currentDate.toDateString();

    // Create a canvas element for the chart
    const chart = document.getElementById('chart');
    const canvas = document.createElement('canvas');
    chart.appendChild(canvas);

    // Create the chart using Chart.js
    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: companies,
        datasets: [
          {
            label: 'Revenue Growth (%)',
            data: revenueGrowth,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            datalabels: {
              anchor: 'end',
              align: 'end',
              formatter: (value) => value.toFixed(2) + '%'
            }
          },
          {
            label: 'Earnings Growth (%)',
            data: earningsGrowth,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            datalabels: {
              anchor: 'end',
              align: 'end',
              formatter: (value) => value.toFixed(2) + '%'
            }
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Growth (%)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Companies'
            }
          }
        },
        plugins: {
          datalabels: {
            color: '#333',
            font: {
              weight: 'bold'
            }
          }
        }
      }
    });

    // Extract relevant data for the second chart
    const companies2 = data.quotes.map((quote) => quote.longName);
    const stockPrices = data.quotes.map((quote) => quote.regularMarketPrice);

    // Create a canvas element for the second chart
    const chart2 = document.getElementById('chart2');
    const canvas2 = document.createElement('canvas');
    chart2.appendChild(canvas2);

    // Create the second chart using Chart.js
    new Chart(canvas2, {
      type: 'line',
      data: {
        labels: companies2,
        datasets: [
          {
            label: 'Stock Price',
            data: stockPrices,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            fill: false,
            lineTension: 0,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            title: {
              display: true,
              text: 'Stock Price'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Companies'
            }
          }
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
}

fetchData();

// technology stocks API ends here





