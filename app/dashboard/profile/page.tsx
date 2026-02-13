"use client";

import { useState, useEffect } from 'react';
import { User, Shield, MapPin, Phone, Mail, Award, CheckCircle, Download, Share2, QrCode, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAuthHeaders, getStoredUser } from '@/lib/clientAuth';

export default function StudentProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const userData = getStoredUser();
        if (userData) {

            // Access protection
            if (userData.role === 'Student' && !userData.canAccessDashboard) {
                router.push('/search');
                return;
            }

            setUser(userData);
            if (userData.studentId) {
                fetchStudentDetails(userData.studentId);
                return;
            }
            setLoading(false);
        } else {
            router.push('/auth/login');
        }
    }, []);

    const fetchStudentDetails = async (studentId: string) => {
        try {
            const res = await fetch(`/api/students/${studentId}`, { headers: getAuthHeaders() });
            if (res.ok) {
                const data = await res.json();
                setStudent(data);
            }
        } catch (error) {
            console.error('Error fetching student details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return null;

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left: Digital ID Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32">
                            <h2 className="text-2xl font-black text-dark mb-8 tracking-tight">Your Digital Pass</h2>

                            {/* The ID Card */}
                            <div className="relative group perspective">
                                <div className="w-full aspect-[2/3] bg-gradient-to-br from-primary via-primary to-secondary rounded-[3rem] p-8 text-white shadow-[0_50px_100px_-20px_rgba(37,99,235,0.4)] transition-all duration-700 preserve-3d group-hover:rotate-y-12 overflow-hidden">
                                    {/* Background Patterns */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
                                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full -ml-20 -mb-20 blur-2xl" />

                                    <div className="relative z-10 h-full flex flex-col">
                                        <div className="flex justify-between items-start mb-10">
                                            <div className="font-black text-2xl tracking-tighter">HOSTEL<span className="text-white/60">HUB</span></div>
                                            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                                                Verified Student
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center mb-8">
                                            <div className="w-32 h-32 bg-white rounded-[2rem] p-1 shadow-2xl mb-6 flex items-center justify-center overflow-hidden">
                                                <User size={80} className="text-primary opacity-20" />
                                                {/* In a real app: <img src={student?.photo} /> */}
                                            </div>
                                            <h3 className="text-2xl font-black mb-1">{student?.name || 'Aadesh Singh'}</h3>
                                            <p className="text-white/60 font-medium uppercase tracking-widest text-[10px]">{student?.course} • Year {student?.year}</p>
                                        </div>

                                        <div className="space-y-4 mb-auto">
                                            <div className="flex justify-between text-xs font-medium">
                                                <span className="opacity-60 uppercase tracking-widest">Roll Number</span>
                                                <span className="font-black">{student?.rollNumber || 'CS2023001'}</span>
                                            </div>
                                            <div className="flex justify-between text-xs font-medium">
                                                <span className="opacity-60 uppercase tracking-widest">Enrolled Block</span>
                                                <span className="font-black">{student?.hostelInfo?.name || 'A Block'} - Room {student?.roomNumber || 'TBD'}</span>
                                            </div>
                                            <div className="flex justify-between text-xs font-medium">
                                                <span className="opacity-60 uppercase tracking-widest">Emergency</span>
                                                <span className="font-black">{student?.emergencyContact || '+91 99999 00000'}</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-end mt-8 border-t border-white/10 pt-8">
                                            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                                                <QrCode className="text-primary" size={40} />
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Validity</div>
                                                <div className="font-black">JUN 2024 - JUL 2025</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <button className="flex items-center justify-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm font-black text-[10px] uppercase tracking-widest hover:bg-light transition-all">
                                    <Download size={16} className="text-primary" /> Save PDF
                                </button>
                                <button className="flex items-center justify-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm font-black text-[10px] uppercase tracking-widest hover:bg-light transition-all">
                                    <Share2 size={16} className="text-primary" /> Share Pass
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Detailed Info */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Status Overview */}
                        <div className="p-10 bg-white rounded-[3rem] shadow-sm border border-white">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 bg-success/10 text-success rounded-[1.5rem] flex items-center justify-center">
                                    <CheckCircle size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-dark tracking-tight">Status: Active Resident</h3>
                                    <p className="text-dark-light font-medium">All dues cleared and verification complete.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-light rounded-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Shield size={20} className="text-primary" />
                                        <span className="text-sm font-bold text-dark-light">KYC Verified</span>
                                    </div>
                                    <CheckCircle size={16} className="text-success" fill="currentColor" />
                                </div>
                                <div className="p-6 bg-light rounded-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Award size={20} className="text-secondary" />
                                        <span className="text-sm font-bold text-dark-light">Anti-Ragging Signed</span>
                                    </div>
                                    <CheckCircle size={16} className="text-success" fill="currentColor" />
                                </div>
                            </div>
                        </div>

                        {/* Personal Details */}
                        <div className="space-y-8">
                            <h2 className="text-3xl font-black text-dark tracking-tight">Personal Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-dark-light">Full Name</label>
                                    <div className="p-6 bg-white rounded-3xl border border-gray-100 text-dark font-bold flex items-center gap-3">
                                        <User size={18} className="text-primary" /> {student?.name}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-dark-light">Email Address</label>
                                    <div className="p-6 bg-white rounded-3xl border border-gray-100 text-dark font-bold flex items-center gap-3">
                                        <Mail size={18} className="text-primary" /> {student?.email}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-dark-light">Phone Number</label>
                                    <div className="p-6 bg-white rounded-3xl border border-gray-100 text-dark font-bold flex items-center gap-3">
                                        <Phone size={18} className="text-primary" /> {student?.phone}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-dark-light">Department</label>
                                    <div className="p-6 bg-white rounded-3xl border border-gray-100 text-dark font-bold flex items-center gap-3">
                                        <Award size={18} className="text-primary" /> {student?.department}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Emergency Contact */}
                        <div className="p-10 bg-danger/5 rounded-[3rem] border border-danger/10">
                            <h3 className="text-2xl font-black text-danger mb-6 tracking-tight">Emergency Contact</h3>
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex-1 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-danger/60">Guardian Name</label>
                                    <p className="text-xl font-bold text-dark">{student?.guardianInfo?.name || 'Mr. Singh'}</p>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-danger/60">Relationship</label>
                                    <p className="text-xl font-bold text-dark">{student?.guardianInfo?.relation || 'Father'}</p>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-danger/60">Emergency Number</label>
                                    <p className="text-xl font-bold text-dark">{student?.emergencyContact || '+91 91234 56789'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity / Next Steps */}
                        <div className="flex items-center justify-between p-8 bg-dark rounded-[2.5rem] text-white">
                            <div>
                                <h3 className="text-xl font-black mb-1">Looking for Hostels?</h3>
                                <p className="text-white/60 text-sm font-medium">Browse verified listings in our marketplace.</p>
                            </div>
                            <Link href="/search" className="p-4 bg-primary text-white rounded-2xl hover:scale-110 transition-all shadow-xl shadow-primary/20">
                                <ArrowRight size={24} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
