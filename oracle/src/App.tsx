import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MovieSubmissionPage from './pages/MovieSubmissionPage';
import PerformerSubmissionPage from './pages/PerformerSubmissionPage';
import UserDashboard from './pages/UserDashboard';
import LoginPage from './pages/LoginPage';
import OraclePage from './pages/OraclePage';
import EditMoviePage from './pages/EditMoviePage';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/oracle" element={<OraclePage />} />
          <Route path="/oracle/submit-movie" element={<MovieSubmissionPage />} />
          <Route path="/oracle/submit-performer" element={<PerformerSubmissionPage />} />
          <Route path="/oracle/edit-movie" element={<EditMoviePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;