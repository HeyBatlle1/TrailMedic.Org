import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Clock, ArrowRight } from 'lucide-react';

const History: React.FC = () => {
  const { state } = useAppContext();
  const navigate = useNavigate();
  
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-lg">
      <h2 className="text-2xl font-bold text-white mb-6">Assessment History</h2>
      
      {state.injuryHistory.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
          <p className="text-gray-300 mb-2">No assessment history found</p>
          <p className="text-gray-400 text-sm">
            Previous emergency assessments will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {state.injuryHistory.map(injury => (
            <div 
              key={injury.id}
              onClick={() => navigate(`/triage/${injury.id}`)}
              className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center cursor-pointer hover:bg-gray-750 transition-colors"
            >
              <div className="w-16 h-16 flex-shrink-0 mr-4">
                <img 
                  src={injury.photoUrl} 
                  alt="Injury" 
                  className="w-full h-full object-cover rounded border border-gray-600"
                />
              </div>
              <div className="flex-grow">
                <p className="text-white font-medium truncate">
                  {injury.description || "Injury Assessment"}
                </p>
                <div className="flex items-center text-xs text-gray-400 mt-1">
                  <Clock size={12} className="mr-1" />
                  {formatDate(injury.timestamp)}
                </div>
                <div className="mt-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    injury.triageStatus === 'analyzed' ? 'bg-green-900 text-green-300' :
                    injury.triageStatus === 'completed' ? 'bg-blue-900 text-blue-300' :
                    'bg-yellow-900 text-yellow-300'
                  }`}>
                    {injury.triageStatus === 'analyzed' ? 'Assessed' :
                     injury.triageStatus === 'completed' ? 'Completed' :
                     'Pending'}
                  </span>
                </div>
              </div>
              <ArrowRight size={20} className="text-gray-500" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;