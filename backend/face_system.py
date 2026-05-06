# face_system.py - Système de reconnaissance ultra simple
import cv2
import numpy as np
import os
import sqlite3
import json
from typing import List, Optional, Tuple
import hashlib
from pathlib import Path

class UltraSimpleFaceSystem:
    """
    Système de reconnaissance faciale ultra simple
    Utilise uniquement OpenCV et techniques basiques
    """
    
    def __init__(self):
        # Obtenir le répertoire du script
        self.base_dir = Path(__file__).parent.absolute()
        
        # Détecteur de visages OpenCV (pré-inclus)
        self.face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        )
        
        # Base de données SQLite (chemin absolu)
        self.db_path = str(self.base_dir / "face_system.db")
        
        # Dossier pour les visages enregistrés
        self.registered_faces_dir = self.base_dir / "registered_faces"
        self.registered_faces_dir.mkdir(exist_ok=True)
        
        self._init_db()
        
        print("✅ Système de reconnaissance initialisé (version ultra simple)")
    
    def _init_db(self):
        """Initialise la base de données"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Table pour les personnes
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS persons (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            email TEXT,
            student_class TEXT,
            features TEXT NOT NULL,
            image_path TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)
        
        # Migration simple pour les colonnes manquantes
        cursor.execute("PRAGMA table_info(persons)")
        columns = [column[1] for column in cursor.fetchall()]
        if 'email' not in columns:
            cursor.execute("ALTER TABLE persons ADD COLUMN email TEXT")
        if 'student_class' not in columns:
            cursor.execute("ALTER TABLE persons ADD COLUMN student_class TEXT")
            
        # Table pour les logs
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            action TEXT,
            person_name TEXT,
            confidence REAL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)
        
        conn.commit()
        conn.close()
    
    def _log_action(self, action: str, person_name: str = None, confidence: float = 0):
        """Journalise une action"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO logs (action, person_name, confidence) VALUES (?, ?, ?)",
            (action, person_name, confidence)
        )
        conn.commit()
        conn.close()
    
    def detect_face(self, image_path: str) -> Optional[dict]:
        """
        Détecte un visage et retourne ses caractéristiques basiques
        """
        try:
            # Charger l'image
            img = cv2.imread(image_path)
            if img is None:
                return None
            
            # Convertir en niveaux de gris
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # Détecter les visages
            faces = self.face_cascade.detectMultiScale(
                gray,
                scaleFactor=1.1,
                minNeighbors=5,
                minSize=(30, 30)
            )
            
            if len(faces) == 0:
                return None
            
            # Prendre le plus grand visage
            faces = sorted(faces, key=lambda x: x[2]*x[3], reverse=True)
            x, y, w, h = faces[0]
            
            # Extraire la région du visage
            face_region = img[y:y+h, x:x+w]
            
            # Redimensionner à taille fixe
            face_resized = cv2.resize(face_region, (100, 100))
            
            # Convertir en vecteur de caractéristiques simples
            # 1. Histogramme de couleur
            hist_b = cv2.calcHist([face_resized], [0], None, [16], [0, 256])
            hist_g = cv2.calcHist([face_resized], [1], None, [16], [0, 256])
            hist_r = cv2.calcHist([face_resized], [2], None, [16], [0, 256])
            
            # 2. Texture (gradients)
            gray_face = cv2.cvtColor(face_resized, cv2.COLOR_BGR2GRAY)
            sobelx = cv2.Sobel(gray_face, cv2.CV_64F, 1, 0, ksize=3)
            sobely = cv2.Sobel(gray_face, cv2.CV_64F, 0, 1, ksize=3)
            
            # 3. Combiner les caractéristiques
            features = []
            features.extend(hist_b.flatten().tolist())
            features.extend(hist_g.flatten().tolist())
            features.extend(hist_r.flatten().tolist())
            features.extend([np.mean(sobelx), np.std(sobelx)])
            features.extend([np.mean(sobely), np.std(sobely)])
            
            # Normaliser
            features = np.array(features)
            if np.linalg.norm(features) > 0:
                features = features / np.linalg.norm(features)
            
            return {
                'features': features.tolist(),
                'bbox': (int(x), int(y), int(w), int(h)),
                'face_image': face_region,
                'original_image': img
            }
            
        except Exception as e:
            print(f"Erreur détection: {e}")
            return None
    
    def register_person(self, name: str, image_path: str, email: str = None, student_class: str = None) -> Tuple[bool, str]:
        """Enregistre une nouvelle personne avec infos supp"""
        face_data = self.detect_face(image_path)
        
        if face_data is None:
            return False, "Aucun visage détecté dans l'image"
        
        # Vérifier si la personne existe déjà
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM persons WHERE name = ?", (name,))
        if cursor.fetchone():
            conn.close()
            return False, f"La personne '{name}' existe déjà"
        
        # Enregistrer
        cursor.execute(
            "INSERT INTO persons (name, email, student_class, features, image_path) VALUES (?, ?, ?, ?, ?)",
            (name, email, student_class, json.dumps(face_data['features']), image_path)
        )
        
        conn.commit()
        conn.close()
        
        # Sauvegarder l'image du visage
        face_path = str(self.registered_faces_dir / f"{name}.jpg")
        cv2.imwrite(face_path, face_data['face_image'])
        
        self._log_action("REGISTER", name, 100)
        
        return True, f"Personne '{name}' enregistrée avec succès"
    
    def recognize_person(self, image_path: str) -> Tuple[Optional[str], float]:
        """Reconnaît une personne"""
        face_data = self.detect_face(image_path)
        
        if face_data is None:
            return None, 0.0
        
        # Récupérer toutes les personnes
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT name, features FROM persons")
        persons = cursor.fetchall()
        conn.close()
        
        if not persons:
            return None, 0.0
        
        target_features = np.array(face_data['features'])
        best_match = None
        best_similarity = 0
        
        for name, features_json in persons:
            try:
                known_features = np.array(json.loads(features_json))
                
                # Calculer la similarité cosinus
                similarity = np.dot(target_features, known_features)
                
                if similarity > best_similarity:
                    best_similarity = similarity
                    best_match = name
            except:
                continue
        
        # Convertir en pourcentage
        confidence = best_similarity * 100
        
        # Seuil minimum
        if confidence > 65:  # Seuil augmenté pour plus de sécurité
            self._log_action("RECOGNIZE", best_match, confidence)
            return best_match, confidence
        else:
            self._log_action("UNKNOWN", None, confidence)
            return None, confidence

    def delete_person(self, name: str) -> Tuple[bool, str]:
        """Supprime une personne de la base et du système de fichiers"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Récupérer le chemin de l'image avant suppression
            cursor.execute("SELECT image_path FROM persons WHERE name = ?", (name,))
            row = cursor.fetchone()
            
            if not row:
                conn.close()
                return False, f"La personne '{name}' n'existe pas"
            
            # Supprimer de la base
            cursor.execute("DELETE FROM persons WHERE name = ?", (name,))
            cursor.execute("DELETE FROM logs WHERE person_name = ?", (name,))
            
            conn.commit()
            conn.close()
            
            # Supprimer les fichiers images
            image_path = row[0]
            if image_path and os.path.exists(image_path):
                try:
                    os.remove(image_path)
                except: pass
            
            face_path = str(self.registered_faces_dir / f"{name}.jpg")
            if os.path.exists(face_path):
                try:
                    os.remove(face_path)
                except: pass
            
            self._log_action("DELETE", name, 100)
            return True, f"Personne '{name}' supprimée avec succès"
            
        except Exception as e:
            return False, f"Erreur lors de la suppression: {str(e)}"

    def list_persons(self) -> List[dict]:
        """Liste toutes les personnes avec leurs infos complètes"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("""
            SELECT p.id, p.name, p.email, p.student_class, p.image_path, p.created_at, 
                   COUNT(l.id) as recognition_count
            FROM persons p
            LEFT JOIN logs l ON p.name = l.person_name AND l.action = 'RECOGNIZE'
            GROUP BY p.id
            ORDER BY p.name
        """)
        rows = cursor.fetchall()
        conn.close()
        
        return [
            {
                'id': row[0],
                'name': row[1],
                'email': row[2] or "N/A",
                'class': row[3] or "N/A",
                'image_path': row[4],
                'created_at': row[5],
                'recognition_count': row[6]
            }
            for row in rows
        ]
    
    def get_stats(self) -> dict:
        """Retourne des statistiques"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) FROM persons")
        person_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM logs WHERE action = 'RECOGNIZE'")
        recognition_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM logs WHERE action = 'UNKNOWN'")
        unknown_count = cursor.fetchone()[0]
        
        conn.close()
        
        return {
            'persons': person_count,
            'recognitions': recognition_count,
            'unknown_faces': unknown_count,
            'success_rate': recognition_count / (recognition_count + unknown_count + 1e-6) * 100
        }

# Test simple
if __name__ == "__main__":
    print("=== TEST SYSTÈME ULTRA SIMPLE ===")
    
    system = UltraSimpleFaceSystem()
    
    # Créer une image test
    test_img = np.zeros((300, 300, 3), dtype=np.uint8)
    # Dessiner un visage simple
    cv2.rectangle(test_img, (100, 100), (200, 200), (255, 200, 150), -1)  # Visage
    cv2.circle(test_img, (130, 130), 10, (0, 0, 255), -1)  # Œil gauche
    cv2.circle(test_img, (170, 130), 10, (0, 0, 255), -1)  # Œil droit
    cv2.ellipse(test_img, (150, 180), (25, 12), 0, 0, 180, (0, 255, 0), 3)  # Bouche
    
    os.makedirs("test", exist_ok=True)
    test_path = "test/test_face.jpg"
    cv2.imwrite(test_path, test_img)
    
    print("✅ Image test créée")
    
    # Tester
    success, msg = system.register_person("TestUser", test_path)
    print(f"Enregistrement: {msg}")
    
    if success:
        name, conf = system.recognize_person(test_path)
        print(f"Reconnaissance: {name} ({conf:.1f}%)")
    
    stats = system.get_stats()
    print(f"Statistiques: {stats}")
    
    # Nettoyer
    import shutil
    if os.path.exists("test"):
        shutil.rmtree("test")
    
    print("🎉 Test terminé avec succès!")