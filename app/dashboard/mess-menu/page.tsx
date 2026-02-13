"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MessMenuCard from '@/components/MessMenuCard';
import { Utensils, Calendar, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function MessMenuPage() {
    const [menus, setMenus] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'daily' | 'weekly'>('weekly');

    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            if (userData.role === 'Student' && !userData.canAccessDashboard) {
                router.push('/search');
                return;
            }
        } else {
            router.push('/auth/login');
            return;
        }
        fetchMenus();
    }, []);

    const fetchMenus = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/mess-menu/week');
            if (res.ok) {
                const data = await res.json();
                setMenus(data.menus || []);
            }
        } catch (error) {
            console.error('Error fetching mess menu:', error);
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
                {/* Breadcrumbs & Header */}
                <div className="mb-8">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary font-bold mb-4 hover:underline">
                        <ChevronLeft size={20} /> Back to Dashboard
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-black text-dark mb-2">Hostel Mess Menu</h1>
                            <p className="text-dark-light font-medium flex items-center gap-2">
                                <Calendar size={18} /> Detailed schedule for the current week
                            </p>
                        </div>

                        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
                            <button
                                onClick={() => setView('daily')}
                                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${view === 'daily' ? 'bg-primary text-white shadow-md' : 'text-dark-light hover:bg-light'}`}
                            >
                                Today
                            </button>
                            <button
                                onClick={() => setView('weekly')}
                                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${view === 'weekly' ? 'bg-primary text-white shadow-md' : 'text-dark-light hover:bg-light'}`}
                            >
                                Weekly View
                            </button>
                        </div>
                    </div>
                </div>

                {/* Menu Display */}
                {menus.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {menus
                            .filter(menu => view === 'weekly' || new Date(menu.date).toDateString() === new Date().toDateString())
                            .map((menu) => (
                                <MessMenuCard key={menu._id} menu={menu} />
                            ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[3rem] p-16 text-center shadow-card border border-white">
                        <div className="text-6xl mb-6">🍽️</div>
                        <h2 className="text-2xl font-bold text-dark mb-4">No menu data available</h2>
                        <p className="text-dark-light max-w-md mx-auto">
                            The mess menu for this week hasn't been uploaded yet. Please check back later or contact the mess warden.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
