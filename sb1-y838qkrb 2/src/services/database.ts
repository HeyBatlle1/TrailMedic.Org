import { supabase, handleSupabaseError } from '../config/supabase';
import { InjuryData, EmergencyContact } from '../types';
import { Database } from '../types/database';

type EmergencyAssessment = Database['public']['Tables']['emergency_assessments']['Row'];
type EmergencyAssessmentInsert = Database['public']['Tables']['emergency_assessments']['Insert'];
type EmergencyContactRow = Database['public']['Tables']['emergency_contacts']['Row'];
type EmergencyContactInsert = Database['public']['Tables']['emergency_contacts']['Insert'];

// Convert database row to InjuryData
const convertToInjuryData = (assessment: EmergencyAssessment): InjuryData => {
  return {
    id: assessment.id,
    photoUrl: assessment.photo_url || '',
    description: assessment.description || '',
    timestamp: new Date(assessment.created_at).getTime(),
    location: assessment.location_data || undefined,
    triageStatus: assessment.triage_status || 'pending',
    injuryType: assessment.injury_types || [],
    severity_level: assessment.severity_level || undefined,
    immediate_actions: assessment.immediate_actions || [],
    assessment_steps: assessment.assessment_steps || [],
    red_flags: assessment.red_flags || [],
    next_steps: assessment.next_steps || [],
    aiResponse: assessment.ai_response || undefined
  };
};

// Convert InjuryData to database insert
const convertToAssessmentInsert = (injury: InjuryData, userId: string): EmergencyAssessmentInsert => {
  return {
    id: injury.id,
    user_id: userId,
    photo_url: injury.photoUrl,
    description: injury.description,
    location_data: injury.location,
    injury_types: injury.injuryType,
    triage_status: injury.triageStatus,
    severity_level: injury.severity_level,
    immediate_actions: injury.immediate_actions,
    assessment_steps: injury.assessment_steps,
    red_flags: injury.red_flags,
    next_steps: injury.next_steps,
    ai_response: injury.aiResponse
  };
};

// Convert database row to EmergencyContact
const convertToEmergencyContact = (contact: EmergencyContactRow): EmergencyContact => {
  return {
    id: contact.id,
    name: contact.name,
    phone: contact.phone,
    relationship: contact.relationship || undefined
  };
};

// Get current user ID from Supabase Auth
const getCurrentUserId = async (): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  return user.id;
};

/**
 * Save emergency assessment to database
 */
export async function saveAssessment(injury: InjuryData): Promise<string> {
  try {
    const userId = await getCurrentUserId();
    const assessmentData = convertToAssessmentInsert(injury, userId);
    
    const { data, error } = await supabase
      .from('emergency_assessments')
      .insert(assessmentData)
      .select()
      .single();

    if (error) throw error;
    
    return data.id;
  } catch (error) {
    console.error('Error saving assessment:', error);
    throw new Error(handleSupabaseError(error));
  }
}

/**
 * Get user's emergency assessments
 */
export async function getUserAssessments(): Promise<InjuryData[]> {
  try {
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from('emergency_assessments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(convertToInjuryData);
  } catch (error) {
    console.error('Error getting assessments:', error);
    throw new Error(handleSupabaseError(error));
  }
}

/**
 * Get single assessment by ID
 */
export async function getAssessmentById(id: string): Promise<InjuryData | null> {
  try {
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from('emergency_assessments')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    
    return convertToInjuryData(data);
  } catch (error) {
    console.error('Error getting assessment:', error);
    throw new Error(handleSupabaseError(error));
  }
}

/**
 * Update emergency assessment
 */
export async function updateAssessment(injury: InjuryData): Promise<void> {
  try {
    const userId = await getCurrentUserId();
    const assessmentData = convertToAssessmentInsert(injury, userId);
    
    const { error } = await supabase
      .from('emergency_assessments')
      .update(assessmentData)
      .eq('id', injury.id)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating assessment:', error);
    throw new Error(handleSupabaseError(error));
  }
}

/**
 * Save emergency contact
 */
export async function saveEmergencyContact(contact: Omit<EmergencyContact, 'id'>): Promise<string> {
  try {
    const userId = await getCurrentUserId();

    const contactData: EmergencyContactInsert = {
      user_id: userId,
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship
    };
    
    const { data, error } = await supabase
      .from('emergency_contacts')
      .insert(contactData)
      .select()
      .single();

    if (error) throw error;
    
    return data.id;
  } catch (error) {
    console.error('Error saving contact:', error);
    throw new Error(handleSupabaseError(error));
  }
}

/**
 * Get user's emergency contacts
 */
export async function getEmergencyContacts(): Promise<EmergencyContact[]> {
  try {
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(convertToEmergencyContact);
  } catch (error) {
    console.error('Error getting contacts:', error);
    throw new Error(handleSupabaseError(error));
  }
}

/**
 * Delete emergency contact
 */
export async function deleteEmergencyContact(contactId: string): Promise<void> {
  try {
    const userId = await getCurrentUserId();

    const { error } = await supabase
      .from('emergency_contacts')
      .delete()
      .eq('id', contactId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting contact:', error);
    throw new Error(handleSupabaseError(error));
  }
}

/**
 * Save chat message and response
 */
export async function saveChatMessage(assessmentId: string, message: string, response: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('chat_messages')
      .insert({
        assessment_id: assessmentId,
        message,
        response
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving chat message:', error);
    throw new Error(handleSupabaseError(error));
  }
}

/**
 * Get chat messages for assessment
 */
export async function getChatMessages(assessmentId: string) {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('assessment_id', assessmentId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error getting chat messages:', error);
    throw new Error(handleSupabaseError(error));
  }
}