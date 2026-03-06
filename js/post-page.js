document.addEventListener("DOMContentLoaded", function() {
  const hero = document.querySelector(".post-hero");
  if (!hero) {
    return;
  }

  function clearPlaceholder() {
    const placeholder = hero.querySelector(".post-hero-placeholder");
    if (placeholder) {
      placeholder.remove();
    }
    hero.classList.remove("is-empty");
  }

  function showPlaceholder() {
    hero.classList.add("is-empty");
    if (!hero.querySelector(".post-hero-placeholder")) {
      const placeholder = document.createElement("div");
      placeholder.className = "post-hero-placeholder";
      placeholder.textContent = "Sem capa definida para este post";
      hero.appendChild(placeholder);
    }
  }

  function bindImage(img) {
    img.addEventListener("load", function() {
      clearPlaceholder();
    });
    img.addEventListener("error", function() {
      img.remove();
      showPlaceholder();
    });
  }

  function isSafeUrl(url) {
    return /^(https?:\/\/|\/|\.{1,2}\/|pages\/)/.test(String(url || ""));
  }

  let img = hero.querySelector("img");
  if (img && img.getAttribute("src")) {
    bindImage(img);
    return;
  }

  const currentPage = window.location.pathname.split("/").pop();
  const posts = Array.isArray(window.POSTS_DATA) ? window.POSTS_DATA : [];
  const match = posts.find(function(post) {
    return typeof post.url === "string" && post.url.indexOf(currentPage) !== -1;
  });

  if (!match || !match.cover || !isSafeUrl(match.cover)) {
    showPlaceholder();
    return;
  }

  if (!img) {
    img = document.createElement("img");
    hero.appendChild(img);
  }

  img.alt = match.title ? "Capa do post: " + match.title : "Capa do post";
  bindImage(img);
  img.src = match.cover;
});
