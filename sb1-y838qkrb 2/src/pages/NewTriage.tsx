import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, FileX, Loader, Send, MapPin } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from '../context/AppContext';
import CameraCapture from '../components/CameraCapture';
import ActionButton from '../components/ActionButton';
import EmergencyDisclaimer from '../components/EmergencyDisclaimer';
import EmergencyLocationTracker from '../components/EmergencyLocationTracker';
import { TraumaAssessmentRequest } from '../types';
import { getTraumaAssessment } from '../services/medicalApi';

// Injury type options for quick selection
const INJURY_TYPES = [
  { id: 'bleeding', label: 'Bleeding', color: 'bg-red-700 hover:bg-red-600' },
  { id: 'bone', label: 'Broken Bone', color: 'bg-yellow-700 hover:bg-yellow-600' },
  { id: 'burn', label: 'Burn', color: 'bg-orange-700 hover:bg-orange-600' },
  { id: 'breathing', label: 'Breathing Issues', color: 'bg-blue-700 hover:bg-blue-600' },
  { id: 'unconscious', label: 'Unconscious', color: 'bg-purple-700 hover:bg-purple-600' },
  { id: 'other', label: 'Other', color: 'bg-gray-700 hover:bg-gray-600' }
];

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

const NewTriage: React.FC = () => {
  const navigate = useNavigate();
  const { saveInjuryToDatabase } = useAppContext();
  const [step, setStep] = useState<'capture' | 'describe' | 'assess' | 'processing'>('capture');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [selectedInjuryTypes, setSelectedInjuryTypes] = useState<string[]>([]);
  const [emergencyLocation, setEmergencyLocation] = useState<LocationData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New state for API fields
  const [conscious, setConscious] = useState(true);
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [obviousBleeding, setObviousBleeding] = useState(false);

  const handlePhotoCapture = (capturedPhotoUrl: string) => {
    setPhotoUrl(capturedPhotoUrl);
    setStep('describe');
  };

  const handleSkipPhoto = () => {
    setPhotoUrl(null);
    setStep('describe');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPhotoUrl(result);
        setStep('describe');
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleInjuryType = (injuryId: string) => {
    setSelectedInjuryTypes(prev => 
      prev.includes(injuryId) 
        ? prev.filter(id => id !== injuryId) 
        : [...prev, injuryId]
    );
  };

  const handleContinueToAssess = () => {
    setStep('assess');
  };

  const handleLocationUpdate = (location: LocationData) => {
    setEmergencyLocation(location);
  };

  const handleSubmitTriage = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      setStep('processing');

      // Prepare API request
      const request: TraumaAssessmentRequest = {
        mechanismOfInjury: description,
        reportedSymptoms: selectedInjuryTypes.map(type => 
          INJURY_TYPES.find(t => t.id === type)?.label || type
        ),
        conscious,
        age: age ? parseInt(age) : undefined,
        gender: gender || undefined,
        obviousBleeding
      };

      // Call API
      const apiResponse = await getTraumaAssessment(request);

      // Create new injury record with API response and location
      const newInjury = {
        id: uuidv4(),
        photoUrl: photoUrl || "https://images.pexels.com/photos/5879390/pexels-photo-5879390.jpeg",
        description,
        location: emergencyLocation ? {
          coords: {
            latitude: emergencyLocation.latitude,
            longitude: emergencyLocation.longitude,
            accuracy: emergencyLocation.accuracy
          },
          timestamp: emergencyLocation.timestamp
        } : undefined,
        timestamp: Date.now(),
        triageStatus: 'analyzed' as const,
        injuryType: selectedInjuryTypes,
        ...apiResponse // Spread API response fields
      };

      // Save to database
      await saveInjuryToDatabase(newInjury);
      navigate(`/triage/${newInjury.id}`);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during assessment');
      setStep('assess');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-lg">
      <EmergencyDisclaimer />

      {/* Emergency Location Tracker - Always visible */}
      <div className="mb-6">
        <EmergencyLocationTracker 
          onLocationUpdate={handleLocationUpdate}
          autoTrack={true}
        />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-4">
          Emergency Assessment
        </h2>
        
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          {error && (
            <div className="mb-4 bg-red-900/30 border border-red-800 rounded-lg p-4 text-red-300">
              {error}
            </div>
          )}

          {step === 'capture' && (
            <div className="space-y-4">
              <p className="text-gray-300 mb-4">
                Take a clear photo of the injury to begin the assessment.
              </p>
              
              {!showFileUpload ? (
                <>
                  <CameraCapture onPhotoCapture={handlePhotoCapture} />
                  
                  <div className="mt-6 flex space-x-3">
                    <ActionButton
                      label="Upload Photo"
                      onClick={() => setShowFileUpload(true)}
                      icon={<Upload size={18} />}
                      variant="secondary"
                      fullWidth
                    />
                    <ActionButton
                      label="Skip Photo"
                      onClick={handleSkipPhoto}
                      icon={<FileX size={18} />}
                      variant="secondary"
                      fullWidth
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center">
                    <Upload className="text-gray-400 mb-2" size={48} />
                    <p className="text-gray-300 mb-3 text-center">
                      Select a photo from your device
                    </p>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload}
                      className="hidden" 
                      id="photoUpload" 
                    />
                    <label 
                      htmlFor="photoUpload" 
                      className="bg-green-700 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-bold cursor-pointer"
                    >
                      Choose File
                    </label>
                  </div>
                  
                  <ActionButton
                    label="Return to Camera"
                    onClick={() => setShowFileUpload(false)}
                    variant="secondary"
                    fullWidth
                  />
                </div>
              )}
            </div>
          )}

          {step === 'describe' && (
            <div className="space-y-4">
              {photoUrl && (
                <div className="mb-4">
                  <img
                    src={photoUrl}
                    alt="Captured injury"
                    className="w-full h-48 object-cover rounded-lg border border-gray-700"
                  />
                </div>
              )}
              
              <div className="mb-4">
                <label 
                  htmlFor="description" 
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Describe the situation or injury:
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white h-24 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="E.g., Cut on forearm from falling, bleeding moderately"
                ></textarea>
              </div>

              <div className="flex space-x-3">
                {photoUrl ? (
                  <ActionButton
                    label="Retake Photo"
                    onClick={() => setStep('capture')}
                    icon={<Camera size={18} />}
                    variant="secondary"
                    fullWidth
                  />
                ) : (
                  <ActionButton
                    label="Take Photo"
                    onClick={() => setStep('capture')}
                    icon={<Camera size={18} />}
                    variant="secondary"
                    fullWidth
                  />
                )}
                <ActionButton
                  label="Continue"
                  onClick={handleContinueToAssess}
                  icon={<Send size={18} />}
                  variant="primary"
                  fullWidth
                />
              </div>
            </div>
          )}

          {step === 'assess' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-bold text-white mb-3">
                  Quick Assessment
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Patient Status:
                    </label>
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id="conscious"
                        checked={conscious}
                        onChange={(e) => setConscious(e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="conscious" className="text-white">
                        Patient is conscious
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="bleeding"
                        checked={obviousBleeding}
                        onChange={(e) => setObviousBleeding(e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="bleeding" className="text-white">
                        Obvious bleeding present
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-2">
                        Age (if known):
                      </label>
                      <input
                        type="number"
                        id="age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Age"
                      />
                    </div>
                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-2">
                        Gender (if relevant):
                      </label>
                      <select
                        id="gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Not specified</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-3">
                  Select all that apply to this emergency:
                </p>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {INJURY_TYPES.map(type => (
                    <button
                      key={type.id}
                      onClick={() => toggleInjuryType(type.id)}
                      className={`py-2 px-3 rounded-md text-white font-medium text-sm transition ${
                        selectedInjuryTypes.includes(type.id)
                          ? `${type.color} ring-2 ring-white`
                          : `${type.color.replace('hover:', '')} opacity-70`
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Status */}
              {emergencyLocation && (
                <div className="bg-green-900/30 border border-green-700 rounded-lg p-3">
                  <div className="flex items-center text-green-300">
                    <MapPin size={16} className="mr-2" />
                    <span className="text-sm font-medium">
                      Emergency location captured and ready for rescue teams
                    </span>
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-2">
                <ActionButton
                  label="Back"
                  onClick={() => setStep('describe')}
                  variant="secondary"
                  fullWidth
                />
                <ActionButton
                  label="Get Assessment"
                  onClick={handleSubmitTriage}
                  icon={<Send size={18} />}
                  variant="danger"
                  fullWidth
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center">
              <Loader className="animate-spin text-green-500 mb-4" size={48} />
              <p className="text-center text-gray-300">
                Analyzing emergency situation...
                <br />
                <span className="text-sm text-gray-400">
                  Please wait while we process your information
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewTriage;