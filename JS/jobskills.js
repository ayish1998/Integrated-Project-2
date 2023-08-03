document.addEventListener('DOMContentLoaded', async () => {
	//**********************************************************************************************************
  // DARK MODE SWITCH
  //**********************************************************************************************************

  darkModeSwitch.addEventListener('change', () => {
    document.querySelector('body').classList.toggle('darkmode')
    localStorage.setItem('jstabs-darkmode', JSON.stringify(!darkmode))
  });

  // Retrieve stored data
  let darkmode = JSON.parse(localStorage.getItem('jstabs-darkmode'))
  const opentab = JSON.parse(localStorage.getItem('jstabs-opentab')) || '3'

  if (darkmode === null) {
    darkmode = window.matchMedia("(prefers-color-scheme: dark)").matches // match to OS theme
  }
  if (darkmode) {
    document.querySelector('body').classList.add('darkmode')
    document.querySelector('#dark-mode-switch').checked = 'checked'
  }
  activateTab(opentab)

	// Helper function to convert a string to title case
	function toTitleCase(str) {
		return str.replace(/\w\S*/g, function(txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	}
	
	// Function to retrieve country list from the Rest Countries API
	async function getCountryList() {
		const url = 'https://restcountries.com/v3.1/all';
		try {
			const response = await fetch(url);
			const data = await response.json();
			return data.map((country) => country.name.common);
		} catch (error) {
			console.error(error);
		}
	}
	// Function to retrieve job data from the API
	async function getJobData(selectedCountry) {
		const countryList = await getCountryList();
		const country = countryList.find(
			(country) => country === toTitleCase(selectedCountry)
		);

		if (!country) {
			console.error('Country not found.');
			return null;
		}

		const formattedCountry = encodeURIComponent(country); // Format the country name for the API request
		const jobTitle = 'NodeJS Developer'; // Set the desired job title here

		const jobUrl = `https://jsearch.p.rapidapi.com/search?query=${formattedCountry}&page=1&num_pages=1`;
		const salaryUrl = `https://jsearch.p.rapidapi.com/estimated-salary?job_title=${encodeURIComponent(
			jobTitle
		)}&location=${formattedCountry}&radius=100`;
		const jobOptions = {
			method: 'GET',
			headers: {
				'X-RapidAPI-Key': 'fc67e2b7c2mshc96a0a884cc6c68p17e57fjsn3458cd46e49a',
				'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
			},
		};

		const [jobResponse, salaryResponse] = await Promise.all([
			fetch(jobUrl, jobOptions),
			fetch(salaryUrl, jobOptions),
		]);

		const jobData = await jobResponse.json();
		const salaryData = await salaryResponse.json();

		// Combine job data and salary data using job IDs
		const combinedData = jobData.data.map((job) => ({
			...job,
			estimated_salary: findEstimatedSalary(job.job_title, salaryData.data),
		}));

		return combinedData;
	}
	// Helper function to find the estimated salary for a job ID from salary data
	function findEstimatedSalary(jobId, salaryData) {
		const jobSalary = salaryData.find((salary) => salary.job_id === jobId);
		return jobSalary ? jobSalary.average_salary : 'N/A';
	}

	// Function to render the job data
	function renderJobData(data) {
		const explanation = document.getElementById('explanation');
		explanation.innerHTML = ''; // Clear previous data

		if (!data || data.length === 0) {
			explanation.innerHTML = '<p>No data available.</p>';
			return;
		}

		const jobData = data[0]; // Assuming only one job is returned from the API

		const requiredSkills = jobData.job_required_skills ?
			jobData.job_required_skills :
			'N/A';

		// Replace newline characters with </p><p> to split paragraphs
		const descriptionWithParagraphs = jobData.job_description.replace(/\n/g, '</p><p>');

		// Update the following lines with the correct property names based on the jobData object
		const content = `
		<div class="container" id="job-info">
		     <div class="row"> 
			     <div class="col-md-2">
				   <img src="${jobData.employer_logo}" alt="Company Logo" id="company-logo">
				 </div>

				 <div class="col-md-10">
					 <h6 id="company-name">${jobData.employer_name}</h6>
					 <h4>${jobData.job_title}</h4>
					
					 <div style="display: flex;">
					 	   <i class="fa-solid fa-location-dot"></i> 
							<p>${jobData.job_city}</p>,
							<p>${jobData.job_country}</p>

						<p style="margin-left: 10px;">${jobData.job_employment_type}</p>
					</div>
				 </div>
			 </div>
	                <p>${descriptionWithParagraphs}</p>
		
		        <p>Required Skills: ${requiredSkills}</p>
			
				<a href="${jobData.job_apply_link}" id="apply-link">Apply Here</a>

		</div>
	  `;


		explanation.innerHTML = content;
	}

	// Declare a global variable to store the chart instance
	let myChart;

	// Function to render the chart with the provided job data and filter by country
	function renderChart(data) {
		// Show the loading spinner while fetching data
		const loadingSpinner = document.getElementById('loading-spinner');
		loadingSpinner.style.display = 'block';

		// Sort the data based on the estimated salary from high to lowest
		const sortedData = data.slice().sort((a, b) => b.estimated_salary - a.estimated_salary);

		console.log("Data before sorting:", data);
		console.log("Sorted data:", sortedData);

		const jobTitles = sortedData.map((job) => job.job_title);
		const estimatedSalaries = sortedData.map((job) => job.estimated_salary);

		// Get the chart wrapper element
		const chartWrapper = document.getElementById('chart-wrapper');

		if (data && data.length > 0) {
			// Show the chart wrapper when data is available
			chartWrapper.style.display = 'block';
		} else {
			// Hide the chart wrapper when no data is available
			chartWrapper.style.display = 'none';
		}

		// Get the canvas element
		const ctx = document.getElementById('chart').getContext('2d');

		// Check if the chart instance already exists, and destroy it before creating a new one
		if (myChart) {
			myChart.destroy();
		}

		// Create the chart
		myChart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: jobTitles,
				datasets: [{
					label: 'Estimated Salary (USD)',
					data: estimatedSalaries,
					backgroundColor: 'steelblue', // Set the color for the bars
				}, ],
			},
			options: {
				responsive: true,
				indexAxis: 'y', // Use y-axis as the index axis for a horizontal bar chart effect
				scales: {
					x: {
						title: {
							display: true,
							text: 'Estimated Salary (USD)',
						},
						beginAtZero: true,
						stepSize: 50000, // Customize the step size as needed
					},
					y: {
						title: {
							display: true,
							text: 'Job Title',
						},
					},
				},
				plugins: {
					tooltip: {
						enabled: true,
					},
				},
			},
		});

		// Hide the loading spinner once data is fetched and chart is rendered
		loadingSpinner.style.display = 'none';
	}

	// Function to populate the country filter dropdown
	async function populateCountryFilter() {
		const countryList = await getCountryList();

		// Sort the country list in alphabetical order
		countryList.sort();

		const countryFilter = document.getElementById('country-filter');
		countryList.forEach((country) => {
			const option = document.createElement('option');
			option.value = country;
			option.textContent = country;
			countryFilter.appendChild(option);
		});
	}


	// Call populateCountryFilter to populate the country filter dropdown
	populateCountryFilter();

	// Call the getJobData function to fetch job data and render the initial content
	getJobData('Ghana')
		.then((data) => {
			console.log(data); // Log the data to the console for inspection
			renderJobData(data);
			renderChart(data);
		})
		.catch((error) => console.error(error));

	// Event listener for the country filter dropdown
	const countryFilter = document.getElementById('country-filter');
	countryFilter.addEventListener('change', async () => {
		const selectedCountry = countryFilter.value;
		const jobData = await getJobData(selectedCountry);
		renderJobData(jobData);
		renderChart(jobData);
	});
});