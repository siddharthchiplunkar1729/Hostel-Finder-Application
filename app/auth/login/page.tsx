"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, UserCircle, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

function LoginContent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get('returnUrl');
    const requestedRole = searchParams.get('role');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Store tokens and user info (simplified for demo)
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Role-based redirection
            const role = data.user.role;
            if (returnUrl) {
                window.location.href = returnUrl;
            } else if (role === 'Admin') {
                window.location.href = '/admin';
            } else if (role === 'Warden') {
                window.location.href = '/warden';
            } else {
                // Students only get dashboard access if approved
                if (data.user.canAccessDashboard) {
                    window.location.href = '/dashboard';
                } else {
                    window.location.href = '/search';
                }
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-light flex items-center justify-center px-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-0">
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-md w-full">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-block mb-6">
                        <span className="text-3xl font-black tracking-tighter text-dark">HOSTEL<span className="text-primary">HUB</span></span>
                    </Link>
                    <h1 className="text-4xl font-black text-dark mb-2">Welcome Back</h1>
                    <p className="text-dark-light font-medium text-lg">Login to access your personalized portal</p>
                </div>

                <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] p-10 shadow-2xl border border-white relative">
                    {error && (
                        <div className="mb-6 p-4 bg-danger/10 border border-danger/20 text-danger rounded-2xl text-sm font-bold flex items-center gap-3">
                            <ShieldCheck size={20} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
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

                        <div className="space-y-2">
                            <label className="text-sm font-black text-dark-light uppercase tracking-widest pl-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-light" size={20} />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-light/50 border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all font-medium text-dark"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-2 text-sm">
                            <label className="flex items-center gap-2 font-bold text-dark-light cursor-pointer">
                                <input type="checkbox" className="rounded-md border-gray-300 text-primary focus:ring-primary w-4 h-4" />
                                Remember me
                            </label>
                            <a href="#" className="font-bold text-primary hover:underline">Forgot Password?</a>
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
                                    Login Now
                                    <ArrowRight size={24} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-dark-light font-bold text-sm">
                            Don't have an account? <Link href="/auth/signup" className="text-primary hover:underline">Create Account</Link>
                        </p>
                    </div>
                </div>

                {/* Role Switcher Hint (For Demo Purpose) */}
                <div className="mt-8 p-6 bg-white/50 backdrop-blur-sm rounded-[2rem] border border-white/50">
                    <p className="text-xs font-black text-dark-light uppercase tracking-widest mb-4 flex items-center gap-2">
                        <UserCircle size={14} /> Quick Login (Demo)
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => { setEmail('rahul@student.com'); setPassword('password123'); }}
                            className="px-4 py-2 bg-white/80 hover:bg-white rounded-xl text-xs font-bold text-dark shadow-sm transition-all border border-gray-100 flex items-center gap-1"
                        >
                            <LayoutDashboard size={12} className="text-primary" /> Student
                        </button>
                        <button
                            onClick={() => { setEmail('rajesh@hostel.com'); setPassword('password123'); }}
                            className="px-4 py-2 bg-white/80 hover:bg-white rounded-xl text-xs font-bold text-dark shadow-sm transition-all border border-gray-100 flex items-center gap-1"
                        >
                            < ShieldCheck size={12} className="text-secondary" /> Warden
                        </button>
                        <button
                            onClick={() => { setEmail('admin@hostelhub.com'); setPassword('password123'); }}
                            className="px-4 py-2 bg-white/80 hover:bg-white rounded-xl text-xs font-bold text-dark shadow-sm transition-all border border-gray-100 flex items-center gap-1"
                        >
                            <ShieldCheck size={12} className="text-accent" /> Admin
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-light flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
