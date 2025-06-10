import React, { useRef, useState, useEffect } from 'react';
import { Camera, RotateCcw, Upload } from 'lucide-react';
import ActionButton from './ActionButton';

interface CameraCaptureProps {
  onPhotoCapture: (photoUrl: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onPhotoCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [attemptedCamera, setAttemptedCamera] = useState(false);

  useEffect(() => {
    // Clean up function to stop media stream
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      setAttemptedCamera(true);
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 } 
        } 
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraError(null);
      setHasPhoto(false);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError('Unable to access camera. Please check permissions or use the upload option instead.');
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
    startCamera();
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Match canvas size to video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the current video frame to the canvas
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const photoUrl = canvas.toDataURL('image/jpeg');
      setHasPhoto(true);
      
      // Stop the camera stream after capture
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      
      // Pass the captured photo URL up to the parent component
      onPhotoCapture(photoUrl);
    }
  };

  const retakePhoto = () => {
    setHasPhoto(false);
    startCamera();
  };

  const useFallbackImage = () => {
    // Fallback to a stock image for testing
    const fallbackImageUrl = "https://images.pexels.com/photos/5879390/pexels-photo-5879390.jpeg";
    onPhotoCapture(fallbackImageUrl);
  };

  // Start camera automatically on component mount
  useEffect(() => {
    startCamera();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-md overflow-hidden rounded-lg border-2 border-gray-700 bg-black shadow-lg">
        {cameraError ? (
          <div className="flex h-64 items-center justify-center bg-gray-900 p-4 text-center">
            <div className="space-y-4">
              <p className="text-red-500 mb-2">{cameraError}</p>
              <ActionButton
                label="Use Fallback Image"
                onClick={useFallbackImage}
                icon={<Upload />}
                variant="secondary"
              />
            </div>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline
              className={`w-full ${hasPhoto ? 'hidden' : 'block'}`}
            />
            <canvas 
              ref={canvasRef} 
              className={`w-full ${hasPhoto ? 'block' : 'hidden'}`} 
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
              {!hasPhoto ? (
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={switchCamera}
                    className="bg-gray-700 text-white p-3 rounded-full"
                  >
                    <RotateCcw size={24} />
                  </button>
                  <ActionButton
                    label="Capture Photo"
                    onClick={capturePhoto}
                    icon={<Camera />}
                    variant="danger"
                  />
                </div>
              ) : (
                <div className="flex justify-between">
                  <ActionButton
                    label="Retake"
                    onClick={retakePhoto}
                    icon={<RotateCcw />}
                    variant="secondary"
                  />
                  <ActionButton
                    label="Continue"
                    onClick={() => {}}
                    variant="primary"
                    className="invisible" // Just a placeholder for layout
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <p className="mt-3 text-center text-sm text-gray-400">
        Take a clear photo of the injury in good lighting
      </p>
    </div>
  );
};

export default CameraCapture;