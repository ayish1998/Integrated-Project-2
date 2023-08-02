function showNews(category) {
    const apiKey = 'f9026c19e36c474eb87f27dc22175015';
  
    // Fetch the news content for the selected category from the API
    const url = `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${apiKey}&pageSize=100`;
  
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // Process the news data and display it in the news-container div
        const newsContainer = document.getElementById('news-container');
  
        if (data.articles && data.articles.length > 0) {
          let newsHTML = `<h2>${category.toUpperCase()} News</h2>`;
  
          data.articles.forEach((article) => {
            // Check if the article has an image
            if (article.urlToImage) {
              const description = article.description ? article.description : 'Description not available';
  
              newsHTML += `
                <div class="news-card">
                  <img src="${article.urlToImage}" alt="${article.title}" class="news-image">
                  <h4>${article.title}</h4>
                  <p>${description}</p>
                  <a href="${article.url}" target="_blank" class="read-more-btn">Read More</a>
                </div>
              `;
            }
          });
  
          newsContainer.innerHTML = newsHTML;
        } else {
          newsContainer.innerHTML = '<p>No news available for this category.</p>';
        }
      })
      .catch((error) => {
        console.error('Error fetching news:', error);
        const newsContainer = document.getElementById('news-container');
        newsContainer.innerHTML = '<p>Error fetching news. Please try again later.</p>';
      });
  }
  