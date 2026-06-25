export type Role = 'admin' | 'employee'
export type CaseStatus = 'en_proceso' | 'aprobada' | 'negada'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: Role
  approved: boolean
  created_at: string
}

export interface Case {
  id: string
  family_name: string
  status: CaseStatus
  created_by: string
  assigned_to: string | null
  created_at: string
  updated_at: string
  profiles?: Profile
  case_details?: CaseDetail[]
  case_notes?: CaseNote[]
  training_sessions?: TrainingSession[]
}

export interface CaseDetail {
  id: string
  case_id: string
  son_name: string | null
  father_name: string | null
  mother_name: string | null
  cas_appointment: string | null
  consular_appointment: string | null
  arrival_flight_code: string | null
  arrival_origin: string | null
  arrival_departure_time: string | null
  arrival_destination: string | null
  arrival_arrival_time: string | null
  arrival_date: string | null
  departure_flight_code: string | null
  departure_origin: string | null
  departure_departure_time: string | null
  departure_destination: string | null
  departure_arrival_time: string | null
  departure_date: string | null
  hotel_name: string | null
  hotel_address: string | null
  checkin_date: string | null
  checkout_date: string | null
  trainer_name: string | null
  embassy_companion: string | null
  comments: string | null
}

export interface TrainingSession {
  id: string
  case_id: string
  session_date: string
  pickup_time: string | null
  end_time: string | null
}

export interface CaseNote {
  id: string
  case_id: string
  author_id: string
  content: string
  created_at: string
  profiles?: Profile
}

export interface OnboardingMeeting {
  id: string
  case_id: string
  scheduled_at: string
  meet_url: string | null
  google_event_id: string | null
  created_by: string
  notified: boolean
  created_at: string
  cases?: Case
}

export interface CaseFormData {
  family_name: string
  son_name: string
  father_name: string
  mother_name: string
  cas_appointment: string
  consular_appointment: string
  arrival_flight_code: string
  arrival_origin: string
  arrival_departure_time: string
  arrival_destination: string
  arrival_arrival_time: string
  arrival_date: string
  departure_flight_code: string
  departure_origin: string
  departure_departure_time: string
  departure_destination: string
  departure_arrival_time: string
  departure_date: string
  hotel_name: string
  hotel_address: string
  checkin_date: string
  checkout_date: string
  trainer_name: string
  embassy_companion: string
  comments: string
  training_dates: { date: string; pickup_time: string; end_time: string }[]
}
