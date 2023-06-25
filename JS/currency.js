async function createBubbleChart() {
    const url = 'https://exchangerate-api.p.rapidapi.com/rapid/latest/USD';
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'fc67e2b7c2mshc96a0a884cc6c68p17e57fjsn3458cd46e49a',
        'X-RapidAPI-Host': 'exchangerate-api.p.rapidapi.com'
      }
    };
  
    try {
      const response = await fetch(url, options);
      const data = await response.json();
  
      console.log(data.rates);
  
      const currencies = Object.keys(data.rates);
      console.log(currencies);
  
      const exchangeRates = Object.values(data.rates);
      console.log(exchangeRates);
  
  
      // Prepare data for Chart.js
      const chartData = {
        datasets: [
          {
            label: 'Exchange Rates',
            data: exchangeRates.map((rate) => ({
              x: Math.random(), // Random x value for the bubble
              y: rate, // Exchange rate value for the bubble
              r: 10 // Radius of the bubble
            })),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            hoverBackgroundColor: 'rgba(54, 162, 235, 0.8)',
            hoverBorderColor: 'rgba(54, 162, 235, 1)',
            hoverRadius: 8
          }
        ]
      };
      
  
      // Chart.js configuration
      const chartConfig = {
        type: 'bubble',
        data: chartData,
        options: {
          responsive: true,
          scales: {
            y: {
              title: {
                display: true,
                text: 'Exchange Rate'
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: context => `${context.label}: ${context.parsed.y}`
              }
            }
          }
        }
      };
  
      // Create the bubble chart
      const ctx = document.getElementById('bubbleChart').getContext('2d');
      new Chart(ctx, chartConfig);
    } catch (error) {
      console.error(error);
    }
  }
  
  // Call the async function to create the bubble chart
  createBubbleChart();