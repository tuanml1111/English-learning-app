import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Flashcards from './pages/Flashcards';
import Grammar from './pages/Grammar';
import GrammarDetail from './pages/GrammarDetail';
import Vocabulary from './pages/Vocabulary';
import Quiz from './pages/NewQuiz';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes with layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="flashcards" element={<Flashcards />} />
          <Route path="grammar" element={<Grammar />} />
          <Route path="grammar/:id" element={<GrammarDetail />} />
          <Route path="vocabulary" element={<Vocabulary />} />
          <Route path="quiz" element={<Quiz />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
