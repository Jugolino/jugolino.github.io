document.addEventListener("DOMContentLoaded", function() {
  const buttons = document.querySelectorAll("[data-copy-target]");
  buttons.forEach(function(button) {
    button.addEventListener("click", async function() {
      const targetId = button.getAttribute("data-copy-target");
      const target = targetId ? document.getElementById(targetId) : null;
      if (!target) return;

      const text = target.textContent || "";
      try {
        await navigator.clipboard.writeText(text.trim());
        const original = button.textContent;
        button.textContent = "Copiado";
        setTimeout(function() { button.textContent = original; }, 1200);
      } catch (error) {
        button.textContent = "Falhou";
        setTimeout(function() { button.textContent = "Copiar"; }, 1200);
      }
    });
  });
});
