"use client";

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, GraduationCap, MapPin, Mail, Phone, Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-dark text-white pt-24 pb-12 overflow-hidden relative">
            {/* Background Accent */}
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-0" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20 mb-20">
                    {/* Brand column */}
                    <div className="space-y-8">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="bg-primary text-white p-3 rounded-2xl group-hover:rotate-12 transition-all shadow-premium">
                                <GraduationCap size={28} strokeWidth={2.5} />
                            </div>
                            <span className="text-3xl font-black tracking-tighter">
                                HOSTEL<span className="text-primary underline decoration-4 decoration-accent underline-offset-4">HUB</span>
                            </span>
                        </Link>
                        <p className="text-white/60 text-lg leading-relaxed font-medium">
                            Empowering university campus life through seamless, verified, and community-driven housing solutions.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-primary hover:text-white hover:-translate-y-2 hover:shadow-premium transition-all duration-300">
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-xl font-black mb-8 tracking-tight">Ecosystem</h4>
                        <ul className="space-y-4 text-white/60 font-bold">
                            <li><Link href="/search" className="hover:text-primary transition-colors flex items-center gap-2">Find a Room</Link></li>
                            <li><Link href="/auth/signup?role=Warden" className="hover:text-primary transition-colors">List Your Block</Link></li>
                            <li><Link href="/dashboard" className="hover:text-primary transition-colors">Student Portal</Link></li>
                            <li><Link href="/admin" className="hover:text-primary transition-colors">Safety Verification</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-xl font-black mb-8 tracking-tight">Support</h4>
                        <ul className="space-y-4 text-white/60 font-bold">
                            <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Guidelines</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Contact Admin</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-xl font-black mb-8 tracking-tight">Headquarters</h4>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <span className="text-white/60 font-medium">Central Admin Block, North Campus University, 110007</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary flex-shrink-0">
                                    <Mail size={20} />
                                </div>
                                <span className="text-white/60 font-medium tracking-tight">admin@hostelhub.edu</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent flex-shrink-0">
                                    <Phone size={20} />
                                </div>
                                <span className="text-white/60 font-medium">+91 1800-HOSTEL</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-sm font-bold text-white/30 tracking-widest uppercase">
                        &copy; {new Date().getFullYear()} HostelHub Infrastructure.
                    </p>
                    <div className="flex items-center gap-2 text-sm font-bold text-white/20 uppercase tracking-widest">
                        Crafted with <Heart size={14} className="text-danger animate-pulse" fill="currentColor" /> for Students
                    </div>
                    <div className="flex gap-8 text-xs font-black text-white/40 uppercase tracking-widest">
                        <a href="#" className="hover:text-white transition-colors">Status</a>
                        <a href="#" className="hover:text-white transition-colors">Uptime</a>
                        <a href="#" className="hover:text-white transition-colors">Legal</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
