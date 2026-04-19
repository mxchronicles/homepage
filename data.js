// data.js
// Firebase-only project: this file should NOT store or mock any data.

// Optional: shared reference container (safe global access)
window.MXChronicles = {
  articles: null,
  staff: null
};

// If Firebase is available, attach references safely
if (typeof firebase !== "undefined") {
  const db = firebase.database();

  window.MXChronicles.articles = db.ref("articles");
  window.MXChronicles.staff = db.ref("staff");
}
