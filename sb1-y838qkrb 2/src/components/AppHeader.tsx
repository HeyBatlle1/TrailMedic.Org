import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, AlertTriangle, LogOut, Cpu, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, guestMode, logout } = useAuth();
  const isHome = location.pathname === '/';

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-gray-900 border-b border-red-800 shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          {!isHome && (
            <button 
              onClick={() => navigate(-1)} 
              className="mr-2 text-gray-400 hover:text-white"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          
          <div className="flex items-center" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <div className="relative mr-3">
              <Cpu className="text-red-900" size={42} />
              <Activity className="absolute top-0 left-0 animate-pulse text-green-400" size={42} />
            </div>
            <h1 className="text-xl font-bold text-white font-inter tracking-tight">
              TrailMedic.Org
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-black to-red-900 px-2 py-1 rounded-md">
            <AlertTriangle size={16} className="text-red-500 mr-1 inline-block" />
            <span className="text-xs font-bold text-red-500 uppercase tracking-wider font-inter">
              Emergency Use Only
            </span>
          </div>

          {(user || guestMode) && (
            <button
              onClick={handleSignOut}
              className="text-gray-400 hover:text-white"
              title="Sign Out"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;