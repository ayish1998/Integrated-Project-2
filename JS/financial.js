// async function fetchData() {
//     const url = 'https://mboum-finance.p.rapidapi.com/co/collections/growth_technology_stocks?start=0';
//     const options = {
//         method: 'GET',
//         headers: {
//             'X-RapidAPI-Key': 'fc67e2b7c2mshc96a0a884cc6c68p17e57fjsn3458cd46e49a',
//             'X-RapidAPI-Host': 'mboum-finance.p.rapidapi.com'
//         }
//     };

//     try {
//         const response = await fetch(url, options);
//         const result = await response.json();
//         console.log(result);

//         // Extract relevant data from the API response
//         const companies = result.quotes;

//         console.log(result.quotes);

//         // Filter companies with revenue and earnings growth rates exceeding 25%
//             const filteredCompanies = companies.filter(company => {
//             const revenueGrowthRate = calculateGrowthRate(company.revenue);
//             const earningsGrowthRate = calculateGrowthRate(company.earnings);
//             return revenueGrowthRate > 25 && earningsGrowthRate > 25;
//         });

//         // Extract the necessary data for the graph/chart
//         const labels = filteredCompanies.map(company => company.symbol);
//         const revenueGrowthRates = filteredCompanies.map(company => calculateGrowthRate(company.revenue));
//         const earningsGrowthRates = filteredCompanies.map(company => calculateGrowthRate(company.earnings));

//         // Create an interactive graph/chart using a visualization library
//         const ctx = document.getElementById('chart').getContext('2d');
//         new Chart(ctx, {
//             type: 'bar',
//             data: {
//                 labels: labels,
//                 datasets: [
//                     {
//                         label: 'Revenue Growth Rate',
//                         data: revenueGrowthRates,
//                         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                         borderColor: 'rgba(75, 192, 192, 1)',
//                         borderWidth: 1
//                     },
//                     {
//                         label: 'Earnings Growth Rate',
//                         data: earningsGrowthRates,
//                         backgroundColor: 'rgba(255, 99, 132, 0.2)',
//                         borderColor: 'rgba(255, 99, 132, 1)',
//                         borderWidth: 1
//                     }
//                 ]
//             },
//             options: {
//                 responsive: true,
//                 scales: {
//                     y: {
//                         beginAtZero: true,
//                         title: {
//                             display: true,
//                             text: 'Growth Rate (%)'
//                         }
//                     }
//                 }
//             }
//         });

//     } catch (error) {
//         console.error(error);
//     }
// }

// // Function to calculate growth rate
// function calculateGrowthRate(currentValue) {
//     const previousValue = currentValue - (currentValue * 0.25);
//     return ((currentValue - previousValue) / previousValue) * 100;
// }

// fetchData();


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

    // Create a canvas element for the chart
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);

    // Create the chart using Chart.js
    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: companies,
        datasets: [
          {
            label: 'Revenue Growth (%)',
            data: revenueGrowth,
            backgroundColor: 'rgba(54, 162, 235, 0.6)'
          },
          {
            label: 'Earnings Growth (%)',
            data: earningsGrowth,
            backgroundColor: 'rgba(255, 99, 132, 0.6)'
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
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
}

fetchData();

