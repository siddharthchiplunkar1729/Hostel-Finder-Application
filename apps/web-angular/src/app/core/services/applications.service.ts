import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

export interface ApplicationSummary {
  _id: string;
  id: string;
  status: string;
  applicationData?: string;
  createdAt: string;
  hostelBlockId: {
    _id: string;
    blockName: string;
    type: string;
    location: string;
  };
}

@Injectable({ providedIn: 'root' })
export class ApplicationsService {
  private readonly http = inject(HttpClient);

  getMyApplications(): Observable<ApplicationSummary[]> {
    return this.http.get<ApplicationSummary[]>(`${API_BASE_URL}/applications/my-applications`);
  }

  apply(hostelBlockId: string, applicationData: Record<string, unknown>): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${API_BASE_URL}/applications/apply`, {
      hostelBlockId,
      applicationData
    });
  }

  getApplicationsForHostel(id: string): Observable<Array<Record<string, unknown>>> {
    return this.http.get<Array<Record<string, unknown>>>(`${API_BASE_URL}/applications/hostel/${id}`);
  }
}
