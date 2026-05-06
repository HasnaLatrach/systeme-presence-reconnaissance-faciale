
path = "frontend_new/dist/assets/index-DWqW2o_x.js"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

idx = content.find("Exporter (PDF)")
if idx != -1:
    start = max(0, idx - 300)
    end = min(len(content), idx + 300)
    print(f"CONTEXT: {content[start:end]}")
else:
    print("String not found")
