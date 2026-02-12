"use client";

import { useState, useEffect } from 'react';
import {
    Users, UserCheck, UserX, Clock,
    FileText, Bell, Utensils, Home,
    Search, Filter, ChevronRight, Loader2,
    Calendar, CheckCircle, XCircle
} from 'lucide-react';
import Link from 'next/link';

export default function WardenPortal() {
    const [applications, setApplications] = useState<any[]>([]);
    const [blocks, setBlocks] = useState<any[]>([]);
    const [selectedBlockId, setSelectedBlockId] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('Pending');
    const [stats, setStats] = useState({
        pending: 0,
        enrolled: 0,
        available: 0
    });

    useEffect(() => {
        fetchDashboard();
    }, [selectedBlockId]);

    const fetchDashboard = async () => {
        setLoading(true);
        try {
            const url = selectedBlockId
                ? `/api/warden/dashboard?blockId=${selectedBlockId}`
                : '/api/warden/dashboard';

            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setApplications(data.applications || []);
                setBlocks(data.occupancy || []);

                // If no block selected, default to the first one available to the warden
                if (!selectedBlockId && data.occupancy?.length > 0) {
                    setSelectedBlockId(data.occupancy[0].blockId);
                }

                const p = data.stats?.pendingApplications || 0;
                const e = data.stats?.acceptedApplications || 0;

                // Get available rooms for selected block
                const currentBlock = data.occupancy?.find((b: any) => b.blockId === (selectedBlockId || data.occupancy[0]?.blockId));
                const available = currentBlock?.availableRooms || 0;

                setStats(prev => ({ ...prev, pending: p, enrolled: e, available }));
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const [showNoticeModal, setShowNoticeModal] = useState(false);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const handleReview = async (id: string, status: 'Accepted' | 'Rejected') => {
        setProcessingId(id);
        try {
            const res = await fetch(`/api/applications/${id}/review`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status,
                    notes: status === 'Accepted' ? 'Welcome to the hostel!' : 'Room unavailability'
                })
            });

            const data = await res.json();

            if (res.ok) {
                alert(`✅ Application ${status === 'Accepted' ? 'approved' : 'rejected'} successfully!`);
                await fetchDashboard(); // Refresh the list
            } else {
                alert(`❌ Error: ${data.error || 'Failed to process application'}`);
            }
        } catch (error) {
            console.error('Review error:', error);
            alert('❌ Failed to process application. Please try again.');
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-light">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 py-6 px-12 shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-secondary/20">
                            <Home size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-dark tracking-tight">Warden Dashboard</h1>
                            <div className="flex items-center gap-2">
                                <select
                                    value={selectedBlockId}
                                    onChange={(e) => setSelectedBlockId(e.target.value)}
                                    className="bg-transparent text-xs text-primary font-black uppercase tracking-widest border-none p-0 focus:ring-0 cursor-pointer hover:underline"
                                >
                                    {blocks.map(b => (
                                        <option key={b.blockId} value={b.blockId} className="text-dark">
                                            {b.blockName} • North Campus
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-3 bg-light rounded-xl hover:bg-gray-200 transition-all relative">
                            <Bell size={20} className="text-dark-light" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-white"></span>
                        </button>
                        <div className="w-12 h-12 bg-dark rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white font-bold">
                            R
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {[
                        { label: 'New Applicants', val: stats.pending, icon: Clock, color: 'text-accent', bg: 'bg-accent/10' },
                        { label: 'Total Enrolled', val: stats.enrolled, icon: UserCheck, color: 'text-primary', bg: 'bg-primary/10' },
                        { label: 'Rooms Left', val: stats.available, icon: Home, color: 'text-success', bg: 'bg-success/10' },
                        { label: 'Complaints', val: 0, icon: AlertCircleShim, color: 'text-danger', bg: 'bg-danger/10' }
                    ].map((s, i) => (
                        <div key={i} className="bg-card p-8 rounded-[2.5rem] shadow-sm border border-white hover:shadow-card transition-all group relative overflow-hidden">
                            <div className={`absolute top-0 right-0 w-24 h-24 ${s.bg} rounded-bl-[100px] opacity-20 -z-0 group-hover:scale-125 transition-transform`} />
                            <div className={`w-14 h-14 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform relative z-10`}>
                                <s.icon size={28} />
                            </div>
                            <p className="text-xs font-black text-dark-light uppercase tracking-widest mb-1 relative z-10">{s.label}</p>
                            <p className="text-4xl font-black text-dark relative z-10">{s.val}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left: Application Queue */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-black text-dark tracking-tight">Admission Queue</h2>
                            <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
                                <button className="px-6 py-2 bg-dark text-white rounded-xl text-sm font-bold transition-all shadow-lg">Pending</button>
                                <button className="px-6 py-2 text-dark-light hover:bg-light rounded-xl text-sm font-bold transition-all">Verified</button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="py-24 text-center">
                                <Loader2 className="w-12 h-12 text-secondary animate-spin mx-auto mb-4" />
                            </div>
                        ) : applications.length > 0 ? (
                            <div className="space-y-6">
                                {applications.filter(a => a.status === 'Pending').map((app) => (
                                    <div key={app._id} className="bg-card p-8 rounded-[3rem] shadow-sm border border-transparent hover:border-secondary/20 hover:shadow-card transition-all flex flex-col md:flex-row items-center gap-8 group">
                                        <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-[2rem] flex items-center justify-center text-secondary text-4xl font-black shadow-inner group-hover:scale-105 transition-transform">
                                            {app.studentId?.name?.charAt(0) || 'S'}
                                        </div>
                                        <div className="flex-1 text-center md:text-left">
                                            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                                <h3 className="text-2xl font-black text-dark">{app.studentId?.name || 'Student Name'}</h3>
                                                {app.studentId?.feeStatus?.isPaid && (
                                                    <span className="px-4 py-1.5 bg-success/10 text-success rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                                        <CheckCircle size={10} /> Paid
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-bold text-dark-light uppercase tracking-widest bg-light/50 inline-flex px-4 py-2 rounded-xl">
                                                <span className="text-primary">{app.studentId?.course || 'Engineering'}</span>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full my-auto"></span>
                                                <span>Year {app.studentId?.year || 1}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => handleReview(app._id, 'Rejected')}
                                                disabled={processingId === app._id}
                                                className="w-16 h-16 bg-danger/5 text-danger rounded-[1.5rem] flex items-center justify-center hover:bg-danger hover:text-white transition-all shadow-sm border border-danger/10 disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Reject Application"
                                            >
                                                {processingId === app._id ? (
                                                    <Loader2 className="animate-spin" size={28} />
                                                ) : (
                                                    <XCircle size={28} />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => handleReview(app._id, 'Accepted')}
                                                disabled={processingId === app._id}
                                                className="px-10 py-5 bg-success text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-success/20 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                            >
                                                {processingId === app._id ? (
                                                    <>
                                                        <Loader2 className="animate-spin" size={22} />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle size={22} />
                                                        Approve Entry
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white/50 border-4 border-dashed border-gray-100 p-24 rounded-[4rem] text-center">
                                <div className="text-6xl mb-6 opacity-20 italic">No Admits</div>
                                <p className="text-xl font-bold text-dark-light">All applications have been processed for today.</p>
                            </div>
                        )}
                    </div>

                    {/* Right: Management Console */}
                    <div className="space-y-8">
                        {/* Notice Center */}
                        <div className="bg-dark rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-bl-[100px] -z-0" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="p-4 bg-white/10 text-primary rounded-2xl backdrop-blur-md">
                                        <Bell size={28} />
                                    </div>
                                    <h3 className="text-2xl font-black text-white">Notice Center</h3>
                                </div>
                                <button
                                    onClick={() => setShowNoticeModal(true)}
                                    className="w-full py-5 bg-white text-dark rounded-2xl font-black text-sm uppercase tracking-widest mb-6 hover:bg-primary hover:text-white transition-all shadow-xl flex items-center justify-center gap-3"
                                >
                                    <FileText size={20} />
                                    Post New Notice
                                </button>
                                <Link href="/dashboard/notices" className="block text-center text-sm font-bold text-white/50 hover:text-white transition-colors">Broadcast History →</Link>
                            </div>
                        </div>

                        {/* Mess Management */}
                        <div className="bg-white rounded-[3.5rem] p-10 shadow-card border border-white group">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="p-4 bg-success/10 text-success rounded-2xl group-hover:rotate-6 transition-transform">
                                    <Utensils size={28} />
                                </div>
                                <h3 className="text-2xl font-black text-dark">Mess Panel</h3>
                            </div>
                            <button className="w-full py-5 bg-light text-dark-light rounded-2xl font-black text-sm uppercase tracking-widest mb-6 hover:bg-dark hover:text-white transition-all flex items-center justify-center gap-3">
                                <Calendar size={20} />
                                Configure Menu
                            </button>
                            <Link href="/dashboard/mess-menu" className="block text-center text-sm font-bold text-primary hover:underline underline-offset-4">Manage Preferences →</Link>
                        </div>
                    </div>
                </div>
            </main>

            {/* Simple Notice Modal Placeholder */}
            {showNoticeModal && (
                <div className="fixed inset-0 z-[60] bg-dark/60 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-xl rounded-[3rem] p-12 shadow-2xl">
                        <h2 className="text-3xl font-black text-dark mb-6">Create Announcement</h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-dark-light pl-2">Subject</label>
                                <input type="text" className="w-full p-5 bg-light rounded-2xl border-none focus:ring-2 focus:ring-primary font-bold" placeholder="Maintenance Schedule..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-dark-light pl-2">Content</label>
                                <textarea rows={4} className="w-full p-5 bg-light rounded-2xl border-none focus:ring-2 focus:ring-primary font-medium" placeholder="Write your message here..."></textarea>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setShowNoticeModal(false)} className="flex-1 py-5 bg-light text-dark font-black rounded-2xl hover:bg-gray-200 transition-all">Cancel</button>
                                <button onClick={() => setShowNoticeModal(false)} className="flex-[2] py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all">Broadcast Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function AlertCircleShim({ size, className }: { size?: number, className?: string }) {
    return <Users size={size} className={className} />;
}
