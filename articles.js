// ==========================
// SAFE DATA ACCESS (JSON FILE + LOCAL CACHE)
// ==========================
let articlesCache = {};

async function getArticles() {
  if (Object.keys(articlesCache).length > 0) return articlesCache;
  try {
    const res = await fetch('articles.json');
    const data = await res.json();
    articlesCache = data;
    return data;
  } catch (e) {
    console.error("Error fetching articles:", e);
    return {};
  }
}

function saveArticles(articles) {
  // Staff edits update the local cache and localStorage for temporary persistence
  articlesCache = articles;
  localStorage.setItem("articles", JSON.stringify(articles));
}

// ==========================
// ARTICLES LIST PAGE
// ==========================
async function renderArticles() {
  const grid = document.getElementById("articles-grid");
  const searchBox = document.getElementById("search-box");
  const filterIssue = document.getElementById("filter-issue");

  if (!grid) return;
  const articles = await getArticles();

  // populate issue filter if exists
  if (filterIssue) {
    const issues = [...new Set(Object.values(articles).map(a => a.issue))].sort((a,b)=>a-b);
    filterIssue.innerHTML = `<option value="">All Issues</option>` +
      issues.map(i=>`<option value="${i}">Issue ${i}</option>`).join("");
    filterIssue.addEventListener('change', display);
  }

  if (searchBox) searchBox.addEventListener('input', display);

  display();

  function display() {
    const query = searchBox ? searchBox.value.toLowerCase() : '';
    const issueFilter = filterIssue ? filterIssue.value : '';
    grid.innerHTML = '';

    Object.entries(articles).forEach(([id,a])=>{
      if (issueFilter && String(a.issue)!==issueFilter) return;
      const text = `${a.title} ${a.author} ${a.content}`.toLowerCase();
      if (query && !text.includes(query)) return;

      const card = document.createElement('div');
      card.className = 'article-card';
      card.onclick = ()=>openArticle(id);

      card.innerHTML = `
        <h2 class="article-title">${a.title.toUpperCase()}</h2>
        <div class="article-meta">${a.author} · ${a.date} · Issue ${a.issue}</div>
        ${a.image?`<img src="${a.image}" alt="${a.title}">`:''}
        <p class="article-synopsis">${a.content.slice(0,160)}...</p>
      `;

      grid.appendChild(card);
    });
  }
}

// ==========================
// ARTICLE NAVIGATION
// ==========================
function openArticle(id){
  localStorage.setItem("currentArticle", id);
  window.location.href = "article.html";
}

// ==========================
// SINGLE ARTICLE PAGE
// ==========================
async function renderArticlePage(){
  const container = document.getElementById("article-container");
  if(!container) return;

  const articles = await getArticles();
  const id = localStorage.getItem("currentArticle");

  if(!id || !articles[id]){
    container.innerHTML = "<p>Article not found.</p>";
    return;
  }

  const a = articles[id];

  container.innerHTML = `
    <article class="article-page">
      <h1 class="article-title">${a.title.toUpperCase()}</h1>
      <div class="article-meta">${a.author} · ${a.date} · Issue ${a.issue}</div>
      ${a.image?`<img src="${a.image}" alt="${a.title}">`:''}
      <p class="article-content">${a.content}</p>
    </article>
  `;
}
