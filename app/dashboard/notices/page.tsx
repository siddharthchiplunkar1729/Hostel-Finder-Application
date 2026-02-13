"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NoticeCard from '@/components/NoticeCard';
import { Bell, Search, Filter, ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getAuthHeaders, getStoredUser } from '@/lib/clientAuth';

export default function NoticesPage() {
    const [notices, setNotices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('All');

    const router = useRouter();

    useEffect(() => {
        const userData = getStoredUser();
        if (userData) {
            if (userData.role === 'Student' && !userData.canAccessDashboard) {
                router.push('/search');
                return;
            }
        } else {
            router.push('/auth/login');
            return;
        }
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/notices', { headers: getAuthHeaders() });
            if (res.ok) {
                const data = await res.json();
                setNotices(data);
            }
        } catch (error) {
            console.error('Error fetching notices:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredNotices = notices.filter(notice => {
        const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            notice.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'All' || notice.type === filter;
        return matchesSearch && matchesFilter;
    });

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
                            <h1 className="text-4xl font-black text-dark mb-2">Hostel Notices</h1>
                            <p className="text-dark-light font-medium flex items-center gap-2">
                                <Bell size={18} /> Official announcements and updates
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-light" size={20} />
                        <input
                            type="text"
                            placeholder="Search notices..."
                            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-sm border-none focus:ring-2 focus:ring-primary transition-all font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 bg-white p-1 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                        {['All', 'General', 'Important', 'Emergency'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilter(type)}
                                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${filter === type ? 'bg-primary text-white shadow-md' : 'text-dark-light hover:bg-light'}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Notices Display */}
                {filteredNotices.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {filteredNotices.map((notice) => (
                            <NoticeCard key={notice._id} notice={notice} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[3rem] p-16 text-center shadow-card border border-white">
                        <div className="text-6xl mb-6">📢</div>
                        <h2 className="text-2xl font-bold text-dark mb-4">No notices found</h2>
                        <p className="text-dark-light max-w-md mx-auto">
                            {searchQuery || filter !== 'All'
                                ? "We couldn't find any notices matching your criteria. Try adjusting your search or filters."
                                : "There are no active notices for your hostel right now. Check back later for updates."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
