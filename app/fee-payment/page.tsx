"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ChevronLeft, CreditCard, Loader2 } from 'lucide-react';
import { getAuthHeaders, getAuthToken, getStoredUser } from '@/lib/clientAuth';

export default function FeePaymentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [studentId, setStudentId] = useState<string>('');
    const [message, setMessage] = useState('');
    const [paid, setPaid] = useState(false);

    useEffect(() => {
        const user = getStoredUser();
        const token = getAuthToken();

        if (!user || !token) {
            router.push('/auth/login');
            return;
        }

        if (user.role !== 'Student') {
            router.push('/dashboard');
            return;
        }

        if (!user.studentId) {
            setMessage('Student profile is not linked. Please log in again and retry.');
            setLoading(false);
            return;
        }

        setStudentId(user.studentId);
        setLoading(false);
    }, [router]);

    const handlePayment = async () => {
        if (!studentId) return;
        setProcessing(true);
        setMessage('');

        try {
            const res = await fetch(`/api/students/${studentId}/pay`, {
                method: 'POST',
                headers: getAuthHeaders(),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Payment failed');
            }

            setPaid(true);
            setMessage(data.message || 'Payment verified successfully');
        } catch (err) {
            setMessage(err instanceof Error ? err.message : 'Payment failed');
        } finally {
            setProcessing(false);
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
            <div className="max-w-2xl mx-auto">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary font-bold mb-6 hover:underline">
                    <ChevronLeft size={18} /> Back to Dashboard
                </Link>

                <div className="bg-white rounded-[3rem] p-10 shadow-card border border-white text-center">
                    <div className={`w-20 h-20 rounded-[1.75rem] mx-auto mb-6 flex items-center justify-center ${paid ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
                        {paid ? <CheckCircle2 size={40} /> : <CreditCard size={40} />}
                    </div>

                    <h1 className="text-3xl font-black text-dark mb-3">Hostel Fee Payment</h1>
                    <p className="text-dark-light mb-8">Complete your hostel fee step so the warden can process final approval.</p>

                    {!paid && (
                        <button
                            onClick={handlePayment}
                            disabled={processing || !studentId}
                            className="w-full py-4 bg-dark text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {processing ? <Loader2 className="animate-spin" size={18} /> : <CreditCard size={18} />}
                            {processing ? 'Processing Payment' : 'Pay Hostel Fees'}
                        </button>
                    )}

                    {message && (
                        <div className={`mt-6 rounded-2xl px-4 py-3 font-bold ${paid ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                            {message}
                        </div>
                    )}

                    {paid && (
                        <p className="mt-6 text-sm font-medium text-dark-light">
                            Fee payment is complete. Final dashboard access is enabled after warden approval.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
