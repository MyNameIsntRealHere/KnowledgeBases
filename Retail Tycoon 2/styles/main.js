window.addEventListener("DOMContentLoaded", () => {
  const pathDepth = window.location.pathname.split("/").filter(p => p).length;
  const isGitHub = location.hostname === "MyNameIsntRealHere.github.io";

  let base;
  if (isGitHub) {
    base = "/KnowledgeBases/Retail Tycoon 2/"; // 👈 adjust this to match your actual repo name if different
  } else {
    // If current file is in /pages/, go one level up
    base = window.location.pathname.includes("/pages/") ? "../" : "./";
  }

  // Load includes dynamically
  loadInclude("header", `${base}includes/header.html`);
  fetch(`${base}includes/sidebar.html`)
  .then(res => res.text())
  .then(html => {
    document.getElementById("sidebar").innerHTML = html;
    highlightSidebarCategory(); // 🔹 Run after sidebar is loaded
  })
  .catch(err => {
    console.error(err);
    document.getElementById("sidebar").innerHTML = `<p>Failed to load sidebar</p>`;
  });
});

// --- Function to load external HTML includes ---
function loadInclude(id, url) {
  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to load ${url}`);
      return res.text();
    })
    .then((html) => {
      document.getElementById(id).innerHTML = html;
    })
    .catch((err) => {
      console.error(err);
      document.getElementById(id).innerHTML = `<p>Failed to load ${id}</p>`;
    });
}

// --- Dynamic in-page navigation ---
function loadPage(page, addToHistory = true) {
  fetch(`pages/${page}.html`)
    .then((res) => (res.ok ? res.text() : Promise.reject()))
    .then((html) => {
      const content = document.getElementById("content");
      content.innerHTML = html;
      content.scrollTop = 0;

      if (addToHistory) {
        history.pushState({ page }, "", `#${page}`);
      }
    })
    .catch(() => {
      document.getElementById("content").innerHTML =
        "<h4>404</h4><h5>Oops! The page you're looking for doesn't exist (yet).</h5><h5>You can use the sidebar to view another page.</h5><h5>If you think this is a mistake, feel free to contact MyNameIsntRealHere via Discord (@kwallentrein) or Roblox (@MyNameIsntRealHere)!</h5>";
    });
}

// --- Back/forward button support ---
window.addEventListener("popstate", (event) => {
  if (event.state && event.state.page) {
    loadPage(event.state.page, false);
  } else {
    window.location.href = "index.html";
  }
});

// --- Smooth scroll function ---
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// --- Sidebar toggle ---
document.addEventListener("click", (e) => {
  if (e.target.id === "menuToggle") {
    document.getElementById("sidebar").classList.toggle("active");
  }
});

// --- Move header buttons into sidebar on small screens ---
function setupResponsiveButtons() {
  const headerButtons = document.querySelector(".headerbuttons");
  const sidebar = document.getElementById("sidebar");

  if (!headerButtons || !sidebar) return;

  function moveButtons() {
    if (window.innerWidth <= 800) {
      if (!sidebar.contains(headerButtons)) {
        sidebar.prepend(headerButtons);
      }
    } else {
      const header = document.getElementById("header");
      if (!header.contains(headerButtons)) {
        header.appendChild(headerButtons);
      }
    }
  }

  moveButtons();
  window.addEventListener("resize", moveButtons);
}

window.addEventListener("load", () => {
  setTimeout(() => {
    setupResponsiveButtons();
    showUpdateWarnings(); // 👈 ADD THIS
  }, 300);
});


function highlightSidebarCategory() {
  const currentPath = window.location.pathname;

  const match = currentPath.match(/\/pages\/([a-z]+)-/i);
  const categoryName = match ? match[1].toLowerCase() : null;

  const categories = document.querySelectorAll("details");

  categories.forEach((details) => {
    const summaryText = details.querySelector("summary")?.innerText.toLowerCase();

    if (categoryName && summaryText.includes(categoryName)) {
      details.setAttribute("open", "true"); // Expand correct section
    } else {
      details.removeAttribute("open");
    }

    // Highlight active page link
    details.querySelectorAll("a").forEach((link) => {
      const linkHref = link.getAttribute("href");
      if (currentPath.endsWith(linkHref)) {
        link.classList.add("active-page");
      }
    });
  });
}

function showUpdateWarnings() {
  const container = document.getElementById("update-warnings");
  if (!container) return;

  const pageMeta = document.querySelector('meta[name="kb-page"]');
  if (!pageMeta) return;

  const pageId = pageMeta.content;

  Object.entries(KB_UPDATES).forEach(([version, data]) => {
    const matches = data.pages.some(p =>
      p.endsWith("*")
        ? pageId.startsWith(p.replace("*", ""))
        : pageId === p
    );

    if (matches) {
      const warning = document.createElement("div");
      warning.className = "update-warning";
      warning.innerHTML = `
        <strong>⚠ Game update ${version}</strong><br>
        ${data.message}
      `;
      container.appendChild(warning);
    }
  });
}
