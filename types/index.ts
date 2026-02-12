import { NextRequest } from 'next/server';

export interface UserSession {
    id: string;
    email: string;
    role: 'Student' | 'Warden' | 'Admin';
    name?: string;
    canAccessDashboard?: boolean;
}

export interface AuthenticatedRequest extends NextRequest {
    user: UserSession;
}
