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

  // 🔴 CRITICAL GUARD
  if (!grid) return;

  const articles = getArticles();

  // Populate issue filter if present
  if (filterIssue) {
    const issues = [...new Set(Object.values(articles).map(a => a.issue))].sort((a,b)=>a-b);
    filterIssue.innerHTML =
      `<option value="">All Issues</option>` +
      issues.map(i => `<option value="${i}">Issue ${i}</option>`).join("");

    filterIssue.addEventListener("change", display);
  }

  if (searchBox) searchBox.addEventListener("input", display);

  display();

  function display() {
    const query = searchBox ? searchBox.value.toLowerCase() : "";
    const issueFilter = filterIssue ? filterIssue.value : "";

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
}

// ==========================
// ARTICLE NAVIGATION
// ==========================
function openArticle(id) {
  localStorage.setItem("currentArticle", id);
  window.location.href = "article.html";
}

// ==========================
// SINGLE ARTICLE PAGE
// ==========================
function renderArticlePage() {
  const container = document.getElementById("article-container");

  if (!container) return;

  const articles = getArticles();
  const id = localStorage.getItem("currentArticle");

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

// Optional: initialize articles if none exist
if (!localStorage.getItem("articles")) {
  saveArticles({});
}
