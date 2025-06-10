import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Copy, Share2, Wifi, WifiOff, Navigation, Target } from 'lucide-react';
import ActionButton from './ActionButton';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface EmergencyLocationTrackerProps {
  onLocationUpdate?: (location: LocationData) => void;
  autoTrack?: boolean;
}

const EmergencyLocationTracker: React.FC<EmergencyLocationTrackerProps> = ({
  onLocationUpdate,
  autoTrack = true
}) => {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [lastKnownLocation, setLastKnownLocation] = useState<LocationData | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [error, setError] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  
  const mapRef = useRef<HTMLDivElement>(null);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load cached location on mount
  useEffect(() => {
    const cached = localStorage.getItem('lastEmergencyLocation');
    if (cached) {
      try {
        const location = JSON.parse(cached);
        setLastKnownLocation(location);
        if (!currentLocation) {
          setCurrentLocation(location);
        }
      } catch (e) {
        console.error('Error loading cached location:', e);
      }
    }
  }, []);

  // Load Google Maps API dynamically
  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        // Check if Google Maps is already loaded
        if (window.google && window.google.maps) {
          setMapsLoaded(true);
          return;
        }

        // Create script element
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBtGwBiJIxmpE2FgDJo1sIc_58zVy1W4No&libraries=places&loading=async`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          setMapsLoaded(true);
        };
        
        script.onerror = () => {
          console.error('Failed to load Google Maps API');
          setError('Failed to load map. GPS coordinates will still be available.');
        };

        document.head.appendChild(script);
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load map. GPS coordinates will still be available.');
      }
    };

    loadGoogleMaps();
  }, []);

  // Initialize map when Google Maps is loaded and we have a location
  useEffect(() => {
    if (mapsLoaded && mapRef.current && !map && (currentLocation || lastKnownLocation)) {
      try {
        const initialLocation = currentLocation || lastKnownLocation || {
          latitude: 40.7128,
          longitude: -74.0060,
          accuracy: 0,
          timestamp: Date.now()
        };

        const mapInstance = new google.maps.Map(mapRef.current, {
          center: { lat: initialLocation.latitude, lng: initialLocation.longitude },
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.HYBRID,
          disableDefaultUI: true,
          zoomControl: true,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        // Create emergency marker
        const markerInstance = new google.maps.Marker({
          position: { lat: initialLocation.latitude, lng: initialLocation.longitude },
          map: mapInstance,
          title: 'Emergency Location',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: '#dc2626',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3
          }
        });

        setMap(mapInstance);
        setMarker(markerInstance);
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to initialize map. GPS coordinates will still be available.');
      }
    }
  }, [mapsLoaded, mapRef.current, currentLocation, lastKnownLocation, map]);

  // Auto-tracking effect
  useEffect(() => {
    if (autoTrack && !isTracking) {
      startTracking();
    }
    
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [autoTrack]);

  const updateLocation = (position: GeolocationPosition) => {
    const locationData: LocationData = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: Date.now()
    };

    setCurrentLocation(locationData);
    setLastKnownLocation(locationData);
    setError(null);

    // Cache location
    localStorage.setItem('lastEmergencyLocation', JSON.stringify(locationData));

    // Update map
    if (map && marker) {
      const newPosition = { lat: locationData.latitude, lng: locationData.longitude };
      marker.setPosition(newPosition);
      map.setCenter(newPosition);
    }

    // Notify parent component
    if (onLocationUpdate) {
      onLocationUpdate(locationData);
    }
  };

  const handleLocationError = (error: GeolocationPositionError) => {
    let errorMessage = 'Location access denied';
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Location access denied. Please enable GPS permissions.';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location information unavailable. Using last known position.';
        break;
      case error.TIMEOUT:
        errorMessage = 'Location request timed out. Retrying...';
        break;
    }
    
    setError(errorMessage);
    console.error('Geolocation error:', error);
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by this browser');
      return;
    }

    setIsTracking(true);
    setError(null);

    // Get immediate position
    navigator.geolocation.getCurrentPosition(updateLocation, handleLocationError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000
    });

    // Start continuous tracking
    const id = navigator.geolocation.watchPosition(updateLocation, handleLocationError, {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 30000
    });

    setWatchId(id);
  };

  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
  };

  const formatCoordinates = (location: LocationData) => {
    const lat = location.latitude.toFixed(6);
    const lng = location.longitude.toFixed(6);
    const latDir = location.latitude >= 0 ? 'N' : 'S';
    const lngDir = location.longitude >= 0 ? 'E' : 'W';
    
    return `${Math.abs(parseFloat(lat))}° ${latDir}, ${Math.abs(parseFloat(lng))}° ${lngDir}`;
  };

  const copyCoordinates = async () => {
    const location = currentLocation || lastKnownLocation;
    if (!location) return;

    const coordText = `Emergency Location: ${formatCoordinates(location)}\nAccuracy: ±${Math.round(location.accuracy)}m\nTime: ${new Date(location.timestamp).toLocaleString()}`;
    
    try {
      await navigator.clipboard.writeText(coordText);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy coordinates:', err);
    }
  };

  const shareLocation = async () => {
    const location = currentLocation || lastKnownLocation;
    if (!location) return;

    const shareText = `🚨 EMERGENCY LOCATION 🚨\n${formatCoordinates(location)}\nAccuracy: ±${Math.round(location.accuracy)}m\nGoogle Maps: https://maps.google.com/?q=${location.latitude},${location.longitude}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Emergency Location',
          text: shareText
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
      }
    }
  };

  const displayLocation = currentLocation || lastKnownLocation;
  const isStale = displayLocation && (Date.now() - displayLocation.timestamp) > 300000; // 5 minutes

  return (
    <div className="bg-gradient-to-br from-red-900 to-red-800 border-2 border-red-600 rounded-lg p-4 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-red-700 p-2 rounded-lg mr-3">
            <MapPin className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Emergency Location</h3>
            <div className="flex items-center text-sm">
              {isOnline ? (
                <Wifi className="text-green-400 mr-1\" size={14} />
              ) : (
                <WifiOff className="text-yellow-400 mr-1" size={14} />
              )}
              <span className={isOnline ? 'text-green-400' : 'text-yellow-400'}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
              {isTracking && (
                <>
                  <Target className="text-green-400 ml-2 mr-1 animate-pulse" size={14} />
                  <span className="text-green-400">Tracking</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {!isTracking ? (
            <ActionButton
              label=""
              onClick={startTracking}
              icon={<Navigation size={18} />}
              variant="primary"
              className="bg-green-600 hover:bg-green-500"
            />
          ) : (
            <ActionButton
              label=""
              onClick={stopTracking}
              icon={<Target size={18} />}
              variant="secondary"
              className="bg-red-600 hover:bg-red-500"
            />
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-800/50 border border-red-600 rounded-lg p-3 mb-4">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      {displayLocation && (
        <div className="space-y-4">
          {/* Coordinates Display */}
          <div className="bg-black/30 rounded-lg p-4">
            <div className="text-center">
              <p className="text-red-200 text-sm font-medium mb-1">GPS COORDINATES</p>
              <p className="text-white text-xl font-bold font-mono">
                {formatCoordinates(displayLocation)}
              </p>
              <div className="flex justify-center items-center mt-2 text-sm text-red-200">
                <span>Accuracy: ±{Math.round(displayLocation.accuracy)}m</span>
                {isStale && (
                  <span className="ml-2 text-yellow-400">(Last known)</span>
                )}
              </div>
              <p className="text-red-300 text-xs mt-1">
                {new Date(displayLocation.timestamp).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Map */}
          <div className="bg-gray-900 rounded-lg overflow-hidden border border-red-600">
            <div 
              ref={mapRef} 
              className="w-full h-48"
              style={{ minHeight: '192px' }}
            />
            {!mapsLoaded && (
              <div className="w-full h-48 flex items-center justify-center bg-gray-800">
                <div className="text-center">
                  <MapPin className="text-red-500 mx-auto mb-2\" size={32} />
                  <p className="text-gray-400 text-sm">Loading map...</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <ActionButton
              label="Copy Location"
              onClick={copyCoordinates}
              icon={<Copy size={16} />}
              variant="secondary"
              fullWidth
              className="bg-gray-700 hover:bg-gray-600"
            />
            <ActionButton
              label="Share Location"
              onClick={shareLocation}
              icon={<Share2 size={16} />}
              variant="primary"
              fullWidth
              className="bg-green-600 hover:bg-green-500"
            />
          </div>

          {/* Emergency Instructions */}
          <div className="bg-red-800/30 border border-red-600 rounded-lg p-3">
            <p className="text-red-200 text-sm font-medium mb-1">📞 For Emergency Services:</p>
            <p className="text-red-100 text-xs leading-relaxed">
              Provide these exact coordinates to rescue teams. Include accuracy information and timestamp.
            </p>
          </div>
        </div>
      )}

      {!displayLocation && !error && (
        <div className="text-center py-8">
          <Navigation className="text-red-400 mx-auto mb-3 animate-pulse" size={48} />
          <p className="text-red-200 mb-2">Getting your location...</p>
          <p className="text-red-300 text-sm">Make sure GPS is enabled</p>
        </div>
      )}
    </div>
  );
};

export default EmergencyLocationTracker;