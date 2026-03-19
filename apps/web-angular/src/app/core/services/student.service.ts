import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

export interface StudentSummary {
  _id: string;
  userId?: string;
  rollNumber: string;
  course: string;
  year: number;
  department: string;
  roomNumber?: string;
  enrollmentStatus: string;
  name: string;
  email: string;
  phone: string;
  hostelBlockId?: {
    _id: string;
    blockName: string;
  } | null;
}

export interface StudentDetail {
  _id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  rollNumber: string;
  course: string;
  year: number;
  department: string;
  roomNumber?: string;
  enrollmentStatus: string;
  photo?: string;
  canAccessDashboard: boolean;
  hostelInfo?: {
    id: string;
    name: string;
    location: string;
  } | null;
  feeStatus: {
    isPaid: boolean;
    lastPayment?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class StudentService {
  private readonly http = inject(HttpClient);

  getStudents(): Observable<StudentSummary[]> {
    return this.http.get<StudentSummary[]>(`${API_BASE_URL}/students`);
  }

  getStudentById(id: string): Observable<StudentDetail> {
    return this.http.get<StudentDetail>(`${API_BASE_URL}/students/${id}`);
  }

  getRoommates(id: string): Observable<{ success: boolean; roommates: Array<Record<string, unknown>> }> {
    return this.http.get<{ success: boolean; roommates: Array<Record<string, unknown>> }>(`${API_BASE_URL}/students/${id}/roommates`);
  }

  payFees(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${API_BASE_URL}/students/${id}/pay`, {});
  }
}
