import React, { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle, Database, AlertCircle } from 'lucide-react';

const API_URL = "http://localhost:8000";

export default function RecognitionPage() {
    const [isScanning, setIsScanning] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Camera error:", err);
            setError("Impossible d'accéder à la caméra");
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
    };

    const handleScan = async () => {
        if (isScanning) return;
        if (!videoRef.current || videoRef.current.readyState !== 4) {
            setError("La caméra n'est pas encore prête");
            return;
        }

        setIsScanning(true);
        setResult(null);
        setError(null);

        try {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);

            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
            if (!blob) {
                throw new Error("Impossible de capturer l'image");
            }

            const formData = new FormData();
            formData.append('file', blob, 'recognition.jpg');

            const response = await fetch(`${API_URL}/recognize`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            setResult(data);
        } catch (err) {
            console.error("Recognition error:", err);
            setError("Erreur de communication avec le serveur");
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-[#4B8FA9] to-[#2C5F7A]">
            {/* Hero Section */}
            <section className="pt-20 pb-20 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                            Reconnaissance Faciale
                        </h1>
                        <p className="text-xl text-white/80 max-w-3xl mx-auto mb-12">
                            Technologie avancée d'intelligence artificielle pour identifier et marquer automatiquement les présences
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleScan}
                                disabled={isScanning}
                                className="bg-white text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 disabled:opacity-50"
                            >
                                {isScanning ? 'Analyse en cours...' : 'Démarrer l\'analyse'}
                            </button>
                        </div>
                    </div>

                    {/* Scanner */}
                    <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                        <div className="aspect-video bg-black rounded-2xl relative overflow-hidden flex items-center justify-center">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                            />
                            <canvas ref={canvasRef} className="hidden" />

                            {/* Scanning Overlay */}
                            {isScanning && (
                                <div className="absolute inset-0 pointer-events-none">
                                    <div className="absolute inset-0 bg-green-500/10 animate-pulse"></div>
                                    <div className="absolute top-0 left-0 w-full h-1 bg-green-400 animate-[scan_2s_ease-in-out_infinite]"></div>
                                </div>
                            )}

                            {/* Result Overlay */}
                            {result && (
                                <div className={`absolute bottom-6 left-6 right-6 p-4 rounded-2xl backdrop-blur-md border ${result.recognized ? 'bg-green-500/20 border-green-500/50' : 'bg-red-500/20 border-red-500/50'}`}>
                                    <div className="flex items-center justify-between text-white">
                                        <div>
                                            <div className="text-xs uppercase font-bold tracking-widest opacity-75">
                                                {result.recognized ? 'Membre Identifié' : 'Alerte'}
                                            </div>
                                            <div className="text-2xl font-bold">
                                                {result.recognized ? result.name : 'Identité Inconnue'}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs uppercase font-bold tracking-widest opacity-75">Confiance</div>
                                            <div className="text-2xl font-bold">
                                                {Math.round(result.confidence)}%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="absolute top-6 px-6 py-3 bg-red-500 text-white rounded-full flex items-center gap-2 shadow-lg">
                                    <AlertCircle className="w-5 h-5" />
                                    <span>{error}</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 grid grid-cols-3 gap-4 text-center text-white">
                            <div className="bg-white/10 rounded-xl p-4">
                                <div className="text-3xl font-bold">98.5%</div>
                                <div className="text-white/70 text-sm mt-1">Précision</div>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4">
                                <div className="text-3xl font-bold">0.8s</div>
                                <div className="text-white/70 text-sm mt-1">Temps moyen</div>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4">
                                <div className="text-3xl font-bold">LIVE</div>
                                <div className="text-white/70 text-sm mt-1">Status</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Steps Info */}
            <section className="bg-white py-20 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-black mb-4">
                            Comment ça fonctionne ?
                        </h2>
                        <p className="text-gray-600 text-xl max-w-2xl mx-auto">
                            Un processus simple et sécurisé en trois étapes
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-blue-50 rounded-2xl p-8 hover:-translate-y-2 transition-transform duration-300">
                            <div className="bg-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                                <Camera className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">1. Capture</h3>
                            <p className="text-gray-600">
                                La caméra capture le visage de l'étudiant en temps réel avec une haute résolution.
                            </p>
                        </div>

                        <div className="bg-purple-50 rounded-2xl p-8 hover:-translate-y-2 transition-transform duration-300">
                            <div className="bg-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                                <Database className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">2. Comparaison</h3>
                            <p className="text-gray-600">
                                L'IA compare les caractéristiques faciales avec notre base de données sécurisée.
                            </p>
                        </div>

                        <div className="bg-green-50 rounded-2xl p-8 hover:-translate-y-2 transition-transform duration-300">
                            <div className="bg-green-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                                <CheckCircle className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">3. Validation</h3>
                            <p className="text-gray-600">
                                La présence est automatiquement enregistrée et confirmée instantanément.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
