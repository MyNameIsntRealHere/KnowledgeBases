import os
import urllib.parse

BASE_URL = "https://mynameisntrealhere.github.io/KnowledgeBases"
OUTPUT_FILE = "sitemap.xml"

def generate_sitemap(base_url, root_dir, output_file):
    urls = []

    for dirpath, _, filenames in os.walk(root_dir):
        # Skip hidden folders, .git, includes, styles, scripts, etc.
        if any(skip in dirpath for skip in [".git", "includes", "styles", "scripts", "__pycache__","404","google2e3a25bac580b9ff"]):
            continue

        for file in filenames:
            if not file.endswith(".html"):
                continue
            if file in ["index.html", "redirect.html"]:
                # Skip redirect pages or root indexes
                continue

            rel_path = os.path.relpath(os.path.join(dirpath, file), root_dir)
            encoded_path = urllib.parse.quote(rel_path.replace("\\", "/"))
            urls.append(f"{base_url}/{encoded_path}")

    # Generate XML content
    xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

    for url in sorted(urls):
        xml_content += f"  <url>\n    <loc>{url}</loc>\n  </url>\n"

    xml_content += "</urlset>\n"

    with open(output_file, "w", encoding="utf-8") as f:
        f.write(xml_content)

    print(f"✅ Sitemap generated: {output_file} ({len(urls)} URLs included)")

if __name__ == "__main__":
    generate_sitemap(BASE_URL, ".", OUTPUT_FILE)
