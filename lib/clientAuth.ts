export interface StoredUser {
    _id?: string;
    id?: string;
    role?: string;
    canAccessDashboard?: boolean;
    studentId?: string;
    enrolledHostelId?: string;
}

export function getStoredUser(): StoredUser | null {
    if (typeof window === 'undefined') return null;

    const raw = localStorage.getItem('user');
    if (!raw) return null;

    try {
        return JSON.parse(raw) as StoredUser;
    } catch {
        return null;
    }
}

export function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
}

export function getAuthHeaders(headers: Record<string, string> = {}) {
    const token = getAuthToken();
    if (!token) return headers;

    return {
        ...headers,
        Authorization: `Bearer ${token}`,
    };
}
