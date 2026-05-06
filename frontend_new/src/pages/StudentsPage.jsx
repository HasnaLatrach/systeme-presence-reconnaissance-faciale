import React, { useState, useEffect } from 'react';
import { Search, Users, Loader2, Mail } from 'lucide-react';
import { getAllStudents } from '../data/mockData';

export default function StudentsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('all');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getAllStudents().then((data) => {
            setStudents(data);
            setLoading(false);
        });
    }, []);

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGroup = selectedGroup === 'all' || student.class === selectedGroup;
        return matchesSearch && matchesGroup;
    });

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
                        <h1 className="text-4xl font-bold text-white mb-2">Liste des étudiants</h1>
                        <p className="text-blue-100 text-lg">Gestion complète de la base de données étudiants</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold px-6 py-3 rounded-full text-lg shadow-xl">
                        {filteredStudents.length} étudiant(s) {selectedGroup !== 'all' ? `dans le ${selectedGroup}` : ''}
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20 shadow-xl space-y-6">
                    <div className="relative text-gray-700">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Rechercher par nom ou code étudiant..."
                            className="w-full pl-12 pr-4 py-4 bg-white/90 border-0 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-400/50 transition-all font-medium placeholder:text-gray-400"
                        />
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {['all', 'Groupe A', 'Groupe B'].map((group) => (
                            <button
                                key={group}
                                onClick={() => setSelectedGroup(group)}
                                className={`px-6 py-2 rounded-full font-bold transition-all ${selectedGroup === group
                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                                    }`}
                            >
                                {group === 'all' ? 'Tous les étudiants' : group}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20">
                    <div className="flex items-center gap-3 mb-8">
                        <Users className="w-6 h-6 text-emerald-600" />
                        <h2 className="text-2xl font-bold text-gray-800">Tous les étudiants</h2>
                    </div>

                    {filteredStudents.length === 0 ? (
                        <div className="py-20 text-center">
                            <div className="flex justify-center mb-6">
                                <Users className="w-32 h-32 text-gray-200" />
                            </div>
                            <p className="text-gray-600 text-xl font-medium mb-3">
                                Aucun étudiant trouvé
                            </p>
                            <p className="text-gray-400 text-lg">
                                Essayez une autre recherche.
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredStudents.map((student) => (
                                <div key={student.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                                    <div className="flex items-start justify-between mb-4">
                                        <img
                                            src={student.photo}
                                            alt={student.name}
                                            className="w-16 h-16 rounded-2xl object-cover shadow-md border-2 border-white group-hover:border-emerald-400 transition-colors"
                                        />
                                        <span className="bg-gray-50 text-gray-500 text-xs px-2 py-1 rounded-md border border-gray-100 font-mono font-medium">
                                            {student.id}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-emerald-700 transition-colors">{student.name}</h3>
                                    <p className="text-gray-400 mb-4 text-sm flex items-center gap-2">
                                        <Mail className="w-3 h-3" />
                                        {student.email}
                                    </p>
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                                        <span className="text-sm font-semibold text-gray-400">Classe</span>
                                        <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-sm font-bold">{student.class}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Floating Help Button */}
                <button className="fixed bottom-8 right-8 bg-gray-900 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors z-40 hover:scale-110">
                    <span className="text-xl font-bold">?</span>
                </button>
            </div>
        </div>
    );
}
