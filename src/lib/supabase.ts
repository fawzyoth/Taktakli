import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type ContactStatus =
  | 'not_called'
  | 'called_no_answer'
  | 'called_answered'
  | 'confirmed'
  | 'declined'
  | 'callback_requested'
  | 'invalid_contact'
  | 'completed'

export interface Capture {
  id: string
  page_id: string
  status: 'active' | 'stopped'
  started_at: string
  stopped_at: string | null
  total_views: number
  total_likes: number
  total_comments: number
  created_at: string
}

export interface DetectedPhoneNumber {
  id: string
  capture_id: string
  phone_number: string
  username: string | null
  detected_at: string
  page_source: string | null
  contact_status: ContactStatus
  status_updated_at: string
  sequence_number: number
}

export interface PhoneNumberComment {
  id: string
  phone_number_id: string
  comment_text: string
  created_at: string
}

export interface Page {
  id: string
  user_id: string
  page_name: string
  page_url: string
  is_active: boolean
  created_at: string
}
