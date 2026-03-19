import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  name: string;
  phone: string;
  canAccessDashboard: boolean;
}

export interface AuthStudent {
  id: string;
  rollNumber: string;
  department: string;
  course: string;
  year: number;
  enrollmentStatus: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string | null;
  refreshToken: string | null;
  devResetUrl?: string | null;
  user?: AuthUser | null;
  student?: AuthStudent | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storage = globalThis.sessionStorage;

  login(payload: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE_URL}/auth/login`, payload).pipe(
      tap((response) => this.persistSession(response))
    );
  }

  signup(payload: Record<string, unknown>): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE_URL}/auth/signup`, payload).pipe(
      tap((response) => this.persistSession(response))
    );
  }

  forgotPassword(email: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE_URL}/auth/forgot-password`, { email });
  }

  resetPassword(payload: { token: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE_URL}/auth/reset-password`, payload);
  }

  me(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${API_BASE_URL}/auth/me`);
  }

  logout(): void {
    this.storage.removeItem('token');
    this.storage.removeItem('refreshToken');
    this.storage.removeItem('user');
    this.storage.removeItem('student');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('student');
  }

  currentUser(): AuthUser | null {
    const raw = this.storage.getItem('user');
    return raw ? JSON.parse(raw) as AuthUser : null;
  }

  currentStudent(): AuthStudent | null {
    const raw = this.storage.getItem('student');
    return raw ? JSON.parse(raw) as AuthStudent : null;
  }

  isAuthenticated(): boolean {
    return Boolean(this.storage.getItem('token'));
  }

  private persistSession(response: AuthResponse): void {
    if (response.token) {
      this.storage.setItem('token', response.token);
    }
    if (response.refreshToken) {
      this.storage.setItem('refreshToken', response.refreshToken);
    }
    if (response.user) {
      this.storage.setItem('user', JSON.stringify(response.user));
    }
    if (response.student) {
      this.storage.setItem('student', JSON.stringify(response.student));
    }
  }
}
