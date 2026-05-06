
import re

path = "frontend_new/dist/assets/index-DWqW2o_x.js"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Pattern to find the button
pattern = r'r\.jsxs\("button",\{className:"flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-900/20 backdrop-blur-sm",children:\[r\.jsx\([a-zA-Z0-9_]+,\{className:"w-5 h-5"\}\),"Exporter \(PDF\)"\]\}\)'

match = re.search(pattern, content)
if match:
    print(f"Match found: {match.group(0)[:50]}...")
    new_content = content.replace(match.group(0), 'null')
    with open(path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Successfully patched file.")
else:
    print("Pattern not found. No changes made.")
