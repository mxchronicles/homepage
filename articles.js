(() => {
  // ==========================
  // SAFE FIREBASE ACCESS
  // ==========================

  if (!window.firebase) {
    console.error("Firebase not loaded before articles.js");
    return;
  }

  // DO NOT reinitialize Firebase here (important fix)
  const db = firebase.database();
  const articlesRef = db.ref("articles");

  // ==========================
  // ARTICLES LIST PAGE
  // ==========================
  function renderArticles() {
    const grid = document.getElementById("articles-grid");
    if (!grid) return;

    articlesRef.on("value", snapshot => {
      const data = snapshot.val();
      grid.innerHTML = "";

      if (!data) {
        grid.innerHTML = "<p>No articles yet.</p>";
        return;
      }

      Object.entries(data).forEach(([id, a]) => {
        const card = document.createElement("div");
        card.className = "article-card";

        card.innerHTML = `
          <h2>${a.title}</h2>
          <p>${a.author || ""} • ${a.date || ""}</p>
          <p>${a.content ? a.content.substring(0,150) + "..." : ""}</p>
          <a href="article.html?id=${id}">Read More</a>
        `;

        grid.appendChild(card);
      });
    });
  }

  // ==========================
  // SINGLE ARTICLE PAGE
  // ==========================
  function renderArticlePage() {
    const container = document.getElementById("article-container");
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id") || localStorage.getItem("currentArticle");

    if (!id) {
      container.innerHTML = "<p>Article not found.</p>";
      return;
    }

    articlesRef.child(id).once("value").then(snapshot => {
      const a = snapshot.val();

      if (!a) {
        container.innerHTML = "<p>Article not found.</p>";
        return;
      }

      container.innerHTML = `
        <article>
          <h1>${a.title}</h1>
          <p>${a.author || ""} • ${a.date || ""}</p>
          <div>${a.content || ""}</div>
        </article>
      `;
    });
  }

  // ==========================
  // AUTO RUN
  // ==========================
  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("articles-grid")) {
      renderArticles();
    }

    if (document.getElementById("article-container")) {
      renderArticlePage();
    }
  });

})();
