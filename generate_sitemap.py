import os

# === CONFIGURATION ===
BASE_URL = "https://yourusername.github.io/KnowledgeBases"  # <-- change this
ROOT_FOLDER = "."  # Path to your repo root
OUTPUT_FILE = "sitemap.xml"
# ======================

EXCLUDE_FILES = [
    "header.html",
    "sidebar.html",
    "redirect.html",  # if you ever have redirect helper pages
]

EXCLUDE_INDEXES = [
    "Retail Tycoon 2/index.html",  # your redirecting index
]

urls = []

for root, dirs, files in os.walk(ROOT_FOLDER):
    for file in files:
        if not file.endswith(".html"):
            continue

        filepath = os.path.join(root, file).replace("\\", "/")

        # Skip excluded files
        if any(filepath.endswith(ex) for ex in EXCLUDE_FILES):
            continue

        # Skip redirecting or root index
        if any(filepath.endswith(ex) for ex in EXCLUDE_INDEXES):
            continue

        # Skip hidden/system files
        if "/." in filepath:
            continue

        # Build relative URL
        rel_path = os.path.relpath(filepath, ROOT_FOLDER).replace("\\", "/")

        # Construct full URL
        url = f"{BASE_URL}/{rel_path}"
        urls.append(url)

# Generate sitemap XML
xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

for url in sorted(urls):
    xml += f"  <url><loc>{url}</loc></url>\n"

xml += "</urlset>"

# Save file
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    f.write(xml)

print(f"✅ Sitemap generated: {OUTPUT_FILE} ({len(urls)} URLs included)")
