document.addEventListener("DOMContentLoaded", function() {
  const logoMain = document.querySelector(".logo-main");

  if (!logoMain) {
    return;
  }

  let cursor = logoMain.querySelector(".cursor");
  if (!cursor) {
    cursor = document.createElement("span");
    cursor.className = "cursor";
    logoMain.appendChild(cursor);
  }

  Array.from(logoMain.childNodes).forEach(function(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      logoMain.removeChild(node);
    }
  });

  const textEl = document.createElement("span");
  logoMain.insertBefore(textEl, cursor);
  cursor.textContent = "_";
  cursor.style.marginLeft = "2px";

  const GREEN = "#32a852";
  const RED = "#d94b4b";
  const TYPE_SPEED = 70;
  const DELETE_SPEED = 45;
  const PAUSE_MS = 850;

  function sleep(ms) {
    return new Promise(function(resolve) {
      setTimeout(resolve, ms);
    });
  }

  async function typeText(text, color) {
    textEl.style.color = color;
    textEl.textContent = "";
    for (let i = 1; i <= text.length; i += 1) {
      textEl.textContent = text.slice(0, i);
      await sleep(TYPE_SPEED);
    }
  }

  async function deleteText() {
    while (textEl.textContent.length > 0) {
      textEl.textContent = textEl.textContent.slice(0, -1);
      await sleep(DELETE_SPEED);
    }
  }

  (async function runAnimation() {
    await typeText("Guilherme Oliveira", GREEN);
    await sleep(PAUSE_MS);
    await deleteText();
    await sleep(250);

    await typeText("Surebrec", RED);
    await sleep(PAUSE_MS);
    await deleteText();
    await sleep(250);

    await typeText("Guilherme Oliveira", GREEN);
  })();

  setInterval(function() {
    cursor.style.visibility = cursor.style.visibility === "hidden" ? "visible" : "hidden";
  }, 500);
});
