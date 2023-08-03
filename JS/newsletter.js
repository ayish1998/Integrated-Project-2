//**********************************************************************************************************
  // DARK MODE SWITCH
  //**********************************************************************************************************

  // Dark mode switch event listener
document.getElementById('dark-mode-switch').addEventListener('change', () => {
  document.querySelector('body').classList.toggle('darkmode');
  localStorage.setItem('darkmode', JSON.stringify(!darkmode));
});

// Retrieve stored data
let darkmode = JSON.parse(localStorage.getItem('darkmode'));

if (darkmode === null) {
  darkmode = window.matchMedia('(prefers-color-scheme: dark)').matches; // Match OS theme
}

// Apply dark mode class if darkmode is true
if (darkmode) {
  document.querySelector('body').classList.add('darkmode');
  document.getElementById('dark-mode-switch').checked = 'checked';
}



const url = "https://climate-news-feed.p.rapidapi.com/page/1?limit=10";
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "d04a271587msh1c8c70737cc9b87p1da6c7jsnf560bf3fe7c6",
    "X-RapidAPI-Host": "climate-news-feed.p.rapidapi.com",
  },
};

fetch(url, options)
  .then((response) => response.json())
  .then((news) => {
    const articles = news.articles.slice(0, 3); // Display only the first three articles
    let newsContainer = ""; // Initialize as an empty string

    articles.forEach((article) => {
      newsContainer += `
        <div class="col-md-4 mb-4">
          <div class="card">
            <img src="${article.thumbnail}" class="card-img-top" alt="News Image">
            <div class="card-body">
              <h4 class="card-title">${article.title}</h4>
              <h6><a href="${article.url}" target="_blank">Read more</a></h6>
            </div>
          </div>
        </div>
      `;
    });

    const newsContainerElement = document.getElementById("news_container");
    newsContainerElement.innerHTML = newsContainer; // Set the generated HTML as the content of the container
  })
  .catch((error) => {
    console.error("Error fetching news:", error);
  });
