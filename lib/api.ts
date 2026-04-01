import Cookies from 'js-cookie';
import type { ApiResponse, LoginResponse } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private getToken(): string | undefined {
    return Cookies.get('ethiochart_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Don't set Content-Type for FormData
    if (options.body instanceof FormData) {
      delete headers['Content-Type'];
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error || data.message || 'Request failed',
        response.status,
        data
      );
    }

    return data;
  }

  // Auth
  async adminLogin(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return this.request('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async doctorLogin(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return this.request('/auth/doctor/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async patientLogin(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return this.request('/auth/patient/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Hospitals
  async getHospitals(): Promise<ApiResponse<any[]>> {
    return this.request('/hospitals');
  }

  async getHospital(id: number): Promise<ApiResponse<any>> {
    return this.request(`/hospitals/${id}`);
  }

  async createHospital(data: { name: string; address: string }): Promise<ApiResponse<any>> {
    return this.request('/hospitals', { method: 'POST', body: JSON.stringify(data) });
  }

  // Users
  async getUsers(): Promise<ApiResponse<any[]>> {
    return this.request('/users');
  }

  async getUser(id: number): Promise<ApiResponse<any>> {
    return this.request(`/users/${id}`);
  }

  async createUser(data: any): Promise<ApiResponse<any>> {
    return this.request('/users', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateUser(id: number, data: any): Promise<ApiResponse<any>> {
    return this.request(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  }

  async deleteUser(id: number): Promise<ApiResponse<any>> {
    return this.request(`/users/${id}`, { method: 'DELETE' });
  }

  // Doctors
  async getDoctors(): Promise<ApiResponse<any[]>> {
    return this.request('/doctors');
  }

  async getDoctor(id: number): Promise<ApiResponse<any>> {
    return this.request(`/doctors/${id}`);
  }

  async updateDoctor(id: number, data: any): Promise<ApiResponse<any>> {
    return this.request(`/doctors/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  }

  // Patients
  async getPatients(): Promise<ApiResponse<any[]>> {
    return this.request('/patients');
  }

  async getPatient(id: number): Promise<ApiResponse<any>> {
    return this.request(`/patients/${id}`);
  }

  async registerPatient(data: any): Promise<ApiResponse<any>> {
    return this.request('/patients/register', { method: 'POST', body: JSON.stringify(data) });
  }

  async updatePatient(id: number, data: any): Promise<ApiResponse<any>> {
    return this.request(`/patients/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  }

  async deletePatient(id: number): Promise<ApiResponse<any>> {
    return this.request(`/patients/${id}`, { method: 'DELETE' });
  }

  // Appointments
  async getAppointments(): Promise<ApiResponse<any[]>> {
    return this.request('/appointments');
  }

  async getAppointment(id: number): Promise<ApiResponse<any>> {
    return this.request(`/appointments/${id}`);
  }

  async createAppointment(data: any): Promise<ApiResponse<any>> {
    return this.request('/appointments', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateAppointment(id: number, data: any): Promise<ApiResponse<any>> {
    return this.request(`/appointments/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  }

  // Prescriptions
  async getPrescriptions(appointmentId: number): Promise<ApiResponse<any[]>> {
    return this.request(`/prescriptions/${appointmentId}`);
  }

  async createPrescription(data: any): Promise<ApiResponse<any>> {
    return this.request('/prescriptions', { method: 'POST', body: JSON.stringify(data) });
  }

  // Lab Results
  async getLabResults(appointmentId: number): Promise<ApiResponse<any[]>> {
    return this.request(`/lab-results/${appointmentId}`);
  }

  async createLabResult(data: any): Promise<ApiResponse<any>> {
    return this.request('/lab-results', { method: 'POST', body: JSON.stringify(data) });
  }

  // Billing
  async getBills(patientId: number): Promise<ApiResponse<any[]>> {
    return this.request(`/billing/${patientId}`);
  }

  async createBill(data: any): Promise<ApiResponse<any>> {
    return this.request('/billing', { method: 'POST', body: JSON.stringify(data) });
  }

  async markBillPaid(id: number): Promise<ApiResponse<any>> {
    return this.request(`/billing/${id}/pay`, { method: 'PATCH' });
  }

  // Messages
  async getMessages(patientId: number): Promise<ApiResponse<any[]>> {
    return this.request(`/messages/${patientId}`);
  }

  async sendMessage(data: any): Promise<ApiResponse<any>> {
    return this.request('/messages', { method: 'POST', body: JSON.stringify(data) });
  }

  // Video Sessions
  async getVideoSessions(patientId: number): Promise<ApiResponse<any[]>> {
    return this.request(`/video-sessions/${patientId}`);
  }

  async createVideoSession(data: any): Promise<ApiResponse<any>> {
    return this.request('/video-sessions', { method: 'POST', body: JSON.stringify(data) });
  }

  // AI Query
  async getAiQueries(patientId: number): Promise<ApiResponse<any[]>> {
    return this.request(`/ai-query/${patientId}`);
  }

  async askAi(data: any): Promise<ApiResponse<any>> {
    return this.request('/ai-query', { method: 'POST', body: JSON.stringify(data) });
  }

  // Patient Access
  async grantAccess(data: any): Promise<ApiResponse<any>> {
    return this.request('/patient-access/grant', { method: 'POST', body: JSON.stringify(data) });
  }

  async revokeAccess(data: any): Promise<ApiResponse<any>> {
    return this.request('/patient-access/revoke', { method: 'POST', body: JSON.stringify(data) });
  }

  // File upload
  async uploadFile(file: File, type: 'avatar'): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return this.request('/upload', { method: 'POST', body: formData });
  }
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const api = new ApiClient();
