"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, GraduationCap, User, LogOut, LayoutDashboard, ShieldCheck, Home, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ModeToggle } from './ThemeToggle';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        // Initial user check
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        router.push('/');
    };

    return (
        <nav className={`fixed top-4 left-6 right-6 z-50 transition-all duration-500 rounded-[2rem] border border-white/20 ${scrolled || isMenuOpen
            ? 'bg-white/80 backdrop-blur-xl shadow-elevated py-4'
            : 'bg-white/40 backdrop-blur-md shadow-sm py-5'
            }`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="bg-primary text-white p-2.5 rounded-2xl group-hover:rotate-12 transition-all shadow-premium">
                        <GraduationCap size={24} strokeWidth={2.5} />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-dark">
                        HOSTEL<span className="text-primary underline decoration-4 decoration-accent underline-offset-4">HUB</span>
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 font-bold text-dark-light text-sm tracking-wide">
                    <ModeToggle />
                    {(!user || user.role === 'Student') && (
                        <Link href="/search" className="hover:text-primary transition-colors uppercase tracking-widest font-black">Find Hostels</Link>
                    )}

                    {user ? (
                        <>
                            {user.role === 'Admin' && (
                                <Link href="/admin" className="text-dark hover:text-accent flex items-center gap-2 uppercase tracking-widest font-black">
                                    <ShieldCheck size={18} className="text-accent" /> Control Center
                                </Link>
                            )}
                            {user.role === 'Warden' && (
                                <Link href="/warden" className="text-dark hover:text-secondary flex items-center gap-2 uppercase tracking-widest font-black">
                                    <Home size={18} className="text-secondary" /> Management
                                </Link>
                            )}
                            {user.role === 'Student' && user.canAccessDashboard && (
                                <Link href="/dashboard" className="text-dark hover:text-primary flex items-center gap-2 uppercase tracking-widest font-black">
                                    <LayoutDashboard size={18} className="text-primary" /> My Dashboard
                                </Link>
                            )}

                            <div className="h-6 w-px bg-gray-100 mx-2" />

                            <Link href={user.role === 'Student' && user.canAccessDashboard ? "/dashboard/profile" : "/profile"} className="text-dark-light hover:text-dark flex items-center gap-2 uppercase tracking-widest font-black">
                                <User size={18} /> Profile
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-danger hover:opacity-80 transition-opacity uppercase tracking-widest font-black"
                            >
                                <LogOut size={18} />
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/auth/login"
                            className="bg-dark text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-elevated transition-all hover:bg-primary hover:-translate-y-1 hover:shadow-premium"
                        >
                            Member Login
                        </Link>
                    )}
                </div>

                {/* Mobile Toggle */}
                <div className="flex items-center gap-4 md:hidden">
                    <ModeToggle />
                    <button
                        className="p-3 bg-light text-dark rounded-xl"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-4 right-4 mt-2 bg-white rounded-[2rem] p-8 shadow-2xl flex flex-col gap-6 animate-scale-in border border-gray-50 z-[100]">
                    {(!user || user.role === 'Student') && (
                        <Link href="/search" onClick={() => setIsMenuOpen(false)} className="text-xl font-black text-dark py-4 border-b border-gray-50 flex items-center justify-between">
                            Find Hostels <ArrowRight size={20} className="text-primary" />
                        </Link>
                    )}

                    {user ? (
                        <>
                            <Link href={user.role === 'Admin' ? '/admin' : user.role === 'Warden' ? '/warden' : '/dashboard'}
                                onClick={() => setIsMenuOpen(false)}
                                className={`text-xl font-black text-dark py-4 border-b border-gray-50 flex items-center justify-between ${user.role === 'Student' && !user.canAccessDashboard ? 'hidden' : ''}`}
                            >
                                {user.role === 'Admin' ? 'Control Center' : user.role === 'Warden' ? 'Management' : 'My Dashboard'}
                                <ArrowRight size={20} className="text-primary" />
                            </Link>
                            {user.role === 'Student' && user.canAccessDashboard && (
                                <Link href="/dashboard/profile"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-xl font-black text-dark py-4 border-b border-gray-50 flex items-center justify-between"
                                >
                                    My Profile
                                    <ArrowRight size={20} className="text-primary" />
                                </Link>
                            )}
                            <button
                                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                                className="text-xl font-black text-danger py-4 text-left flex items-center justify-between"
                            >
                                Sign Out <LogOut size={20} />
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/auth/login"
                            onClick={() => setIsMenuOpen(false)}
                            className="bg-primary text-white w-full py-5 rounded-3xl font-black uppercase tracking-widest text-center shadow-xl shadow-primary/20"
                        >
                            Get Started
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
}
