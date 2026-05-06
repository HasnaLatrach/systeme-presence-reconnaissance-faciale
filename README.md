# Système de Présence par Reconnaissance Faciale

Ce projet est une application web de gestion de présence basée sur la reconnaissance faciale.  
Il permet d’enregistrer les étudiants, de détecter les visages à partir d’images, puis de gérer automatiquement la présence à l’aide d’un backend Python et d’une interface web moderne.

## Fonctionnalités

- Enregistrement des étudiants
- Ajout et stockage des visages enregistrés
- Reconnaissance faciale automatique
- Gestion des présences
- Interface web simple et moderne
- Communication entre frontend et backend via API
- Stockage des données dans une base de données locale

## Technologies utilisées

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Lucide React

### Backend
- Python
- FastAPI
- Uvicorn
- OpenCV
- face-recognition
- SQLite

## Structure du projet

```text
systeme-presence-reconnaissance-faciale/
│
├── backend/
│   ├── api_final.py
│   ├── database.py
│   ├── face_service.py
│   ├── face_system.py
│   ├── main.py
│   ├── schema.sql
│   └── requirement.txt
│
├── frontend_new/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── index.html
│
└── README.md
## Auteurs

Projet réalisé dans le cadre du module Base de Données par :

- LATRACH Hasna
- SOUIHLA Marwa
- CHATAR Imane
- EL HANBALI Douha 
