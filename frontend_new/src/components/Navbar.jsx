import React, { useState } from 'react';
import { Camera, Users, BookOpen, UserPlus, Home, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3">
                        <div className="bg-emerald-600 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                            <Camera className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-800">FaceScan Presence</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-2">
                        <Link to="/" className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${isActive('/') ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'}`}>
                            <Home className="w-5 h-5" />
                            <span className="font-medium">Accueil</span>
                        </Link>
                        <Link to="/registration" className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${isActive('/registration') ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'}`}>
                            <UserPlus className="w-5 h-5" />
                            <span className="font-medium">Inscription</span>
                        </Link>
                        <Link to="/recognition" className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${isActive('/recognition') ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'}`}>
                            <Camera className="w-5 h-5" />
                            <span className="font-medium">Reconnaissance</span>
                        </Link>
                        <Link to="/attendance" className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${isActive('/attendance') ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'}`}>
                            <BookOpen className="w-5 h-5" />
                            <span className="font-medium">Présences</span>
                        </Link>
                        <Link to="/students" className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${isActive('/students') ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'}`}>
                            <Users className="w-5 h-5" />
                            <span className="font-medium">Étudiants</span>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg hover:bg-gray-100">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
                    <Link onClick={() => setIsOpen(false)} to="/" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/') ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600'}`}>
                        <Home className="w-5 h-5" />
                        <span className="font-medium">Accueil</span>
                    </Link>
                    <Link onClick={() => setIsOpen(false)} to="/registration" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/registration') ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600'}`}>
                        <UserPlus className="w-5 h-5" />
                        <span className="font-medium">Inscription</span>
                    </Link>
                    <Link onClick={() => setIsOpen(false)} to="/recognition" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/recognition') ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600'}`}>
                        <Camera className="w-5 h-5" />
                        <span className="font-medium">Reconnaissance</span>
                    </Link>
                    <Link onClick={() => setIsOpen(false)} to="/attendance" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/attendance') ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600'}`}>
                        <BookOpen className="w-5 h-5" />
                        <span className="font-medium">Présences</span>
                    </Link>
                    <Link onClick={() => setIsOpen(false)} to="/students" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/students') ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600'}`}>
                        <Users className="w-5 h-5" />
                        <span className="font-medium">Étudiants</span>
                    </Link>
                </div>
            )}
        </nav>
    );
}
