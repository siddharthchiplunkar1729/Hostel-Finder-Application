"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import QuickActionsCard from '@/components/QuickActionsCard';
import ComplaintForm from '@/components/ComplaintForm';
import ComplaintCard from '@/components/ComplaintCard';
import MessMenuCard from '@/components/MessMenuCard';
import NoticeCard from '@/components/NoticeCard';
import { Building2, Users2, MapPin, Calendar, Shield, ArrowRight, Utensils } from 'lucide-react';

export default function DashboardPage() {
    const router = useRouter();
    const [showComplaintForm, setShowComplaintForm] = useState(false);
    const [student, setStudent] = useState<any>(null);
    const [complaints, setComplaints] = useState<any[]>([]);
    const [messMenu, setMessMenu] = useState<any>(null);
    const [notices, setNotices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            router.push('/auth/login');
            return;
        }

        const user = JSON.parse(storedUser);
        if (user.role === 'Student' && !user.canAccessDashboard) {
            router.push('/search');
            return;
        }

        if (!user.studentId) {
            setLoading(false);
            return;
        }

        fetchDashboardData(user.studentId);
    }, []);

    const fetchDashboardData = async (studentId: string) => {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        try {
            const res = await fetch(`/api/dashboard?studentId=${studentId}`, { headers });
            if (res.ok) {
                const data = await res.json();
                setStudent(data.student);
                setComplaints(data.complaints);
                setMessMenu(data.messMenu);
                setNotices(data.notices);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-light pt-24 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-dark-light font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background transition-colors duration-500 pt-32 pb-12 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Elite Welcome Header */}
                <div className="relative mb-12 p-12 bg-dark rounded-[4rem] overflow-hidden shadow-elevated">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-0" />
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-8">
                            <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-primary to-secondary p-1">
                                <div className="w-full h-full bg-dark rounded-[2.2rem] flex items-center justify-center text-5xl font-black text-white shadow-inner">
                                    {student?.name?.charAt(0) || 'S'}
                                </div>
                            </div>
                            <div>
                                <h1 className="text-5xl font-black text-white tracking-tighter mb-2">
                                    Welcome back{student?.name ? `, ${student.name.split(' ')[0]}` : ''}.
                                </h1>
                                <div className="flex flex-wrap gap-6 text-white/40 font-bold uppercase tracking-widest text-[10px]">
                                    <div className="flex items-center gap-2">
                                        <Building2 size={14} className="text-primary" />
                                        <span>Suite {student?.roomNumber || 'PENDING'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} className="text-secondary" />
                                        <span>{student?.course || 'GENERAL'} • YEAR {student?.year || 1}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-primary">
                                        <Calendar size={14} />
                                        <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-4">
                            <div className={`px-8 py-4 rounded-[2rem] border-2 backdrop-blur-md shadow-premium transition-all ${student?.feeStatus?.isPaid
                                ? 'bg-success/10 border-success/20 text-success'
                                : 'bg-accent/10 border-accent/20 text-accent animate-pulse'
                                }`}>
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-60">Hostel Enrollment</div>
                                <div className="text-xl font-black">
                                    {student?.feeStatus?.isPaid ? 'Approved' : 'Action Required'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Action Hub */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Left: Operations & Engagement */}
                    <div className="lg:col-span-3 space-y-12">
                        {/* Interactive Quick Actions */}
                        <section>
                            <QuickActionsCard onSubmitComplaint={() => setShowComplaintForm(true)} />
                        </section>

                        {/* Services Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* Incident Management */}
                            <section className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-3xl font-black text-dark tracking-tight">Support Tickets</h2>
                                    <Link href="/complaints" className="text-[10px] font-black uppercase tracking-widest text-primary hover:tracking-[0.2em] transition-all">
                                        Audit History →
                                    </Link>
                                </div>

                                {complaints.length > 0 ? (
                                    <div className="space-y-6">
                                        {complaints.map((complaint) => (
                                            <ComplaintCard key={complaint._id} complaint={complaint} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-card rounded-[3rem] p-16 text-center shadow-card border border-white/5 group hover:border-primary/20 transition-all">
                                        <div className="w-20 h-20 bg-muted rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                            <Shield size={32} className="text-primary/40" />
                                        </div>
                                        <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">Zero Active Incidents</p>
                                    </div>
                                )}
                            </section>

                            {/* Community Interaction */}
                            <section className="space-y-8">
                                <h2 className="text-3xl font-black text-dark tracking-tight">Network</h2>
                                <div className="bg-card rounded-[3rem] p-10 shadow-card border border-white/5 group overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-bl-[4rem] group-hover:scale-150 transition-transform duration-700" />
                                    <div className="relative z-10 flex items-center gap-8">
                                        <div className="w-20 h-20 rounded-3xl bg-secondary/10 flex items-center justify-center text-secondary">
                                            <Users2 size={40} />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-black text-foreground tracking-tight leading-none mb-1">
                                                Colleagues
                                            </p>
                                            <p className="text-sm font-bold text-muted-foreground">
                                                {student?.roommateIds?.length || 0} Unified Residents
                                            </p>
                                        </div>
                                        <button className="ml-auto w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center hover:bg-secondary hover:scale-110 transition-all shadow-premium">
                                            <ArrowRight size={20} />
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-primary to-secondary p-10 rounded-[3rem] text-white shadow-elevated relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-dark/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <h3 className="text-2xl font-black mb-4 tracking-tight">Resource Center</h3>
                                    <p className="text-white/60 font-medium mb-8 leading-relaxed">Access university guidelines, mess policies, and community standards.</p>
                                    <button className="px-8 py-4 bg-white text-dark rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-dark hover:text-white transition-all shadow-premium">
                                        Download Pack
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Right: Intelligence & Bulletins */}
                    <aside className="space-y-12">
                        {/* Culinary Intelligence */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-dark tracking-tight">Today's Menu</h2>
                            {messMenu ? (
                                <div className="space-y-6">
                                    <MessMenuCard menu={messMenu} />
                                    <Link href="/dashboard/mess-menu" className="block text-center py-6 bg-white rounded-[2rem] border-2 border-dashed border-gray-200 text-dark-light text-[10px] font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all shadow-inner">
                                        Full Culinary Schedule
                                    </Link>
                                </div>
                            ) : (
                                <div className="bg-card rounded-[3rem] p-12 text-center shadow-card border border-white/5">
                                    <Utensils size={40} className="mx-auto text-primary/20 mb-4" />
                                    <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">Awaiting Menu Update</p>
                                </div>
                            )}
                        </section>

                        {/* Broadcast Center */}
                        <section className="space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-3xl font-black text-dark tracking-tight">Bulletins</h2>
                                <Link href="/dashboard/notices" className="text-[10px] font-black uppercase tracking-widest text-secondary hover:tracking-[0.2em] transition-all">
                                    Archive →
                                </Link>
                            </div>

                            {notices.length > 0 ? (
                                <div className="space-y-6">
                                    {notices.slice(0, 2).map((notice) => (
                                        <NoticeCard key={notice._id} notice={notice} />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-[3rem] p-12 text-center shadow-card border border-gray-50">
                                    <div className="text-4xl mb-4">📢</div>
                                    <p className="text-dark-light font-black uppercase tracking-widest text-xs">No Official Bulletins</p>
                                </div>
                            )}
                        </section>
                    </aside>
                </div>
            </div>

            {showComplaintForm && student && (
                <ComplaintForm
                    onClose={() => {
                        setShowComplaintForm(false);
                        if (student._id) fetchDashboardData(student._id);
                    }}
                    studentId={student._id}
                />
            )}
        </div>
    );
}
