const cards = document.getElementsByClassName('card');
const cardArray = Array.from(cards);

cardArray.forEach(card => {
  card.addEventListener('click', () => {
    fetch('https://climate-news-feed.p.rapidapi.com/page/1?limit=10', {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'd04a271587msh1c8c70737cc9b87p1da6c7jsnf560bf3fe7c6',
        'X-RapidAPI-Host': 'climate-news-feed.p.rapidapi.com'
      }
    })
      .then(response => response.json())
      .then(response => {
        console.log(response);
        console.log(response.content);
      })
      .catch(err => {
        console.log(err);
      });
  });
});

const url =
  "https://climate-news-feed.p.rapidapi.com/page/1?limit=10";
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
    const articles = news.articles.slice(0, 3);
    let newsContainer = ""; // Initialize as an empty string

     console.log(news);

    articles.forEach((article) => {
      newsContainer += `
        <div class="col">
          <div class="card">
            <img src="${article.thumbnail}" class="card-img-top" alt="Hollywood Sign on The Hill">
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
  })
