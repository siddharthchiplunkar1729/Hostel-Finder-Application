"use client";

import { useState, useEffect } from 'react';
import {
    ShieldCheck, Building2, Clock, CheckCircle2,
    XCircle, AlertCircle, Eye, Search, Filter,
    ArrowUpRight, Users, Star, Loader2, MoreVertical
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPortal() {
    const [hostels, setHostels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('Pending');
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState({
        pending: 0,
        approved: 0,
        total: 0
    });

    useEffect(() => {
        fetchHostels();
    }, [filter]);

    const fetchHostels = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/hostels?status=${filter !== 'All' ? filter : ''}`);
            if (res.ok) {
                const data = await res.json();
                setHostels(data);

                // Simplified stats calculation
                if (filter === 'All') {
                    const p = data.filter((h: any) => h.approvalStatus === 'Pending').length;
                    const a = data.filter((h: any) => h.approvalStatus === 'Approved').length;
                    setStats({ pending: p, approved: a, total: data.length });
                }
            }
        } catch (error) {
            console.error('Error fetching hostels:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApproval = async (id: string, status: 'Approved' | 'Rejected') => {
        try {
            const res = await fetch(`/api/admin/hostels/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status,
                    remarks: status === 'Approved' ? 'Verified by Admin' : 'Documents incomplete',
                    adminId: 'admin_123' // Mock admin ID
                })
            });

            if (res.ok) {
                fetchHostels();
            }
        } catch (error) {
            console.error('Approval error:', error);
        }
    };

    const filteredHostels = hostels.filter(h =>
        h.blockName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.wardenInfo?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Sidebar / Header Nav */}
            <div className="bg-dark text-white py-6 px-12 flex justify-between items-center shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <ShieldCheck size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight">Admin Console</h1>
                        <p className="text-xs text-white/50 font-bold uppercase tracking-widest">Marketplace Orchestrator</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold">University Administrator</p>
                        <p className="text-xs text-white/50">admin@hostelhub.com</p>
                    </div>
                    <div className="w-12 h-12 bg-white/10 rounded-full border border-white/20 flex items-center justify-center font-bold">
                        A
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {[
                        { label: 'Pending Approvals', val: stats.pending || 0, icon: Clock, color: 'text-accent', bg: 'bg-accent/10' },
                        { label: 'Approved Hostels', val: hostels.filter(h => h.approvalStatus === 'Approved').length || 0, icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
                        { label: 'Total Listings', val: hostels.length || 0, icon: Building2, color: 'text-primary', bg: 'bg-primary/10' }
                    ].map((s, i) => (
                        <div key={i} className="bg-card p-8 rounded-[2.5rem] shadow-sm border border-white flex items-center justify-between group hover:shadow-card transition-all">
                            <div>
                                <p className="text-sm font-black text-dark-light uppercase tracking-widest mb-1">{s.label}</p>
                                <p className={`text-4xl font-black ${s.color}`}>{s.val}</p>
                            </div>
                            <div className={`w-16 h-16 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <s.icon size={32} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Action Bar */}
                <div className="flex flex-col md:flex-row gap-6 mb-8 items-center">
                    <div className="flex-1 relative w-full">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-dark-light" size={20} />
                        <input
                            type="text"
                            placeholder="Search by block name or warden..."
                            className="w-full pl-16 pr-6 py-5 bg-white rounded-[2rem] shadow-sm border-none focus:ring-2 focus:ring-primary transition-all font-medium text-dark"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 bg-white p-2 rounded-[2rem] shadow-sm border border-white overflow-x-auto w-full md:w-auto">
                        {['Pending', 'Approved', 'Rejected', 'All'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setFilter(t)}
                                className={`px-8 py-3 rounded-2xl text-sm font-black transition-all whitespace-nowrap ${filter === t ? 'bg-dark text-white shadow-xl' : 'text-dark-light hover:bg-light'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Listings Table/Grid */}
                {loading ? (
                    <div className="py-24 text-center">
                        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                        <p className="font-bold text-dark-light">Fetching listing requests...</p>
                    </div>
                ) : filteredHostels.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredHostels.map((hostel) => (
                            <div key={hostel._id} className="bg-white rounded-[3rem] p-8 shadow-sm border border-white hover:shadow-card transition-all group">
                                <div className="flex flex-col lg:flex-row gap-8 items-center">
                                    {/* Info */}
                                    <div className="w-full lg:w-1/4">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-16 h-16 bg-light rounded-2xl flex items-center justify-center text-primary">
                                                <Building2 size={32} />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-dark leading-tight">{hostel.blockName}</h3>
                                                <p className="text-sm font-bold text-dark-light">{hostel.type} Hostel</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-dark-light text-sm font-medium">
                                            <MapPin size={14} className="text-secondary" />
                                            North Campus, Block A-Z
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex-1 grid grid-cols-3 gap-6 w-full px-8 border-x border-gray-100 hidden lg:grid">
                                        <div className="text-center">
                                            <p className="text-[10px] font-black text-dark-light uppercase tracking-tighter mb-1">Capacity</p>
                                            <p className="text-xl font-black text-dark">{hostel.totalRooms}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] font-black text-dark-light uppercase tracking-tighter mb-1">Rating</p>
                                            <p className="text-xl font-black text-dark flex items-center justify-center gap-1">
                                                <Star size={18} fill="#FBBF24" className="text-yellow-400" />
                                                {hostel.rating.toFixed(1)}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] font-black text-dark-light uppercase tracking-tighter mb-1">Status</p>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${hostel.approvalStatus === 'Approved' ? 'bg-success/10 text-success' :
                                                hostel.approvalStatus === 'Pending' ? 'bg-accent/10 text-accent' :
                                                    'bg-danger/10 text-danger'
                                                }`}>
                                                {hostel.approvalStatus}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Warden */}
                                    <div className="w-full lg:w-1/5 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-full flex items-center justify-center font-bold">
                                            {hostel.wardenInfo.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-dark-light uppercase">Warden</p>
                                            <p className="text-sm font-bold text-dark">{hostel.wardenInfo.name}</p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="w-full lg:w-1/4 flex items-center gap-4 justify-end">
                                        <Link
                                            href={`/hostels/${hostel._id}`}
                                            className="p-4 bg-light rounded-2xl text-dark hover:bg-dark hover:text-white transition-all shadow-sm"
                                            title="View Details"
                                        >
                                            <Eye size={20} />
                                        </Link>

                                        {hostel.approvalStatus === 'Pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleApproval(hostel._id, 'Rejected')}
                                                    className="px-6 py-4 bg-danger/10 text-danger rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-danger hover:text-white transition-all shadow-sm shadow-danger/10 flex items-center gap-2"
                                                >
                                                    <XCircle size={18} />
                                                    Reject
                                                </button>
                                                <button
                                                    onClick={() => handleApproval(hostel._id, 'Approved')}
                                                    className="px-8 py-4 bg-success text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-success/20 flex items-center gap-2"
                                                >
                                                    <CheckCircle2 size={18} />
                                                    Approve
                                                </button>
                                            </>
                                        )}

                                        <button className="p-4 bg-light rounded-xl text-dark-light hover:text-dark transition-all lg:hidden">
                                            <MoreVertical size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
                        <div className="text-6xl mb-4">✨</div>
                        <h2 className="text-2xl font-black text-dark mb-2">No listing requests!</h2>
                        <p className="text-dark-light font-medium">All clear. New requests will appear here for verification.</p>
                    </div>
                )}
            </main>
        </div>
    );
}

function MapPin({ size, className }: { size?: number, className?: string }) {
    return <AlertCircle size={size} className={className} />;
}
