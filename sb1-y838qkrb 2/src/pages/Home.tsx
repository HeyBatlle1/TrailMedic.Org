import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, FileWarning, History, Cpu, Activity, UserCheck, Shield } from 'lucide-react';
import EmergencyDisclaimer from '../components/EmergencyDisclaimer';
import ActionButton from '../components/ActionButton';
import EmergencyContacts from '../components/EmergencyContacts';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { user, guestMode } = useAuth();

  // Show auth form if not authenticated and not in guest mode
  if (!user && !guestMode) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-lg">
        <div className="flex justify-center my-8">
          <div className="relative">
            <Cpu className="text-red-900" size={120} />
            <Activity className="absolute top-0 left-0 animate-pulse text-green-400" size={120} />
          </div>
        </div>
        <EmergencyDisclaimer />
        <AuthForm />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-lg">
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-6">
          <Cpu className="text-red-900" size={160} />
          <Activity className="absolute top-0 left-0 animate-pulse text-green-400" size={160} />
        </div>
        
        <h1 className="text-3xl font-bold text-white text-center mb-3">
          TrailMedic.Org
        </h1>
        <p className="text-gray-300 text-center">
          AI-powered emergency medical guidance with GPS tracking for wilderness survival situations
        </p>

        {/* Guest Mode Indicator */}
        {guestMode && (
          <div className="mt-4 bg-blue-900/30 border border-blue-700 rounded-lg p-3 w-full">
            <div className="flex items-center justify-center">
              <UserCheck className="text-blue-400 mr-2" size={18} />
              <span className="text-blue-300 text-sm font-medium">
                Guest Mode - Data stored locally
              </span>
            </div>
          </div>
        )}

        {/* Authenticated User Indicator */}
        {user && (
          <div className="mt-4 bg-green-900/30 border border-green-700 rounded-lg p-3 w-full">
            <div className="flex items-center justify-center">
              <Shield className="text-green-400 mr-2" size={18} />
              <span className="text-green-300 text-sm font-medium">
                Signed in - Data synced to cloud
              </span>
            </div>
          </div>
        )}
      </div>

      <EmergencyDisclaimer />
      
      <div className="grid grid-cols-1 gap-4 mb-8">
        <Link to="/triage/new" className="block">
          <ActionButton 
            label="New Emergency Assessment"
            onClick={() => {}}
            icon={<Camera size={20} />}
            variant="danger"
            fullWidth
          />
        </Link>
        
        <Link to="/guides" className="block">
          <ActionButton
            label="Medical Field Guides"
            onClick={() => {}}
            icon={<FileWarning size={20} />}
            variant="secondary"
            fullWidth
          />
        </Link>
        
        <Link to="/history" className="block">
          <ActionButton
            label="Assessment History"
            onClick={() => {}}
            icon={<History size={20} />}
            variant="secondary"
            fullWidth
          />
        </Link>
      </div>
      
      <EmergencyContacts />
      
      <footer className="mt-8 text-center">
        {/* Built with Bolt.New badge */}
        <div className="mb-4 flex justify-center">
          <a 
            href="https://bolt.new" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block transition-transform hover:scale-105"
          >
            <img 
              src="https://img.shields.io/badge/Built%20with-Bolt-blue?style=for-the-badge&logo=lightning&logoColor=white" 
              alt="Built with Bolt" 
              className="h-8 rounded shadow-lg border border-gray-600"
            />
          </a>
        </div>
        
        <div className="text-xs text-gray-500 space-y-1">
          <p>TrailMedic.Org v1.0</p>
          <p>For emergency use in wilderness survival situations only.</p>
          <p>Always seek professional medical help when available.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;