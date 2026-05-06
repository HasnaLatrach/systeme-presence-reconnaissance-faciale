import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Filter, Calendar, Loader2 } from 'lucide-react';
import { getAttendanceStats } from '../data/mockData';

export default function AttendancePage() {
    const [selectedDate, setSelectedDate] = useState('01/01/2026');
    const [selectedClass, setSelectedClass] = useState('all');
    const [selectedSession, setSelectedSession] = useState('all');

    const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, students: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching data for the selected date/filter
        setLoading(true);
        getAttendanceStats().then((data) => {
            setStats(data);
            setLoading(false);
        });
    }, [selectedDate, selectedClass]);

    const filteredStudents = stats.students.filter(s => {
        if (selectedClass === 'all') return true;
        const sClass = (s.class || "").trim().toLowerCase();
        const selClass = (selectedClass || "").trim().toLowerCase();
        return sClass === selClass;
    });
    const presentStudents = filteredStudents.filter(s => s.status === 'present');
    const absentStudents = filteredStudents.filter(s => s.status === 'absent');

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-[#4B8FA9] to-[#2C5F7A] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-white animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-[#4B8FA9] to-[#2C5F7A] text-white">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-in fade-in duration-500">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Gestion des présences</h1>
                        <p className="text-blue-100 text-lg">Suivi en temps réel de la base de données</p>
                    </div>

                </div>

                {/* Filters */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20 shadow-xl">
                    <div className="flex items-center gap-2 mb-6 text-white">
                        <Filter className="w-5 h-5" />
                        <h2 className="text-xl font-bold">Filtres de la base de données</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-blue-100 mb-2">Date</label>
                            <div className="relative text-gray-800">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-white/90 border-0 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:bg-white transition-all shadow-inner"
                                    placeholder="JJ/MM/AAAA"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-blue-100 mb-2">Groupe</label>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="w-full px-4 py-3 bg-white/90 border-0 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:bg-white text-gray-800 transition-all shadow-inner font-medium"
                            >
                                <option value="all">Tous les groupes</option>
                                <option value="Groupe A">Groupe A</option>
                                <option value="Groupe B">Groupe B</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-blue-100 mb-2">Séance</label>
                            <select
                                value={selectedSession}
                                onChange={(e) => setSelectedSession(e.target.value)}
                                className="w-full px-4 py-3 bg-white/90 border-0 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:bg-white text-gray-800 transition-all shadow-inner"
                            >
                                <option value="all">Toutes les séances</option>
                                <option value="morning">Matin</option>
                                <option value="afternoon">Après-midi</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 font-medium mb-1">Total étudiants</p>
                                <p className="text-5xl font-bold text-white">{filteredStudents.length}</p>
                            </div>
                            <div className="bg-blue-500/30 p-4 rounded-2xl text-blue-100">
                                <CheckCircle size={32} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-emerald-100 font-medium mb-1">Présents</p>
                                <p className="text-5xl font-bold text-white">{presentStudents.length}</p>
                            </div>
                            <div className="bg-emerald-500/30 p-4 rounded-2xl text-emerald-100">
                                <CheckCircle size={32} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-rose-500/20 to-rose-600/20 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-rose-100 font-medium mb-1">Absents</p>
                                <p className="text-5xl font-bold text-white">{absentStudents.length}</p>
                            </div>
                            <div className="bg-rose-500/30 p-4 rounded-2xl text-rose-100">
                                <XCircle size={32} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Present Students Section */}
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 mb-8 border border-white/20">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-emerald-600" />
                            <h2 className="text-2xl font-bold text-gray-800">Étudiants présents</h2>
                        </div>
                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold shadow-sm">{presentStudents.length}</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-gray-500 text-sm uppercase tracking-wider">
                                <tr>
                                    <th className="p-4 rounded-l-xl">Nom Complet</th>
                                    <th className="p-4">Classe</th>
                                    <th className="p-4">Heure d'arrivée</th>
                                    <th className="p-4 rounded-r-xl">Email</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {presentStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-blue-50/50 transition-colors group">
                                        <td className="p-4 font-semibold text-gray-800 flex items-center gap-3">
                                            <img
                                                src={student.photo}
                                                alt={student.name}
                                                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                            />
                                            {student.name}
                                        </td>
                                        <td className="p-4"><span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">{student.class}</span></td>
                                        <td className="p-4 text-emerald-600 font-mono font-medium">{student.time}</td>
                                        <td className="p-4 text-gray-400 text-sm">{student.email}</td>
                                    </tr>
                                ))}
                                {presentStudents.length === 0 && (
                                    <tr><td colSpan="4" className="p-8 text-center text-gray-400">Aucun étudiant présent pour le moment.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Absent Students Section */}
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <XCircle className="w-6 h-6 text-rose-600" />
                            <h2 className="text-2xl font-bold text-gray-800">Étudiants absents</h2>
                        </div>
                        <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full font-bold shadow-sm">{absentStudents.length}</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-gray-500 text-sm uppercase tracking-wider">
                                <tr>
                                    <th className="p-4 rounded-l-xl">Nom Complet</th>
                                    <th className="p-4">Classe</th>
                                    <th className="p-4 text-rose-500">Statut</th>
                                    <th className="p-4 rounded-r-xl">Email</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {absentStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-rose-50/30 transition-colors">
                                        <td className="p-4 font-semibold text-gray-800 flex items-center gap-3">
                                            <img
                                                src={student.photo}
                                                alt={student.name}
                                                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm grayscale"
                                            />
                                            {student.name}
                                        </td>
                                        <td className="p-4"><span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">{student.class}</span></td>
                                        <td className="p-4 text-rose-500 font-bold uppercase text-xs tracking-wider">Absent</td>
                                        <td className="p-4 text-gray-400 text-sm">{student.email}</td>
                                    </tr>
                                ))}
                                {absentStudents.length === 0 && (
                                    <tr><td colSpan="4" className="p-8 text-center text-gray-400">Tous les étudiants sont présents !</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
