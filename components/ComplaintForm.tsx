"use client";

import { XCircle, Camera, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { getAuthHeaders } from '@/lib/clientAuth';

interface ComplaintFormProps {
    onClose: () => void;
    studentId?: string;
}

const CATEGORIES = [
    { value: 'Electrical', icon: '⚡', color: 'text-yellow-500' },
    { value: 'Plumbing', icon: '🚰', color: 'text-blue-500' },
    { value: 'Cleaning', icon: '🧹', color: 'text-green-500' },
    { value: 'WiFi', icon: '📶', color: 'text-purple-500' },
    { value: 'Mess', icon: '🍽️', color: 'text-orange-500' },
    { value: 'Other', icon: '📋', color: 'text-gray-500' },
];

const COMMON_ISSUES: { [key: string]: string[] } = {
    'Electrical': ['Light not working', 'Fan not working', 'Socket damaged', 'Power outage'],
    'Plumbing': ['Leaking tap', 'Clogged drain', 'No water supply', 'Toilet flush issue'],
    'Cleaning': ['Room needs cleaning', 'Bathroom dirty', 'Corridor unclean', 'Garbage not collected'],
    'WiFi': ['No internet connection', 'Slow internet', 'WiFi not working in room', 'Need router reset'],
    'Mess': ['Food quality poor', 'Insufficient quantity', 'Menu issue', 'Hygiene concern'],
    'Other': ['General maintenance', 'Safety concern', 'Noise complaint'],
};

export default function ComplaintForm({ onClose, studentId }: ComplaintFormProps) {
    const [formData, setFormData] = useState({
        category: '',
        locationType: 'Room',
        roomNumber: '',
        areaName: '',
        title: '',
        description: '',
    });
    const [photos, setPhotos] = useState<File[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // TODO: Upload photos and create complaint
            const complaintData = {
                ...formData,
                studentId,
                location: {
                    type: formData.locationType,
                    roomNumber: formData.locationType === 'Room' ? formData.roomNumber : undefined,
                    areaName: formData.locationType === 'Common Area' ? formData.areaName : undefined,
                },
            };

            const res = await fetch('/api/complaints', {
                method: 'POST',
                headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify(complaintData),
            });

            if (res.ok) {
                alert('Complaint submitted successfully!');
                onClose();
            } else {
                alert('Failed to submit complaint');
            }
        } catch (error) {
            console.error('Error submitting complaint:', error);
            alert('Error submitting complaint');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-elevated animate-slide-up">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between rounded-t-3xl">
                    <div>
                        <h2 className="text-2xl font-bold text-dark">Submit Complaint</h2>
                        <p className="text-sm text-dark-light mt-1">We'll resolve it as soon as possible</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-light rounded-xl transition-colors"
                    >
                        <XCircle size={24} className="text-dark-light" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Category Selection */}
                    <div>
                        <label className="block text-sm font-bold text-dark mb-3">Category *</label>
                        <div className="grid grid-cols-3 gap-3">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, category: cat.value, title: '' })}
                                    className={`p-4 rounded-xl border-2 transition-all ${formData.category === cat.value
                                            ? 'border-primary bg-primary/5 shadow-sm'
                                            : 'border-gray-200 hover:border-primary/50'
                                        }`}
                                >
                                    <div className={`text-3xl mb-2 ${cat.color}`}>{cat.icon}</div>
                                    <div className="text-sm font-semibold text-dark">{cat.value}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Common Issues (Auto-suggest) */}
                    {formData.category && COMMON_ISSUES[formData.category] && (
                        <div>
                            <label className="block text-sm font-bold text-dark mb-2">Quick Select</label>
                            <div className="flex flex-wrap gap-2">
                                {COMMON_ISSUES[formData.category].map((issue) => (
                                    <button
                                        key={issue}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, title: issue })}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${formData.title === issue
                                                ? 'bg-primary text-white'
                                                : 'bg-light text-dark hover:bg-light-hover'
                                            }`}
                                    >
                                        {issue}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Location Type */}
                    <div>
                        <label className="block text-sm font-bold text-dark mb-3">Location *</label>
                        <div className="flex gap-3">
                            {['Room', 'Common Area'].map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, locationType: type })}
                                    className={`flex-1 py-3 rounded-xl font-semibold transition-all ${formData.locationType === type
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'bg-light text-dark hover:bg-light-hover'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Room/Area Input */}
                    {formData.locationType === 'Room' ? (
                        <div>
                            <label className="block text-sm font-bold text-dark mb-2">Room Number *</label>
                            <input
                                type="text"
                                value={formData.roomNumber}
                                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                                placeholder="e.g., A-104"
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                                required
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-bold text-dark mb-2">Area Name *</label>
                            <input
                                type="text"
                                value={formData.areaName}
                                onChange={(e) => setFormData({ ...formData, areaName: e.target.value })}
                                placeholder="e.g., Ground Floor Bathroom"
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                                required
                            />
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-bold text-dark mb-2">Issue Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Brief description of the issue"
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-dark mb-2">Detailed Description *</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Provide more details about the issue..."
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors resize-none"
                            required
                        />
                    </div>

                    {/* Photo Upload */}
                    <div>
                        <label className="block text-sm font-bold text-dark mb-2">Photos (Optional)</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary transition-colors cursor-pointer">
                            <Camera size={32} className="mx-auto text-dark-light mb-2" />
                            <p className="text-sm text-dark-light">Click to upload photos</p>
                            <p className="text-xs text-dark-light mt-1">Up to 3 photos</p>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-bold text-dark hover:bg-light transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || !formData.category || !formData.title}
                            className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit Complaint'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
