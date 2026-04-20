(() => {
  // ==========================
  // SAFE FIREBASE ACCESS
  // ==========================
  if (!window.firebase) {
    console.error("Firebase not loaded before articles.js");
    return;
  }

  const db = firebase.database();

  const articlesRef = db.ref("articles");
  const activeIssueRef = db.ref("activeIssue");

  // ==========================
  // ARTICLES LIST PAGE
  // ==========================
  function renderArticles() {
    const grid = document.getElementById("articles-grid");
    if (!grid) return;

    activeIssueRef.on("value", activeSnap => {
      const activeIssue = activeSnap.val();

      articlesRef.on("value", snapshot => {
        const data = snapshot.val();
        grid.innerHTML = "";

        if (!data) {
          grid.innerHTML = "<p>No articles yet.</p>";
          return;
        }

        Object.entries(data)
          .map(([id, a]) => ({ id, ...a }))
          .filter(a => a.issue == activeIssue)
          .forEach(a => {
            const card = document.createElement("div");
            card.className = "article-card";

            card.innerHTML = `
              ${a.image ? `<img src="${a.image}" alt="${a.title}">` : ""}
              <h2>${a.title}</h2>
              <p>${a.author || ""} • ${a.date || ""} • Issue ${a.issue}</p>
              <p>${a.content ? a.content.substring(0,150) + "..." : ""}</p>
              <a href="article.html?id=${a.id}">Read More</a>
            `;

            grid.appendChild(card);
          });
      });
    });
  }

  // ==========================
  // SINGLE ARTICLE PAGE (UPDATED)
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
        <article class="article-page">

          <header class="article-header">
            <h1>${a.title}</h1>
            <div class="article-meta">
              ${a.author || ""} • ${a.date || ""} • Issue ${a.issue || "1"}
            </div>
          </header>

          ${a.image ? `
            <div class="article-cover">
              <img src="${a.image}" alt="${a.title}">
            </div>
          ` : ""}

          <div class="text-controls">
            <span>Text size:</span>
            <button onclick="setTextSize('small')">A-</button>
            <button onclick="setTextSize('medium')">A</button>
            <button onclick="setTextSize('large')">A+</button>
          </div>

          <div id="article-text" class="article-text medium">
            ${a.content || ""}
          </div>

        </article>
      `;

      applySavedTextSize();
    });
  }

  // ==========================
  // TEXT SIZE SYSTEM
  // ==========================
  window.setTextSize = function(size) {
    const el = document.getElementById("article-text");
    if (!el) return;

    el.classList.remove("small", "medium", "large");
    el.classList.add(size);

    localStorage.setItem("textSize", size);
  };

  function applySavedTextSize() {
    const saved = localStorage.getItem("textSize") || "medium";
    const el = document.getElementById("article-text");
    if (!el) return;
    setTextSize(saved);
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
