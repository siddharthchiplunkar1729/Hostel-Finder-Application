"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Loader2, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [devResetUrl, setDevResetUrl] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        setDevResetUrl('');

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Request failed');
            }

            setSuccess(data.message || 'If an account exists, reset instructions have been sent.');
            if (typeof data.devResetUrl === 'string') {
                setDevResetUrl(data.devResetUrl);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Request failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-light flex items-center justify-center px-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-0">
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-md w-full">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-block mb-6">
                        <span className="text-3xl font-black tracking-tighter text-dark">HOSTEL<span className="text-primary">HUB</span></span>
                    </Link>
                    <h1 className="text-4xl font-black text-dark mb-2">Forgot Password</h1>
                    <p className="text-dark-light font-medium text-lg">Enter your email to receive a reset link</p>
                </div>

                <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] p-10 shadow-2xl border border-white relative">
                    {error && (
                        <div className="mb-6 p-4 bg-danger/10 border border-danger/20 text-danger rounded-2xl text-sm font-bold flex items-center gap-3">
                            <ShieldCheck size={20} />
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-green-100 border border-green-200 text-green-700 rounded-2xl text-sm font-bold">
                            {success}
                            {devResetUrl && (
                                <div className="mt-2 break-all font-medium text-xs">
                                    Dev reset link: <a className="underline" href={devResetUrl}>{devResetUrl}</a>
                                </div>
                            )}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-black text-dark-light uppercase tracking-widest pl-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-light" size={20} />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-light/50 border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all font-medium text-dark"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-dark text-white rounded-[1.5rem] font-black text-xl uppercase tracking-widest hover:bg-primary hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-4 disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <>
                                    Send Reset Link
                                    <ArrowRight size={24} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-dark-light font-bold text-sm flex items-center justify-center gap-2">
                            <KeyRound size={14} />
                            <Link href="/auth/login" className="text-primary hover:underline">Back to Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
