"use client";

import { AlertCircle, Bell, Share2, Bookmark, CheckCircle, Clock } from 'lucide-react';
import { useState } from 'react';

interface NoticeCardProps {
    notice: {
        _id: string;
        title: string;
        content: string;
        type: string;
        priority: string;
        from?: {
            role: string;
            name: string;
        };
        createdAt: string;
        attachments?: Array<{
            name: string;
            url: string;
        }>;
        isAcknowledged?: boolean;
    };
}

const TYPE_CONFIG: { [key: string]: { bg: string, icon: any, border: string } } = {
    'Emergency': {
        bg: 'bg-gradient-to-r from-danger to-red-600',
        icon: AlertCircle,
        border: 'border-l-danger'
    },
    'Important': {
        bg: 'bg-gradient-to-r from-accent to-orange-500',
        icon: Bell,
        border: 'border-l-accent'
    },
    'General': {
        bg: 'bg-gradient-to-r from-primary to-blue-600',
        icon: Bell,
        border: 'border-l-primary'
    },
};

export default function NoticeCard({ notice }: NoticeCardProps) {
    const [acknowledged, setAcknowledged] = useState(notice.isAcknowledged || false);
    const [saved, setSaved] = useState(false);
    const fromRole = notice.from?.role || 'Administrative Office';
    const fromName = notice.from?.name || 'Hostel Hub System';

    const config = TYPE_CONFIG[notice.type] || TYPE_CONFIG['General'];
    const Icon = config.icon;

    const handleAcknowledge = async () => {
        setAcknowledged(true);
        // TODO: Call API to acknowledge
        await fetch(`/api/notices/${notice._id}/acknowledge`, {
            method: 'PUT',
        });
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: notice.title,
                text: notice.content,
            });
        }
    };

    return (
        <div className={`group bg-card rounded-[3.5rem] overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 border-l-8 ${config.border} relative`}>
            {/* High-Concept Header */}
            <div className={`${config.bg} p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 text-white`}>
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center border border-white/20">
                        <Icon size={32} />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                                Official {notice.type}
                            </span>
                            {notice.priority === 'High' && !acknowledged && (
                                <span className="px-4 py-1.5 bg-danger text-white text-[10px] font-black uppercase tracking-widest rounded-full animate-pulse-soft shadow-premium">
                                    Flash Bulletin
                                </span>
                            )}
                        </div>
                        <p className="text-white/60 font-black uppercase tracking-[0.2em] text-[10px]">
                            Broadcast from {fromRole} • {fromName}
                        </p>
                    </div>
                </div>
                {!acknowledged && (
                    <div className="flex items-center animate-bounce">
                        <div className="w-4 h-4 bg-yellow-300 rounded-full shadow-[0_0_20px_rgba(253,224,71,0.5)]" />
                    </div>
                )}
            </div>

            {/* Content Core */}
            <div className="p-10">
                <h3 className="text-3xl font-black text-dark tracking-tight mb-6 group-hover:text-primary transition-colors leading-tight">
                    {notice.title}
                </h3>
                <p className="text-dark-light font-medium leading-relaxed mb-10 whitespace-pre-wrap text-lg">
                    {notice.content}
                </p>

                {/* Attachments Hub */}
                {notice.attachments && notice.attachments.length > 0 && (
                    <div className="space-y-4 mb-10">
                        <div className="text-[10px] font-black uppercase tracking-widest text-dark-light mb-2">Authenticated Enclosures</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {notice.attachments.map((attachment, idx) => (
                                <a
                                    key={idx}
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 p-5 bg-light hover:bg-white hover:shadow-card border border-transparent hover:border-gray-50 rounded-[2rem] transition-all group/attachment"
                                >
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover/attachment:bg-primary group-hover/attachment:text-white transition-colors">
                                        📄
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-black text-dark tracking-tight leading-none mb-1">
                                            {attachment.name}
                                        </p>
                                        <p className="text-[10px] font-bold text-dark-light opacity-60 uppercase tracking-widest">Digital Asset • PDF</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Engagement Area */}
                <div className="flex flex-col sm:flex-row items-center gap-6 pt-8 border-t border-gray-50">
                    {!acknowledged ? (
                        <button
                            onClick={handleAcknowledge}
                            className="flex-1 w-full bg-primary hover:bg-primary-hover text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-premium hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
                        >
                            <CheckCircle size={20} />
                            Log Final Acknowledgment
                        </button>
                    ) : (
                        <div className="flex-1 w-full bg-success/5 text-success py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 border border-success/10">
                            <CheckCircle size={20} />
                            Verified Transmission
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button
                            onClick={() => setSaved(!saved)}
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${saved
                                ? 'bg-accent text-white shadow-premium scale-110'
                                : 'bg-light hover:bg-gray-200 text-dark-light'
                                }`}
                        >
                            <Bookmark size={22} fill={saved ? 'currentColor' : 'none'} />
                        </button>

                        <button
                            onClick={handleShare}
                            className="w-14 h-14 bg-light hover:bg-gray-200 rounded-2xl flex items-center justify-center transition-all text-dark-light hover:scale-110"
                        >
                            <Share2 size={22} />
                        </button>
                    </div>
                </div>

                {/* Intelligence Metadata */}
                <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-dark-light opacity-40">
                        <Clock size={12} />
                        {new Date(notice.createdAt).toLocaleDateString()} at {new Date(notice.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-dark-light opacity-40 italic">
                        Hash: {notice._id.toUpperCase()}
                    </span>
                </div>
            </div>
        </div>
    );
}
