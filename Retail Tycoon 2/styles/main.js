window.addEventListener("DOMContentLoaded", () => {
  // Detect if we're inside the "pages" folder or in the root
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
  loadInclude("sidebar", `${base}includes/sidebar.html`);
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

// --- Run responsive setup after includes load ---
window.addEventListener("load", () => {
  setTimeout(setupResponsiveButtons, 300);
});
