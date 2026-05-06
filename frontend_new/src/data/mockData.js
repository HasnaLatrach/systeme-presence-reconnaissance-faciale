const API_URL = "http://localhost:8000";

// BACKEND INTEGRATION:
// We now fetch real data from the FastAPI backend.

export const getAttendanceStats = async () => {
    try {
        const response = await fetch(`${API_URL}/stats`);
        const stats = await response.json();

        // Fetch persons to get the list
        const personsRes = await fetch(`${API_URL}/persons`);
        const personsData = await personsRes.json();

        return {
            total: stats.persons,
            present: stats.recognitions,
            absent: stats.unknown_faces,
            students: personsData.persons.map(p => ({
                id: `S${p.id.toString().padStart(3, '0')}`,
                name: p.name,
                class: p.class || 'N/A',
                status: 'present', // Simplified for now
                time: p.created_at,
                email: p.email || 'N/A',
                photo: `${API_URL}/registered_faces/${p.name}.jpg`
            }))
        };
    } catch (error) {
        console.error("Error fetching stats:", error);
        return { total: 0, present: 0, absent: 0, students: [] };
    }
};

export const getAllStudents = async () => {
    try {
        const response = await fetch(`${API_URL}/persons`);
        const data = await response.json();

        return data.persons.map(p => ({
            id: `S${p.id.toString().padStart(3, '0')}`,
            name: p.name,
            class: p.class || 'N/A',
            email: p.email || 'N/A',
            photo: `${API_URL}/registered_faces/${p.name}.jpg`
        }));
    } catch (error) {
        console.error("Error fetching students:", error);
        return [];
    }
};
