import React from 'react';
import { AlertTriangle, Stethoscope } from 'lucide-react';

const EmergencyDisclaimer: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-black to-red-900 border-2 border-red-800 rounded-lg p-4 mb-6 shadow-lg relative overflow-hidden">
      <div className="flex items-start relative z-10">
        <div className="flex-shrink-0 mr-2">
          <AlertTriangle className="text-red-500" size={24} />
        </div>
        <div className="flex-grow">
          <div className="flex items-center justify-center mb-1">
            <Stethoscope className="text-red-500 mr-2 animate-pulse" size={20} />
            <h3 className="text-red-500 font-bold text-lg tracking-wider">EMERGENCY USE ONLY</h3>
            <Stethoscope className="text-red-500 ml-2 animate-pulse" size={20} />
          </div>
          <p className="text-gray-200 text-sm leading-relaxed">
            This app is intended for wilderness survival situations where professional medical 
            help is unavailable. This is NOT a substitute for professional medical care.
          </p>
          <p className="text-gray-200 text-sm mt-2 font-semibold">
            Seek immediate professional medical attention whenever possible.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyDisclaimer;