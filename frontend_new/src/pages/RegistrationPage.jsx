import React, { useState, useRef, useEffect } from 'react';
import { Camera, UserPlus, CheckCircle, AlertCircle } from 'lucide-react';

const API_URL = "http://localhost:8000";

export default function RegistrationPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [studentClass, setStudentClass] = useState('Groupe A');
    const [isRegistering, setIsRegistering] = useState(false);
    const [success, setSuccess] = useState(null);
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

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("Veuillez entrer un nom");
            return;
        }
        if (!videoRef.current || videoRef.current.readyState !== 4) {
            setError("La caméra n'est pas prête");
            return;
        }

        setIsRegistering(true);
        setError(null);
        setSuccess(null);

        try {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);

            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
            if (!blob) throw new Error("Capture échouée");

            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('student_class', studentClass);
            formData.append('file', blob, 'register.jpg');

            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(`L'étudiant ${name} a été enregistré avec succès !`);
                setName('');
                setEmail('');
                setStudentClass('Groupe A');
            } else {
                setError(data.detail || "Erreur lors de l'enregistrement");
            }
        } catch (err) {
            console.error("Registration error:", err);
            setError("Erreur de communication avec le serveur");
        } finally {
            setIsRegistering(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-[#4B8FA9] to-[#2C5F7A] py-12 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Nouvelle Inscription</h1>
                    <p className="text-blue-100 text-lg">Enregistrez un nouvel étudiant dans le système</p>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                    <form onSubmit={handleRegister} className="space-y-6">
                        {/* Inputs Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-white text-sm font-bold mb-3 uppercase tracking-wider">
                                    Nom complet
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ex: Jean Dupont"
                                    className="w-full bg-white/90 border-0 rounded-2xl px-6 py-4 text-gray-800 focus:ring-4 focus:ring-emerald-400/50 outline-none transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-white text-sm font-bold mb-3 uppercase tracking-wider">
                                    Classe
                                </label>
                                <select
                                    value={studentClass}
                                    onChange={(e) => setStudentClass(e.target.value)}
                                    className="w-full bg-white/90 border-0 rounded-2xl px-6 py-4 text-gray-800 focus:ring-4 focus:ring-emerald-400/50 outline-none transition-all font-medium appearance-none"
                                >
                                    <option value="" disabled>Sélectionner un groupe</option>
                                    <option value="Groupe A">Groupe A</option>
                                    <option value="Groupe B">Groupe B</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-white text-sm font-bold mb-3 uppercase tracking-wider">
                                Adresse Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="jean.dupont@email.com"
                                className="w-full bg-white/90 border-0 rounded-2xl px-6 py-4 text-gray-800 focus:ring-4 focus:ring-emerald-400/50 outline-none transition-all font-medium"
                            />
                        </div>

                        {/* Camera Preview */}
                        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border-2 border-white/10">
                            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                            <canvas ref={canvasRef} className="hidden" />

                            {/* Overlay message */}
                            {!name && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-8 text-center text-white/80">
                                    <p className="text-lg">Veuillez entrer un nom avant de capturer le visage</p>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-4">
                            <button
                                type="submit"
                                disabled={isRegistering || !name.trim()}
                                className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 shadow-xl"
                            >
                                {isRegistering ? (
                                    <>
                                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Enregistrement...</span>
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-6 h-6" />
                                        <span>Confirmer l'inscription</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Feedback Messages */}
                    {success && (
                        <div className="mt-8 bg-emerald-500/20 border border-emerald-500/50 p-6 rounded-2xl flex items-center gap-4 text-emerald-100 animate-in fade-in slide-in-from-bottom-4">
                            <CheckCircle className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                            <p className="font-medium text-lg">{success}</p>
                        </div>
                    )}

                    {error && (
                        <div className="mt-8 bg-red-500/20 border border-red-500/50 p-6 rounded-2xl flex items-center gap-4 text-red-100 animate-in fade-in slide-in-from-bottom-4">
                            <AlertCircle className="w-8 h-8 text-red-400 flex-shrink-0" />
                            <p className="font-medium text-lg">{error}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
