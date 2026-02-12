"use client";

import { FileText, AlertTriangle, Utensils, QrCode, CreditCard, Phone, Star } from 'lucide-react';

interface QuickActionsCardProps {
    onSubmitComplaint: () => void;
}

const ACTIONS = [
    {
        icon: AlertTriangle,
        label: 'File Incident',
        sub: 'Submit support ticket',
        color: 'from-danger/20 to-danger/5',
        text: 'text-danger',
        action: 'complaint'
    },
    {
        icon: Utensils,
        label: 'Culinary Map',
        sub: 'View daily schedule',
        color: 'from-secondary/20 to-secondary/5',
        text: 'text-secondary',
        action: 'menu'
    },
    {
        icon: QrCode,
        label: 'Identity Sync',
        sub: 'QR attendance system',
        color: 'from-primary/20 to-primary/5',
        text: 'text-primary',
        action: 'attendance'
    },
    {
        icon: CreditCard,
        label: 'Financial Portal',
        sub: 'Dues and payments',
        color: 'from-accent/20 to-accent/5',
        text: 'text-accent',
        action: 'fee'
    },
    {
        icon: FileText,
        label: 'Bulletins',
        sub: 'Official archives',
        color: 'from-purple-500/10 to-purple-500/5',
        text: 'text-purple-500',
        action: 'notices'
    },
    {
        icon: Phone,
        label: 'Emergency',
        sub: '24/7 Support Line',
        color: 'from-red-600/20 to-red-600/5',
        text: 'text-red-600',
        action: 'sos'
    },
    {
        icon: Star,
        label: 'Feedback',
        sub: 'Rate experience',
        color: 'from-yellow-400/10 to-yellow-400/5',
        text: 'text-yellow-600',
        action: 'review'
    }
];

export default function QuickActionsCard({ onSubmitComplaint }: QuickActionsCardProps) {
    const handleAction = (action: string) => {
        switch (action) {
            case 'complaint':
                onSubmitComplaint();
                break;
            case 'menu':
                window.location.href = '/dashboard/mess-menu';
                break;
            case 'attendance':
                alert('Advanced Identity Sync coming soon.');
                break;
            case 'fee':
                window.location.href = '/fee-payment';
                break;
            case 'notices':
                window.location.href = '/dashboard/notices';
                break;
            case 'sos':
                alert('Emergency protocol initiated. Wardens notified.');
                break;
            case 'review':
                window.location.href = '/dashboard/reviews';
                break;
        }
    };

    return (
        <div className="bg-card/40 backdrop-blur-xl rounded-[3.5rem] p-10 shadow-card border border-white/5">
            <h2 className="text-3xl font-black text-dark mb-10 tracking-tight">Executive Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
                {ACTIONS.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={idx}
                            onClick={() => handleAction(item.action)}
                            className="group flex flex-col items-center text-center gap-4 transition-all"
                        >
                            <div className={`w-20 h-20 rounded-[2.5rem] bg-gradient-to-br ${item.color} flex items-center justify-center ${item.text} border border-white/10 dark:border-white/5 shadow-sm group-hover:shadow-card group-hover:-translate-y-2 group-hover:scale-110 transition-all duration-300`}>
                                <Icon size={32} />
                            </div>
                            <div>
                                <p className="text-xs font-black text-foreground tracking-tight leading-none mb-1 group-hover:text-primary transition-colors">{item.label}</p>
                                <p className="text-[9px] font-bold text-muted-foreground opacity-60 uppercase tracking-widest">{item.sub}</p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
