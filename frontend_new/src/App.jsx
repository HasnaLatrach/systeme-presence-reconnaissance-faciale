import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RecognitionPage from './pages/RecognitionPage';
import RegistrationPage from './pages/RegistrationPage';
import AttendancePage from './pages/AttendancePage';
import StudentsPage from './pages/StudentsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recognition" element={<RecognitionPage />} />
            <Route path="/registration" element={<RegistrationPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/students" element={<StudentsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
