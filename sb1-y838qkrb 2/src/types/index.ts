export interface InjuryData {
  id: string;
  photoUrl: string;
  description?: string;
  timestamp: number;
  location?: {
    coords: {
      latitude: number;
      longitude: number;
      accuracy?: number;
    };
    timestamp?: number;
  };
  triageStatus: 'pending' | 'analyzed' | 'completed';
  aiResponse?: string;
  injuryType?: string[];
  // API response fields
  severity_level?: 'critical' | 'serious' | 'moderate' | 'minor';
  immediate_actions?: string[];
  assessment_steps?: string[];
  red_flags?: string[];
  next_steps?: string[];
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship?: string;
}

export interface AppState {
  currentInjury: InjuryData | null;
  injuryHistory: InjuryData[];
  emergencyContacts: EmergencyContact[];
  isOffline: boolean;
}

export interface TraumaAssessmentRequest {
  mechanismOfInjury: string;
  reportedSymptoms: string[];
  conscious: boolean;
  age?: number;
  gender?: string;
  obviousBleeding?: boolean;
}

export interface TraumaAssessmentResponse {
  severity_level: 'critical' | 'serious' | 'moderate' | 'minor';
  immediate_actions: string[];
  assessment_steps: string[];
  red_flags: string[];
  next_steps: string[];
}