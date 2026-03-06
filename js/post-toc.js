document.addEventListener("DOMContentLoaded", function() {
  const toc = document.getElementById("post-toc");
  if (!toc) {
    return;
  }

  const contentSection = toc.querySelector(".post-side-section:last-child");
  if (!contentSection) {
    return;
  }

  const title = contentSection.querySelector("h3");
  const headingNodes = Array.from(document.querySelectorAll(".post-body .post-section"));
  if (headingNodes.length === 0) {
    return;
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function ensureHeadingIds(headings) {
    const usedIds = new Set(
      Array.from(document.querySelectorAll("[id]"))
        .map(function(node) {
          return node.id;
        })
        .filter(Boolean)
    );

    headings.forEach(function(heading) {
      if (heading.id) {
        usedIds.add(heading.id);
        return;
      }
      const base = slugify(heading.textContent || "") || "secao";
      let candidate = base;
      let count = 2;
      while (usedIds.has(candidate)) {
        candidate = base + "-" + count;
        count += 1;
      }
      heading.id = candidate;
      usedIds.add(candidate);
    });
  }

  ensureHeadingIds(headingNodes);

  let linksContainer = contentSection.querySelector(".toc-links");
  if (!linksContainer) {
    linksContainer = document.createElement("div");
    linksContainer.className = "toc-links";
    if (title && title.nextSibling) {
      contentSection.insertBefore(linksContainer, title.nextSibling);
    } else {
      contentSection.appendChild(linksContainer);
    }
  }

  Array.from(contentSection.children).forEach(function(node) {
    if (node.tagName === "A") {
      node.remove();
    }
  });
  linksContainer.innerHTML = "";

  const targetItemsPerTab = 6;
  const tabCount = Math.max(2, Math.min(8, Math.ceil(headingNodes.length / targetItemsPerTab)));
  const chunkSize = Math.ceil(headingNodes.length / tabCount);
  const tabs = [];

  for (let i = 0; i < tabCount; i += 1) {
    const tabEl = document.createElement("section");
    tabEl.className = "toc-group";

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "toc-group-toggle";
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML =
      '<span class="toc-group-title"></span><span class="toc-group-count"></span>';
    toggle.querySelector(".toc-group-title").textContent = "Conteúdo";

    const linksEl = document.createElement("div");
    linksEl.className = "toc-group-links";

    tabEl.appendChild(toggle);
    tabEl.appendChild(linksEl);
    linksContainer.appendChild(tabEl);

    tabs.push({
      el: tabEl,
      toggle: toggle,
      linksEl: linksEl,
      countEl: toggle.querySelector(".toc-group-count"),
      links: []
    });
  }

  const sections = headingNodes.map(function(heading, index) {
    const tabIndex = Math.min(Math.floor(index / chunkSize), tabs.length - 1);
    const tab = tabs[tabIndex];
    const link = document.createElement("a");
    link.href = "#" + heading.id;
    link.textContent = heading.textContent ? heading.textContent.trim() : "Seção";
    tab.linksEl.appendChild(link);
    tab.links.push(link);
    return { link: link, section: heading, tab: tab };
  });

  tabs.forEach(function(tab) {
    tab.countEl.textContent = String(tab.links.length);
    if (tab.links.length === 0) {
      tab.el.classList.add("is-empty");
    }
  });

  function refreshTabTitles() {
    tabs.forEach(function(tab, idx) {
      if (tab.links.length === 0) {
        tab.toggle.querySelector(".toc-group-title").textContent = "Aba " + (idx + 1);
        return;
      }
      const first = tab.links[0].textContent || "";
      tab.toggle.querySelector(".toc-group-title").textContent = first.trim() || ("Aba " + (idx + 1));
    });
  }
  refreshTabTitles();

  let activeLink = null;
  let ticking = false;
  const markerOffset = 150;
  const collapseThreshold = 8;

  function refreshTabHeights() {
    tabs.forEach(function(tab) {
      if (tab.el.classList.contains("is-open")) {
        tab.linksEl.style.maxHeight = tab.linksEl.scrollHeight + "px";
      } else {
        tab.linksEl.style.maxHeight = "0px";
      }
    });
  }

  function setOpenTab(targetTab) {
    tabs.forEach(function(tab) {
      const isOpen = tab === targetTab && tab.links.length > 0;
      tab.el.classList.toggle("is-open", isOpen);
      tab.toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    refreshTabHeights();
  }

  tabs.forEach(function(tab) {
    tab.toggle.addEventListener("click", function() {
      setOpenTab(tab);
    });
  });

  function ensureActiveVisible(link) {
    if (!link) {
      return;
    }
    const current = sections.find(function(item) {
      return item.link === link;
    });
    if (!current) {
      return;
    }
    const containerRect = current.tab.linksEl.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const isAbove = linkRect.top < containerRect.top + 6;
    const isBelow = linkRect.bottom > containerRect.bottom - 6;
    if (isAbove || isBelow) {
      link.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }

  function setActive(link) {
    if (!link || link === activeLink) {
      return;
    }
    sections.forEach(function(item) {
      item.link.classList.remove("is-active");
    });
    link.classList.add("is-active");
    activeLink = link;

    const current = sections.find(function(item) {
      return item.link === link;
    });
    if (current) {
      setOpenTab(current.tab);
      ensureActiveVisible(link);
    }
  }

  function getActiveByScroll() {
    const markerDocY = window.scrollY + markerOffset;
    let current = sections[0];
    for (let i = 0; i < sections.length; i += 1) {
      const secDocY = sections[i].section.getBoundingClientRect().top + window.scrollY;
      if (secDocY <= markerDocY) {
        current = sections[i];
      } else {
        break;
      }
    }
    return current;
  }

  function onScroll() {
    if (ticking) {
      return;
    }
    ticking = true;
    window.requestAnimationFrame(function() {
      toc.classList.toggle("is-reading", window.scrollY > collapseThreshold);
      const current = getActiveByScroll();
      if (current) {
        setActive(current.link);
      }
      ticking = false;
    });
  }

  sections.forEach(function(item) {
    item.link.addEventListener("click", function() {
      setActive(item.link);
    });
  });

  window.addEventListener("resize", refreshTabHeights, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });

  const firstNonEmptyTab = tabs.find(function(tab) {
    return tab.links.length > 0;
  });
  if (firstNonEmptyTab) {
    setOpenTab(firstNonEmptyTab);
  }
  onScroll();
});
