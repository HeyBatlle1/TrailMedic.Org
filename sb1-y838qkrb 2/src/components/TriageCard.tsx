import React from 'react';
import { AlertCircle } from 'lucide-react';

interface TriageCardProps {
  title: string;
  content: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  imageUrl?: string;
}

const TriageCard: React.FC<TriageCardProps> = ({
  title,
  content,
  severity = 'medium',
  imageUrl
}) => {
  // Severity-based styling
  const severityClasses = {
    low: {
      border: 'border-blue-700',
      bg: 'bg-blue-900/20',
      icon: 'text-blue-500',
      badge: 'bg-blue-700'
    },
    medium: {
      border: 'border-yellow-700',
      bg: 'bg-yellow-900/20',
      icon: 'text-yellow-500',
      badge: 'bg-yellow-700'
    },
    high: {
      border: 'border-orange-700',
      bg: 'bg-orange-900/20',
      icon: 'text-orange-500',
      badge: 'bg-orange-700'
    },
    critical: {
      border: 'border-red-700',
      bg: 'bg-red-900/20',
      icon: 'text-red-500',
      badge: 'bg-red-700'
    }
  };

  const classes = severityClasses[severity];

  const severityLabel = {
    low: 'Low Priority',
    medium: 'Medium Priority',
    high: 'High Priority', 
    critical: 'CRITICAL'
  }[severity];

  return (
    <div className={`rounded-lg ${classes.border} ${classes.bg} p-4 shadow-md mb-4`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <AlertCircle className={`${classes.icon} mr-2`} size={20} />
          <h3 className="font-bold text-white text-lg">{title}</h3>
        </div>
        <span className={`text-xs font-bold ${classes.badge} text-white px-2 py-1 rounded`}>
          {severityLabel}
        </span>
      </div>
      
      {imageUrl && (
        <div className="mb-3">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-40 object-cover rounded border border-gray-700"
          />
        </div>
      )}
      
      <div className="mt-2 text-gray-200 text-sm whitespace-pre-line">
        {content}
      </div>
    </div>
  );
};

export default TriageCard;