// ==========================
// SAFE DATA ACCESS
// ==========================
function getArticles() {
  return JSON.parse(localStorage.getItem("articles")) || {};
}

function saveArticles(articles) {
  localStorage.setItem("articles", JSON.stringify(articles));
}

// ==========================
// ARTICLES LIST PAGE
// ==========================
function renderArticles() {
  const grid = document.getElementById("articles-grid");
  const searchBox = document.getElementById("search-box");
  const filterIssue = document.getElementById("filter-issue");

  if (!grid || !searchBox || !filterIssue) return;

  const articles = getArticles();

  // Populate issue filter
  const issues = [...new Set(Object.values(articles).map(a => a.issue))].sort((a,b)=>a-b);
  filterIssue.innerHTML =
    `<option value="">All Issues</option>` +
    issues.map(i => `<option value="${i}">Issue ${i}</option>`).join("");

  function display() {
    const query = searchBox.value.toLowerCase();
    const issueFilter = filterIssue.value;

    grid.innerHTML = "";

    Object.entries(articles).forEach(([id, a]) => {
      if (issueFilter && String(a.issue) !== issueFilter) return;

      const text = `${a.title} ${a.author} ${a.content}`.toLowerCase();
      if (query && !text.includes(query)) return;

      const card = document.createElement("div");
      card.className = "article-card";
      card.onclick = () => openArticle(id);

      card.innerHTML = `
        <h2 class="article-title">${a.title.toUpperCase()}</h2>
        <div class="article-meta">${a.author} · ${a.date} · Issue ${a.issue}</div>
        ${a.image ? `<img src="${a.image}" alt="${a.title}">` : ""}
        <p class="article-synopsis">${a.content.slice(0,160)}...</p>
      `;

      grid.appendChild(card);
    });
  }

  searchBox.addEventListener("input", display);
  filterIssue.addEventListener("change", display);
  display();
}

// ==========================
// ARTICLE NAVIGATION
// ==========================
function openArticle(id) {
  // Pass ID via URL
  window.location.href = `article.html?id=${encodeURIComponent(id)}`;
}

// ==========================
// SINGLE ARTICLE PAGE
// ==========================
function renderArticlePage() {
  const container = document.getElementById("article-container");
  if (!container) return;

  const articles = getArticles();

  // Read 'id' from URL params
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id || !articles[id]) {
    container.innerHTML = "<p>Article not found.</p>";
    return;
  }

  const a = articles[id];

  container.innerHTML = `
    <article class="article-page">
      <h1 class="article-title">${a.title.toUpperCase()}</h1>
      <div class="article-meta">${a.author} · ${a.date} · Issue ${a.issue}</div>
      ${a.image ? `<img src="${a.image}" alt="${a.title}">` : ""}
      <div class="article-content">${a.content}</div>
    </article>
  `;
}
