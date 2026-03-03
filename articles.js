// ==========================
// ARTICLES DATA ACCESS USING FIREBASE
// ==========================
async function getArticles() {
  const snapshot = await db.ref("articles").get();
  return snapshot.exists() ? snapshot.val() : {};
}

async function saveArticles(articles) {
  await db.ref("articles").set(articles);
}

// ==========================
// ARTICLES LIST PAGE
// ==========================
async function renderArticles() {
  const grid = document.getElementById("articles-grid");
  if (!grid) return;

  const articles = await getArticles();

  grid.innerHTML = "";

  Object.entries(articles).forEach(([id, a]) => {
    const card = document.createElement("div");
    card.className = "article-card";
    card.onclick = () => openArticle(id);
    card.innerHTML = `
      <h2 class="article-title">${a.title.toUpperCase()}</h2>
      <div class="article-meta">${a.author} · ${a.date} · Issue ${a.issue}</div>
      ${a.image ? `<img src="${a.image}" alt="${a.title}">` : ""}
      <p class="article-synopsis">${a.content.slice(0, 160)}...</p>
    `;
    grid.appendChild(card);
  });
}

// ==========================
// NAVIGATE TO SINGLE ARTICLE
// ==========================
function openArticle(id) {
  localStorage.setItem("currentArticle", id); // temporary storage for single page
  window.location.href = "article.html";
}

// ==========================
// SINGLE ARTICLE PAGE
// ==========================
async function renderArticlePage() {
  const container = document.getElementById("article-container");
  if (!container) return;

  const id = localStorage.getItem("currentArticle");
  const articles = await getArticles();

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
      <p class="article-content">${a.content}</p>
    </article>
  `;
}
