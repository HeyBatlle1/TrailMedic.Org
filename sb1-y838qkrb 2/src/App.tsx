import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import NewTriage from './pages/NewTriage';
import TriageResult from './pages/TriageResult';
import History from './pages/History';
import Guides from './pages/Guides';
import AppHeader from './components/AppHeader';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="min-h-screen bg-gray-900 text-white">
            <AppHeader />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/triage/new" element={<NewTriage />} />
                <Route path="/triage/:id" element={<TriageResult />} />
                <Route path="/history" element={<History />} />
                <Route path="/guides" element={<Guides />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App