"use client";

import { ThumbsUp, ThumbsDown, Clock, Utensils } from 'lucide-react';
import { useState } from 'react';

interface MessMenuCardProps {
    menu: {
        _id: string;
        date: string;
        day: string;
        meals: Array<{
            mealType: string;
            items: string[];
            timings: string;
            calories?: number;
            isVeg: boolean;
            thumbsUp: number;
            thumbsDown: number;
        }>;
        specialMenu: boolean;
        notes?: string;
    };
}

const MEAL_COLORS: { [key: string]: string } = {
    'Breakfast': 'from-orange-400 to-yellow-400',
    'Lunch': 'from-green-400 to-emerald-400',
    'Snacks': 'from-purple-400 to-pink-400',
    'Dinner': 'from-blue-400 to-indigo-400',
};

const MEAL_ICONS: { [key: string]: string } = {
    'Breakfast': '🌅',
    'Lunch': '☀️',
    'Snacks': '☕',
    'Dinner': '🌙',
};

export default function MessMenuCard({ menu }: MessMenuCardProps) {
    const [activeRatings, setActiveRatings] = useState<{ [key: string]: 'up' | 'down' | null }>({});
    const parsedDate = menu.date ? new Date(menu.date) : null;
    const hasValidDate = Boolean(parsedDate && !Number.isNaN(parsedDate.getTime()));
    const isToday = hasValidDate
        ? parsedDate!.toDateString() === new Date().toDateString()
        : menu.day === new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const headerDateLabel = hasValidDate
        ? parsedDate!.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : menu.day;

    const handleRating = async (mealType: string, rating: 'up' | 'down') => {
        setActiveRatings(prev => ({
            ...prev,
            [mealType]: prev[mealType] === rating ? null : rating
        }));

        // TODO: Submit rating to API
        await fetch(`/api/mess-menu/${menu._id}/rate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mealType, rating })
        });
    };

    return (
        <div className="group bg-card text-card-foreground rounded-[4rem] overflow-hidden shadow-card hover:shadow-elevated transition-all duration-500 border border-border">
            {/* Elite Header */}
            <div className={`p-10 relative overflow-hidden ${menu.specialMenu
                ? 'bg-gradient-to-br from-accent to-orange-400'
                : 'bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900'} text-white`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -z-0" />
                <div className="relative z-10 flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-4xl font-black tracking-tighter">{menu.day}</h3>
                            {isToday && (
                                <span className="px-4 py-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-premium">
                                    Current Day
                                </span>
                            )}
                        </div>
                        <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-[10px]">
                            {headerDateLabel}
                        </p>
                    </div>
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center text-primary">
                        <Utensils size={32} />
                    </div>
                </div>
                {menu.notes && (
                    <div className="mt-8 p-6 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10">
                        <p className="text-sm font-black italic opacity-80 leading-relaxed">&quot;{menu.notes}&quot;</p>
                    </div>
                )}
            </div>

            {/* Culinary Selections */}
            <div className="p-10 space-y-8">
                {menu.meals.map((meal, idx) => {
                    const thumbsUp = meal.thumbsUp ?? 0;
                    const thumbsDown = meal.thumbsDown ?? 0;
                    const totalRatings = thumbsUp + thumbsDown;
                    const positivePercentage = totalRatings > 0 ? (thumbsUp / totalRatings) * 100 : 50;
                    const items = Array.isArray(meal.items) ? meal.items : [];

                    return (
                        <div key={idx} className="group/meal space-y-6 pb-8 border-b border-border last:border-0 last:pb-0">
                            {/* Meal Info Hub */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <div className={`w-20 h-20 rounded-[2.5rem] bg-gradient-to-br ${MEAL_COLORS[meal.mealType] || 'from-gray-200 to-gray-100'} flex items-center justify-center text-4xl shadow-sm group-hover/meal:scale-110 transition-transform`}>
                                        {MEAL_ICONS[meal.mealType] || '🍽️'}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h4 className="text-2xl font-black text-foreground tracking-tight">{meal.mealType}</h4>
                                            {meal.isVeg && (
                                                <div className="w-4 h-4 rounded-full border-2 border-green-500 flex items-center justify-center p-0.5">
                                                    <div className="w-full h-full bg-green-500 rounded-full" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={12} className="text-primary" />
                                                {meal.timings}
                                            </div>
                                            {meal.calories && (
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-secondary">•</span>
                                                    {meal.calories} Essential Calories
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleRating(meal.mealType, 'up')}
                                            className={`px-6 py-3 rounded-2xl flex items-center gap-2 transition-all ${activeRatings[meal.mealType] === 'up'
                                            ? 'bg-success text-white shadow-premium'
                                            : 'bg-muted hover:bg-success/10 text-muted-foreground hover:text-success'}`}
                                    >
                                        <ThumbsUp size={18} />
                                        <span className="font-black text-xs uppercase tracking-widest">{thumbsUp}</span>
                                    </button>
                                    <button
                                        onClick={() => handleRating(meal.mealType, 'down')}
                                            className={`px-6 py-3 rounded-2xl flex items-center gap-2 transition-all ${activeRatings[meal.mealType] === 'down'
                                            ? 'bg-danger text-white shadow-premium'
                                            : 'bg-muted hover:bg-danger/10 text-muted-foreground hover:text-danger'}`}
                                    >
                                        <ThumbsDown size={18} />
                                        <span className="font-black text-xs uppercase tracking-widest">{thumbsDown}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Menu Items Grid */}
                            <div className="flex flex-wrap gap-3">
                                {items.map((item, itemIdx) => (
                                    <div
                                        key={itemIdx}
                                        className="px-6 py-3 bg-muted/60 hover:bg-card hover:shadow-card border border-transparent hover:border-border rounded-[1.5rem] text-sm font-black text-foreground transition-all"
                                    >
                                        {item}
                                    </div>
                                ))}
                                {items.length === 0 && (
                                    <div className="px-6 py-3 bg-muted/60 rounded-[1.5rem] text-sm font-bold text-muted-foreground">
                                        Menu will be updated soon.
                                    </div>
                                )}
                            </div>

                            {/* Popularity Index */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-70">
                                    <span>Resident Saturation</span>
                                    <span>{positivePercentage.toFixed(0)}% Approval</span>
                                </div>
                                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-success to-primary transition-all duration-1000"
                                        style={{ width: `${positivePercentage}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
