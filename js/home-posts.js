document.addEventListener("DOMContentLoaded", function() {
  const postsRoot = document.getElementById("home-posts");

  if (!postsRoot || !Array.isArray(window.POSTS_DATA)) {
    return;
  }

  const homePosts = window.POSTS_DATA
    .filter(function(post) { return post.showOnHome !== false; })
    .sort(function(a, b) {
      const da = new Date(a.publishedAt || 0).getTime();
      const db = new Date(b.publishedAt || 0).getTime();
      return db - da;
    })
    .slice(0, 6);

  postsRoot.innerHTML = "";

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function isSafeUrl(url) {
    return /^(https?:\/\/|\/|\.{1,2}\/|pages\/)/.test(String(url || ""));
  }

  homePosts.forEach(function(post) {
    const hasCover = Boolean(post.cover) && isSafeUrl(post.cover);
    const coverHtml = hasCover
      ? "<img src='" + escapeHtml(post.cover) + "' alt='Capa do post'>"
      : "<span>Adicionar capa</span>";

    const el = document.createElement("article");
    el.className = "home-post";
    el.dataset.tag = String(post.tag || "").toLowerCase();
    el.dataset.category = String(post.category || "").toLowerCase();
    el.innerHTML =
      "<div class='home-post-main'>" +
        "<h3>" + escapeHtml(post.title) + "</h3>" +
        "<p class='home-post-excerpt'>" + escapeHtml(post.excerpt) + "</p>" +
        "<div class='home-post-meta'>" +
          "<span class='home-post-date'>" + escapeHtml(post.date) + "</span>" +
          "<span class='home-post-category'>" + escapeHtml(post.category) + "</span>" +
        "</div>" +
      "</div>" +
      "<div class='home-post-cover" + (hasCover ? "" : " empty-cover") + "'>" + coverHtml + "</div>";

    el.addEventListener("click", function() {
      if (isSafeUrl(post.url)) {
        window.location.href = post.url;
      }
    });

    postsRoot.appendChild(el);
  });
});
