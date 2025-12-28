const isGitHub = location.hostname === "MyNameIsntRealHere.github.io";

const BASE = isGitHub
  ? "/KnowledgeBases/"
  : "../../";


// search.js — RT2 Knowledge Base Search
// Requires Fuse.js to be loaded before this file

document.addEventListener("DOMContentLoaded", async () => {
  const searchInput = document.getElementById("search");
  const resultsBox = document.getElementById("search-results");

  // Only run on the search page
  if (!searchInput || !resultsBox) return;

  // Auto-focus search bar
  searchInput.focus();

  // Fetch sitemap to discover pages
  let pages = [];
  try {
    const res = await fetch(`${BASE}sitemap.xml`);
    const text = await res.text();

    const urls = [...text.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);

    // Fetch each page and extract title + content
    for (const url of urls) {
      try {
        const pageRes = await fetch(url);
        const html = await pageRes.text();

        const doc = new DOMParser().parseFromString(html, "text/html");

        let title = doc.querySelector("title")?.innerText ?? "Untitled";
        title = title.split("|")[0].trim();

        const content = doc.body.innerText.replace(/\s+/g, " ").trim();

        pages.push({
          title,
          content,
          url
        });
      } catch {
        // Skip pages that fail to load
      }
    }
  } catch (err) {
    resultsBox.innerHTML = "<p>Search index failed to load.</p>";
    return;
  }

  // Initialize Fuse
  const fuse = new Fuse(pages, {
    keys: ["title", "content"],
    threshold: 0.3,
    ignoreLocation: true
  });

  // Search handler
  searchInput.addEventListener("input", e => {
    const query = e.target.value.trim();
    resultsBox.innerHTML = "";

    if (!query) return;

    const results = fuse.search(query).slice(0, 15);

    if (results.length === 0) {
      resultsBox.innerHTML = "<p>No results found.</p>";
      return;
    }

    results.forEach(r => {
      const a = document.createElement("a");
      a.href = r.item.url;
      a.className = "search-result";
      a.textContent = r.item.title;
      resultsBox.appendChild(a);
    });
  });
});
