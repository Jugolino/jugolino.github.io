document.addEventListener("DOMContentLoaded", function() {
  const items = Array.isArray(window.CERTIFICATES_DATA) ? window.CERTIFICATES_DATA : [];
  window.renderListPage("certificates-list", items);
});
