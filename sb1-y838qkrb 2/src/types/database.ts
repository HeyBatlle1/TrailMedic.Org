export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      emergency_assessments: {
        Row: {
          id: string;
          user_id: string | null;
          photo_url: string | null;
          description: string | null;
          location_data: any | null;
          injury_types: string[] | null;
          triage_status: 'pending' | 'analyzed' | 'completed' | null;
          severity_level: 'critical' | 'serious' | 'moderate' | 'minor' | null;
          immediate_actions: string[] | null;
          assessment_steps: string[] | null;
          red_flags: string[] | null;
          next_steps: string[] | null;
          ai_response: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          photo_url?: string | null;
          description?: string | null;
          location_data?: any | null;
          injury_types?: string[] | null;
          triage_status?: 'pending' | 'analyzed' | 'completed' | null;
          severity_level?: 'critical' | 'serious' | 'moderate' | 'minor' | null;
          immediate_actions?: string[] | null;
          assessment_steps?: string[] | null;
          red_flags?: string[] | null;
          next_steps?: string[] | null;
          ai_response?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          photo_url?: string | null;
          description?: string | null;
          location_data?: any | null;
          injury_types?: string[] | null;
          triage_status?: 'pending' | 'analyzed' | 'completed' | null;
          severity_level?: 'critical' | 'serious' | 'moderate' | 'minor' | null;
          immediate_actions?: string[] | null;
          assessment_steps?: string[] | null;
          red_flags?: string[] | null;
          next_steps?: string[] | null;
          ai_response?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      emergency_contacts: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          phone: string;
          relationship: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          phone: string;
          relationship?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          name?: string;
          phone?: string;
          relationship?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          assessment_id: string | null;
          message: string;
          response: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          assessment_id?: string | null;
          message: string;
          response: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          assessment_id?: string | null;
          message?: string;
          response?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}