# main.py - Point d'entrée principal
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import os

app = FastAPI(title="DROGING Face Recognition API")

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # À restreindre en production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Monte le dossier static pour servir les images
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def read_root():
    return {"message": "DROGING Face Recognition API", "status": "online"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "face_recognition"}

# TODO: Ajouter les endpoints ici

if __name__ == "__main__":

    
    print("🚀 DROGING API starting...")
    print("📚 API Docs: http://localhost:8000/docs")
    print("📁 Static files: http://localhost:8000/static")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True  # Redémarre automatiquement sur changement
    )