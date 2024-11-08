import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/admin/AdminRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/admin/LoginPage';
import EventsPage from './pages/admin/EventsPage';
import CompetitionsPage from './pages/admin/CompetitionsPage';
import NFTMarketplace from './pages/NFTMarketplace';
import Dashboard from './pages/Dashboard';
import CompetitionPage from './pages/CompetitionPage';
import OraclePage from './pages/OraclePage';
import EditMoviePage from './pages/EditMoviePage';
import EditMovieDetailsPage from './pages/EditMovieDetailsPage';
import MovieSubmissionPage from './pages/MovieSubmissionPage';
import MovieScenesPage from './pages/MovieScenesPage';
import PerformerProfilePage from './pages/PerformerProfilePage';
import LeaderboardPage from './pages/LeaderboardPage';
import RewardsPage from './pages/RewardsPage';
import UserProfilePage from './pages/UserProfilePage';
import FAQPage from './pages/FAQPage';
import PerformerSubmissionPage from './pages/PerformerSubmissionPage';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-gray-100">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/events" element={
                <AdminRoute>
                  <EventsPage />
                </AdminRoute>
              } />
              <Route path="/admin/competitions" element={
                <AdminRoute>
                  <CompetitionsPage />
                </AdminRoute>
              } />
              <Route path="/marketplace" element={
                <PrivateRoute>
                  <NFTMarketplace />
                </PrivateRoute>
              } />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/competition" element={
                <PrivateRoute>
                  <CompetitionPage />
                </PrivateRoute>
              } />
              <Route path="/oracle" element={
                <PrivateRoute>
                  <OraclePage />
                </PrivateRoute>
              } />
              <Route path="/oracle/edit-movie" element={
                <PrivateRoute>
                  <EditMoviePage />
                </PrivateRoute>
              } />
              <Route path="/oracle/edit-movie/:movieId" element={
                <PrivateRoute>
                  <EditMovieDetailsPage />
                </PrivateRoute>
              } />
              <Route path="/oracle/submit-movie" element={
                <PrivateRoute>
                  <MovieSubmissionPage />
                </PrivateRoute>
              } />
              <Route path="/oracle/submit-movie/scenes" element={
                <PrivateRoute>
                  <MovieScenesPage />
                </PrivateRoute>
              } />
              <Route path="/oracle/submit-performer" element={
                <PrivateRoute>
                  <PerformerSubmissionPage />
                </PrivateRoute>
              } />
              <Route path="/performer/:id" element={<PerformerProfilePage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/rewards" element={
                <PrivateRoute>
                  <RewardsPage />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <UserProfilePage />
                </PrivateRoute>
              } />
              <Route path="/faq" element={<FAQPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;