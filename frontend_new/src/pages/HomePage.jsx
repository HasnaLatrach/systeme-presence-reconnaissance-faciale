import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Shield, Zap, Database } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-[#4B8FA9] to-[#2C5F7A]">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">

                {/* Hero Section */}
                <div className="flex flex-col items-center text-center space-y-12">
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight max-w-5xl">
                        Système de reconnaissance faciale
                    </h1>
                    <p className="text-xl md:text-2xl text-blue-100 max-w-3xl leading-relaxed">
                        Marquez automatiquement les présences des étudiants grâce à
                        l’intelligence artificielle et une base de données sécurisée.
                    </p>

                    <div className="flex flex-wrap gap-6 justify-center">
                        <Link to="/recognition" className="bg-white text-blue-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl">
                            Lancer la reconnaissance
                        </Link>
                        <Link to="/attendance" className="px-8 py-4 rounded-xl border border-white/30 text-white font-bold text-lg hover:bg-white/10 transition-all">
                            Voir les présences
                        </Link>
                    </div>
                </div>

                {/* Feature/Context Section (Figma's 'Device Frame' Placeholder) */}
                <div className="mt-24 relative max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 bg-black/20 backdrop-blur-sm aspect-video flex items-center justify-center group">
                    {/* Abstract Visualization */}
                    <div className="text-white/30 text-center p-8">
                        <Camera size={64} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-mono">Simulateur de flux vidéo</p>
                    </div>
                </div>

                {/* Why Use Us Section */}
                <div className="mt-32 grid md:grid-cols-2 gap-16 items-center bg-white/5 p-12 rounded-3xl backdrop-blur-sm border border-white/10">
                    <div>
                        <h2 className="text-4xl font-bold text-white mb-6">Pourquoi utiliser notre système ?</h2>
                        <p className="text-blue-100 text-lg leading-relaxed">
                            Une solution moderne pour automatiser la gestion des présences
                            en utilisant la reconnaissance faciale et une base de données fiable.
                            Fini les feuilles de papier et les erreurs de saisie.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white/10 p-6 rounded-2xl">
                            <Zap className="text-yellow-400 mb-4" size={32} />
                            <h3 className="text-white font-bold text-lg">Rapide</h3>
                        </div>
                        <div className="bg-white/10 p-6 rounded-2xl">
                            <Shield className="text-green-400 mb-4" size={32} />
                            <h3 className="text-white font-bold text-lg">Sécurisé</h3>
                        </div>
                        <div className="bg-white/10 p-6 rounded-2xl">
                            <Database className="text-blue-400 mb-4" size={32} />
                            <h3 className="text-white font-bold text-lg">Fiable</h3>
                        </div>
                        <div className="bg-white/10 p-6 rounded-2xl">
                            <Camera className="text-purple-400 mb-4" size={32} />
                            <h3 className="text-white font-bold text-lg">IA</h3>
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-32 border-t border-white/20 pt-12 grid md:grid-cols-4 gap-8 text-blue-100/80">
                    <div>
                        <h4 className="text-white font-bold mb-4">ENSET Mohammedia</h4>
                        <p>École Normale Supérieure de l’Enseignement Technique</p>
                        <p>Mohammedia – Maroc</p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Application</h4>
                        <p>Accueil</p>
                        <p>Reconnaissance</p>
                        <p>Présences</p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Projet</h4>
                        <p>Base de données</p>
                        <p>IA</p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Encadrement</h4>
                        <p>Dépt. Informatique</p>
                        <p>2025/2026</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
