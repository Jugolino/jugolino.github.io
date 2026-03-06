document.addEventListener("DOMContentLoaded", function() {
  const items = Array.isArray(window.PROJECTS_DATA) ? window.PROJECTS_DATA : [];
  window.renderListPage("projects-list", items);
});
