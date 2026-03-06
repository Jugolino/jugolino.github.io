document.addEventListener("DOMContentLoaded", function() {
  const data = Array.isArray(window.POSTS_DATA) ? window.POSTS_DATA.slice() : [];
  if (data.length === 0) {
    return;
  }

  let activeTag = "";

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function isSafeUrl(url) {
    return /^(https?:\/\/|\/|\.{1,2}\/|pages\/)/.test(String(url || ""));
  }

  function normalize(text) {
    return String(text || "").toLowerCase().trim();
  }

  const sorted = data.sort(function(a, b) {
    return new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime();
  });

  const recentRoot = document.getElementById("panel-recent");
  if (recentRoot) {
    recentRoot.innerHTML = sorted.slice(0, 6).map(function(post) {
      const href = isSafeUrl(post.url) ? post.url : "#";
      return "<a href='" + escapeHtml(href) + "'>" + escapeHtml(post.title) + "</a>";
    }).join("");
  }

  const tagsRoot = document.getElementById("panel-tags");
  if (tagsRoot) {
    const tags = [];
    sorted.forEach(function(post) {
      const tag = String(post.category || "").trim();
      if (tag && !tags.includes(tag)) {
        tags.push(tag);
      }
    });

    tagsRoot.innerHTML = tags.slice(0, 12).map(function(tag) {
      const norm = normalize(tag);
      return "<button type='button' class='panel-tag-btn' data-tag='" + escapeHtml(norm) + "'>" + escapeHtml(tag) + "</button>";
    }).join("");
  }

  const searchInput = document.querySelector("[data-panel-search]");
  function applyFilters() {
    const q = searchInput ? normalize(searchInput.value) : "";
    const cards = document.querySelectorAll(".post, .home-post");
    cards.forEach(function(card) {
      const source = normalize(card.innerText);
      const cardTag = normalize(card.dataset.tag);
      const cardCategory = normalize(card.dataset.category);
      const matchesText = q === "" || source.includes(q);
      const matchesTag = activeTag === "" || activeTag === cardTag || activeTag === cardCategory;
      card.style.display = matchesText && matchesTag ? "" : "none";
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  if (tagsRoot) {
    tagsRoot.addEventListener("click", function(event) {
      const button = event.target.closest(".panel-tag-btn");
      if (!button) {
        return;
      }

      const selected = normalize(button.dataset.tag);
      activeTag = activeTag === selected ? "" : selected;

      tagsRoot.querySelectorAll(".panel-tag-btn").forEach(function(tagBtn) {
        tagBtn.classList.toggle("is-active", normalize(tagBtn.dataset.tag) === activeTag);
      });

      applyFilters();
    });
  }

  const feed = document.querySelector("#posts, #home-posts");
  if (feed && "MutationObserver" in window) {
    const observer = new MutationObserver(function() {
      applyFilters();
    });
    observer.observe(feed, { childList: true, subtree: false });
  }

  applyFilters();
});
