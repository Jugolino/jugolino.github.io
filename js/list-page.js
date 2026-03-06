window.renderListPage = function(rootId, items) {
  const root = document.getElementById(rootId);
  if (!root || !Array.isArray(items)) {
    return;
  }

  root.innerHTML = "";

  if (items.length === 0) {
    root.innerHTML = "<p class='list-empty'>Sem conteudo cadastrado ainda.</p>";
    return;
  }

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

  items.forEach(function(item) {
    const hasCover = Boolean(item.cover) && isSafeUrl(item.cover);
    const coverHtml = hasCover
      ? "<img src='" + escapeHtml(item.cover) + "' alt='Capa'>"
      : "<span class='cover-placeholder'>Adicionar capa</span>";

    const article = document.createElement("article");
    article.className = "post";
    article.innerHTML =
      "<div class='post-main'>" +
        "<h3>" + escapeHtml(item.title || "Sem titulo") + "</h3>" +
        "<p class='post-excerpt'>" + escapeHtml(item.excerpt || "") + "</p>" +
        "<div class='post-meta'>" +
          "<span class='post-date'>" + escapeHtml(item.date || "") + "</span>" +
          "<span class='post-category'>" + escapeHtml(item.label || "") + "</span>" +
        "</div>" +
      "</div>" +
      "<div class='post-cover'>" + coverHtml + "</div>";

    article.addEventListener("click", function() {
      if (isSafeUrl(item.url) && item.url !== "#") {
        window.location.href = item.url;
      }
    });

    root.appendChild(article);
  });
};
