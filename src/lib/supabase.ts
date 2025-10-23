import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Capture {
  id: string;
  user_id: string;
  title: string;
  status: 'active' | 'stopped' | 'completed';
  likes_count: number;
  comments_count: number;
  phone_numbers_count: number;
  started_at: string;
  stopped_at: string | null;
  created_at: string;
  updated_at: string;
  pages?: Page[];
}

export type ContactStatus =
  | 'not_called'
  | 'called_no_answer'
  | 'called_answered'
  | 'confirmed'
  | 'declined'
  | 'callback_requested'
  | 'invalid_contact'
  | 'completed';

export interface DetectedPhoneNumber {
  id: string;
  capture_id: string;
  phone_number: string;
  user_profile_image: string | null;
  username: string | null;
  page_id: string | null;
  detected_at: string;
  created_at: string;
  contact_status: ContactStatus;
  sequence_number: number;
  status_updated_at: string;
  comments?: PhoneNumberComment[];
  page?: Page;
}

export interface PhoneNumberComment {
  id: string;
  detected_phone_id: string;
  comment_text: string;
  created_at: string;
}

export interface Page {
  id: string;
  user_id: string;
  page_name: string;
  page_url: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CapturePage {
  id: string;
  capture_id: string;
  page_id: string;
  created_at: string;
}
