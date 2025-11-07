// Replace with your free API key from https://newsapi.org
const apiKey = "eb6eb3fa0e27415eaa4d36183756f6fe"; 
const newsContainer = document.getElementById("newsContainer");
const categories = document.querySelectorAll(".category");
const searchBox = document.getElementById("searchBox");
const loadMoreBtn = document.getElementById("loadMoreBtn");

let currentCategory = "general";
let currentPage = 1;

window.addEventListener("load", () => fetchNews(currentCategory));

// Fetch category news
async function fetchNews(category, page = 1) {
  newsContainer.innerHTML = page === 1 ? "<p>Loading news...</p>" : newsContainer.innerHTML;
  const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&page=${page}&pageSize=9&apiKey=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== "ok") {
      newsContainer.innerHTML = `<p>Error: ${data.message}</p>`;
      return;
    }

    displayNews(data.articles, page > 1);
  } catch (error) {
    newsContainer.innerHTML = "<p>Failed to load news.</p>";
    console.error(error);
  }
}

function displayNews(articles, append = false) {
  if (!append) newsContainer.innerHTML = "";

  if (!articles || articles.length === 0) {
    newsContainer.innerHTML = "<p>No news found.</p>";
    return;
  }

  articles.forEach(article => {
    if (!article.url) return;

    const card = document.createElement("div");
    card.classList.add("news-card");

    card.innerHTML = `
      <img src="${article.urlToImage || 'https://via.placeholder.com/400x200?text=No+Image'}" alt="news-img">
      <div class="news-content">
        <h3>${article.title}</h3>
        <p>${article.description || 'Click to read more...'}</p>
        <div class="news-footer">
          <span>${article.source?.name || 'Unknown Source'}</span>
          <span>${new Date(article.publishedAt).toDateString()}</span>
        </div>
      </div>
    `;

    card.addEventListener("click", () => {
      window.open(article.url, "_blank");
    });

    newsContainer.appendChild(card);
  });
}

// Category switching
categories.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".active").classList.remove("active");
    btn.classList.add("active");
    currentCategory = btn.dataset.category;
    currentPage = 1;
    fetchNews(currentCategory, currentPage);
  });
});

// Search news
searchBox.addEventListener("keyup", (e) => {
  if (e.key === "Enter") searchNews(e.target.value);
});

async function searchNews(query) {
  if (!query) return;
  newsContainer.innerHTML = "<p>Searching...</p>";
  const url = `https://newsapi.org/v2/everything?q=${query}&pageSize=9&apiKey=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    displayNews(data.articles);
  } catch (error) {
    newsContainer.innerHTML = "<p>Search failed.</p>";
  }
}

// Load more button
loadMoreBtn.addEventListener("click", () => {
  currentPage++;
  fetchNews(currentCategory, currentPage);
});
