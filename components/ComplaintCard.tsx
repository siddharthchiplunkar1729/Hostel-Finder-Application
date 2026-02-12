"use client";

import { Clock, CheckCircle2, Circle, User2 } from 'lucide-react';

interface ComplaintCardProps {
    complaint: {
        _id: string;
        category: string;
        title: string;
        description: string;
        priority: string;
        status: string;
        location: {
            type: string;
            roomNumber?: string;
            areaName?: string;
        };
        assignedTo?: {
            name: string;
            role: string;
        };
        eta?: string;
        createdAt: string;
        photos?: string[];
    };
}

const CATEGORY_COLORS: { [key: string]: string } = {
    'Electrical': 'bg-yellow-100 text-yellow-700',
    'Plumbing': 'bg-blue-100 text-blue-700',
    'Cleaning': 'bg-green-100 text-green-700',
    'WiFi': 'bg-purple-100 text-purple-700',
    'Mess': 'bg-orange-100 text-orange-700',
    'Other': 'bg-gray-100 text-gray-700',
};

const STATUS_STEPS = ['Pending', 'Assigned', 'In Progress', 'Resolved'];

export default function ComplaintCard({ complaint }: ComplaintCardProps) {
    const currentStepIndex = STATUS_STEPS.indexOf(complaint.status);
    const priorityColor =
        complaint.priority === 'High' ? 'border-l-priority-high' :
            complaint.priority === 'Medium' ? 'border-l-priority-medium' :
                'border-l-priority-low';

    return (
        <div className={`group bg-card/40 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-card hover:shadow-elevated transition-all duration-300 border-l-8 ${priorityColor} border border-white/5 relative overflow-hidden`}>
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap gap-3">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${CATEGORY_COLORS[complaint.category] || 'bg-gray-100 text-gray-700'}`}>
                            {complaint.category}
                        </span>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${complaint.priority === 'High' ? 'bg-danger/10 text-danger' :
                            complaint.priority === 'Medium' ? 'bg-accent/10 text-accent' : 'bg-success/10 text-success'
                            }`}>
                            Priority: {complaint.priority}
                        </span>
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-foreground tracking-tight mb-2 group-hover:text-primary transition-colors">
                            {complaint.title}
                        </h3>
                        <p className="text-muted-foreground font-medium leading-relaxed line-clamp-2">
                            {complaint.description}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Reference ID</div>
                    <div className="text-sm font-black text-foreground bg-muted px-4 py-2 rounded-xl border border-white/5">
                        #{complaint._id.slice(-6).toUpperCase()}
                    </div>
                </div>
            </div>

            {/* Status Flow - Premium Horizontal Line */}
            <div className="relative py-8 mb-8 border-y border-white/5">
                <div className="flex justify-between items-center relative z-10">
                    {STATUS_STEPS.map((step, idx) => {
                        const isPast = idx < currentStepIndex;
                        const isCurrent = idx === currentStepIndex;
                        return (
                            <div key={step} className="flex flex-col items-center gap-3">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm ${isPast ? 'bg-success text-white' :
                                    isCurrent ? 'bg-primary text-white scale-110 shadow-premium animate-pulse-soft' :
                                        'bg-muted text-muted-foreground/40 border border-white/5'
                                    }`}>
                                    {isPast ? <CheckCircle2 size={24} /> : isCurrent ? <Clock size={24} /> : <Circle size={12} />}
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                                    {step}
                                </span>
                            </div>
                        );
                    })}
                </div>
                {/* Connector Line Background */}
                <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-muted -translate-y-[1.5rem] -z-0" />
                <div
                    className="absolute top-1/2 left-6 h-0.5 bg-success transition-all duration-1000 -translate-y-[1.5rem] -z-0"
                    style={{ width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 90}%` }}
                />
            </div>

            {/* Assignment & Metadata */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    {complaint.assignedTo ? (
                        <div className="flex items-center gap-4 p-3 pr-6 bg-muted/50 rounded-[2rem] border border-white/5">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-sm">
                                <User2 size={22} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-tight">Field Agent</p>
                                <p className="text-sm font-black text-foreground leading-tight">{complaint.assignedTo.name}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 text-dark-light opacity-50 italic text-sm">
                            <User2 size={18} />
                            <span>Queued for assignment...</span>
                        </div>
                    )}

                    {complaint.eta && (
                        <div className="px-6 py-2 bg-primary/5 rounded-2xl border border-primary/10">
                            <p className="text-[9px] font-black text-primary uppercase tracking-widest">Est. Resolution</p>
                            <p className="text-sm font-black text-primary">
                                {new Date(complaint.eta).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                    <span>Logged: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
}
