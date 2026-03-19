import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

@Injectable({ providedIn: 'root' })
export class OperationsService {
  private readonly http = inject(HttpClient);

  getComplaints(): Observable<unknown[]> {
    return this.http.get<unknown[]>(`${API_BASE_URL}/complaints`);
  }

  getNotices(): Observable<unknown[]> {
    return this.http.get<unknown[]>(`${API_BASE_URL}/notices`);
  }

  getWeeklyMessMenu(): Observable<unknown> {
    return this.http.get<unknown>(`${API_BASE_URL}/mess-menu/week`);
  }

  getWardenDashboard(): Observable<unknown> {
    return this.http.get<unknown>(`${API_BASE_URL}/warden/dashboard`);
  }

  getStories(): Observable<unknown[]> {
    return this.http.get<unknown[]>(`${API_BASE_URL}/stories`);
  }

  getCommunities(): Observable<unknown[]> {
    return this.http.get<unknown[]>(`${API_BASE_URL}/communities`);
  }
}
