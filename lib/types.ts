// === Auth ===
export type UserRole = 'hospital_admin' | 'doctor' | 'patient';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  hospitalId: number;
  hospitalName?: string;
  doctorProfileId?: number;
  patientProfileId?: number;
  ethioChartId?: string;
  isVerified?: boolean;
  avatarUrl?: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

// === Hospital ===
export interface Hospital {
  id: number;
  name: string;
  address: string;
  createdAt: string;
  _count?: {
    doctors: number;
    patients: number;
    users: number;
  };
}

// === User ===
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  hospitalId: number;
  hospital?: Hospital;
  avatarUrl?: string;
  doctorProfileId?: number;
  createdAt: string;
}

// === Doctor ===
export interface Doctor {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialty?: string;
  avatarUrl?: string;
  hospitalId: number;
  hospital?: Hospital;
  appointments?: Appointment[];
  _count?: {
    appointments: number;
    prescriptions: number;
  };
}

// === Patient ===
export interface Patient {
  id: number;
  nationalId: string;
  name?: string;
  ethioChartId: string;
  email: string;
  phone: string;
  hospitalId: number;
  hospital?: Hospital;
  registeredById?: number;
  registeredBy?: User;
  teleBirrPaymentId?: string;
  isVerified: boolean;
  avatarUrl?: string;
  createdAt: string;
}

// === Appointment ===
export interface Appointment {
  id: number;
  patientId: number;
  patient?: Patient;
  doctorId: number;
  doctor?: Doctor;
  hospitalId: number;
  hospital?: Hospital;
  dateTime: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'in_progress';
  notes?: string;
  createdAt: string;
}

// === Prescription ===
export interface Prescription {
  id: number;
  appointmentId: number;
  appointment?: Appointment;
  doctorId: number;
  doctor?: Doctor;
  patientId: number;
  patient?: Patient;
  medication: string;
  dosage: string;
  duration: string;
  notes?: string;
  createdAt: string;
}

// === Lab Result ===
export interface LabResult {
  id: number;
  appointmentId: number;
  appointment?: Appointment;
  doctorId: number;
  doctor?: Doctor;
  patientId: number;
  patient?: Patient;
  testType: string;
  result: string;
  notes?: string;
  createdAt: string;
}

// === Billing ===
export interface Bill {
  id: number;
  patientId: number;
  patient?: Patient;
  hospitalId: number;
  amount: number;
  description: string;
  isPaid: boolean;
  paidAt?: string;
  createdAt: string;
}

// === Message ===
export interface Message {
  id: number;
  senderId: number;
  senderRole: UserRole;
  receiverId: number;
  patientId: number;
  patient?: Patient;
  content: string;
  createdAt: string;
}

// === Video Session ===
export interface VideoSession {
  id: number;
  patientId: number;
  patient?: Patient;
  doctorId: number;
  doctor?: Doctor;
  hospitalId: number;
  sessionToken: string;
  scheduledAt: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

// === AI Query ===
export interface AiQuery {
  id: number;
  query: string;
  response: string;
  patientId: number;
  patient?: Patient;
  doctorId: number;
  confidence?: number;
  createdAt: string;
}

// === Patient Access ===
export interface PatientAccess {
  id: number;
  patientId: number;
  patient?: Patient;
  doctorId: number;
  doctor?: Doctor;
  grantedById: number;
  grantedBy?: User;
  isActive: boolean;
  createdAt: string;
  revokedAt?: string;
}

// === API Response ===
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface ApiError {
  success: false;
  statusCode: number;
  error: string;
  timestamp: string;
}

// === Dashboard Stats ===
export interface AdminStats {
  totalPatients: number;
  totalDoctors: number;
  todaysAppointments: number;
  pendingAppointments: number;
  totalRevenue: number;
  revenueGrowth: number;
  patientGrowth: number;
  paidBillsPercentage: number;
  pendingBillsAmount: number;
}

export interface DoctorStats {
  todaysAppointments: number;
  totalPatients: number;
  pendingLabResults: number;
  unreadMessages: number;
}

export interface PatientStats {
  upcomingAppointments: number;
  activePrescriptions: number;
  pendingBills: number;
  unreadMessages: number;
}
