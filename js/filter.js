const data = Array.isArray(window.POSTS_DATA) ? window.POSTS_DATA : [];

const postsDiv = document.getElementById("posts");
const postsTitleEl = document.getElementById("posts-title");
const checks = document.querySelectorAll("input[type=checkbox]");

if (postsDiv) {
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

  function render() {
    const active = [...checks].filter(function(c) { return c.checked; }).map(function(c) { return c.value; });

    if (postsTitleEl) {
      if (active.length === 0) {
        postsTitleEl.textContent = "$ ls posts";
      } else {
        const grepArg = active.join("|");
        postsTitleEl.textContent = '$ ls posts | grep "' + grepArg + '"';
      }
    }

    postsDiv.innerHTML = "";

    const toShow = active.length === 0
      ? data
      : data.filter(function(p) { return active.includes(p.tag); });

    toShow.forEach(function(p) {
      const el = document.createElement("article");
      el.className = "post";
      el.dataset.tag = String(p.tag || "").toLowerCase();
      el.dataset.category = String(p.category || "").toLowerCase();
      const hasCover = Boolean(p.cover) && isSafeUrl(p.cover);
      const coverHtml = hasCover
        ? "<img src='" + escapeHtml(p.cover) + "' alt='Capa do post'>"
        : "<span class='cover-placeholder'>Adicionar capa</span>";

      el.innerHTML =
        "<div class='post-main'>" +
          "<h3>" + escapeHtml(p.title) + "</h3>" +
          "<p class='post-excerpt'>" + escapeHtml(p.excerpt) + "</p>" +
          "<div class='post-meta'>" +
            "<span class='post-date'>" + escapeHtml(p.date) + "</span>" +
            "<span class='post-category'>" + escapeHtml(p.category) + "</span>" +
          "</div>" +
        "</div>" +
        "<div class='post-cover'>" + coverHtml + "</div>";

      el.addEventListener("click", function() {
        if (isSafeUrl(p.url)) {
          window.location.href = p.url;
        }
      });
      postsDiv.appendChild(el);
    });
  }

  checks.forEach(function(c) { c.addEventListener("change", render); });
  render();
}
