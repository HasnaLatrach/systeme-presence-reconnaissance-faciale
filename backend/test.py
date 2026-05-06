# test_simple.py - Script de test ultra simple
print("=== TEST DU PROJET ===")

# Test 1: Python fonctionne
print("1. ✅ Python fonctionne")

# Test 2: Vérifier les fichiers
import os
files_needed = ['main.py', 'requirements.txt', 'database.py', 'schema.sql']
print("\n2. 📁 Fichiers trouvés:")
for file in files_needed:
    if os.path.exists(file):
        print(f"   ✅ {file}")
    else:
        print(f"   ❌ {file} - MANQUANT!")

# Test 3: Lire schema.sql
print("\n3. 📄 Contenu de schema.sql:")
try:
    with open('schema.sql', 'r') as f:
        content = f.read()
        print(f"   ✅ Fichier lu ({len(content)} caractères)")
        # Afficher les premières lignes
        lines = content.split('\n')[:5]
        for i, line in enumerate(lines):
            print(f"      Ligne {i+1}: {line[:50]}..." if len(line) > 50 else f"      Ligne {i+1}: {line}")
except Exception as e:
    print(f"   ❌ Erreur: {e}")

print("\n=== FIN DU TEST ===")