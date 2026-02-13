"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ChevronLeft, Loader2, Plus } from 'lucide-react';
import ComplaintCard from '@/components/ComplaintCard';
import ComplaintForm from '@/components/ComplaintForm';
import { getAuthHeaders, getAuthToken, getStoredUser } from '@/lib/clientAuth';

type ApiComplaint = {
    _id: string;
    title: string;
    description: string;
    status: string;
    createdAt: string;
};

export default function ComplaintsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [studentId, setStudentId] = useState<string | undefined>(undefined);
    const [complaints, setComplaints] = useState<ApiComplaint[]>([]);

    useEffect(() => {
        const user = getStoredUser();
        const token = getAuthToken();

        if (!user || !token) {
            router.push('/auth/login');
            return;
        }

        if (user.role === 'Student' && !user.canAccessDashboard) {
            router.push('/search');
            return;
        }

        setStudentId(user.studentId);
        void fetchComplaints();
    }, [router]);

    const fetchComplaints = async () => {
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/complaints?limit=50', {
                headers: getAuthHeaders(),
            });

            if (!res.ok) {
                throw new Error('Failed to load complaints');
            }

            const data = await res.json();
            setComplaints(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load complaints');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-light pt-24 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-light pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary font-bold mb-4 hover:underline">
                            <ChevronLeft size={18} /> Back to Dashboard
                        </Link>
                        <h1 className="text-4xl font-black text-dark mb-2">Complaint History</h1>
                        <p className="text-dark-light font-medium flex items-center gap-2">
                            <AlertTriangle size={18} /> Track all support tickets and their status
                        </p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                    >
                        <Plus size={16} /> New Complaint
                    </button>
                </div>

                {error && (
                    <div className="mb-6 bg-danger/10 border border-danger/20 text-danger rounded-2xl px-5 py-4 font-bold">
                        {error}
                    </div>
                )}

                {complaints.length > 0 ? (
                    <div className="space-y-6">
                        {complaints.map((complaint) => (
                            <ComplaintCard
                                key={complaint._id}
                                complaint={{
                                    ...complaint,
                                    category: 'Other',
                                    priority: complaint.status === 'Pending' ? 'Medium' : 'Low',
                                    location: { type: 'Room' },
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[3rem] p-16 text-center shadow-card border border-white">
                        <h2 className="text-2xl font-black text-dark mb-3">No complaints yet</h2>
                        <p className="text-dark-light mb-8">Create a complaint if you need support from hostel administration.</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-6 py-4 bg-dark text-white rounded-2xl font-bold hover:bg-primary transition-all"
                        >
                            Raise Your First Complaint
                        </button>
                    </div>
                )}
            </div>

            {showForm && (
                <ComplaintForm
                    studentId={studentId}
                    onClose={() => {
                        setShowForm(false);
                        void fetchComplaints();
                    }}
                />
            )}
        </div>
    );
}
