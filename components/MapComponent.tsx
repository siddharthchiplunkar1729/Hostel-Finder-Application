"use client";

import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Star, Search, ArrowRight, Loader2, Info } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icon missing in Next.js
const createCustomIcon = (type: string) => {
    if (typeof window === 'undefined' || !L) return undefined;
    const color = type === 'Boys' ? '#2B6CB0' : type === 'Girls' ? '#38A169' : '#D69E2E';
    return L.divIcon({
        html: `
            <div style="
                width: 40px; 
                height: 40px; 
                background: white; 
                border: 4px solid ${color}; 
                border-radius: 50%; 
                display: flex; 
                items-center: center; 
                justify-content: center;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            ">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
            </div>
        `,
        className: 'custom-leaflet-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });
};

const center: [number, number] = [28.6139, 77.2090];

// Component to handle map center changes or other side effects
function MapController() {
    if (!useMap) return null;

    try {
        const map = useMap();
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            if (map) {
                map.flyTo(center, 13, { duration: 2 });
            }
        }, [map]);
    } catch (e) {
        // Handle case where useMap is called outside MapContainer
    }
    return null;
}

export default function MapComponent() {
    const [hostels, setHostels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchHostels();
    }, []);

    const fetchHostels = async () => {
        try {
            const res = await fetch('/api/hostel-blocks');
            if (res.ok) {
                const data = await res.json();
                setHostels(data);
            }
        } catch (error) {
            console.error('Error fetching hostels for map:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!mounted || loading) {
        return (
            <div className="w-full h-full bg-[#E5E7EB] dark:bg-card flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="relative w-full h-full overflow-hidden group rounded-[2.5rem] border-4 border-white dark:border-white/5 shadow-2xl">
            {/* Search Overlay */}
            <div className="absolute top-6 left-6 right-6 z-[400]">
                <div className="max-w-md mx-auto relative group">
                    <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                    <input
                        type="text"
                        placeholder="Search location or hostel name..."
                        className="w-full px-8 py-5 bg-white/90 dark:bg-card/90 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white dark:border-white/10 outline-none focus:ring-4 focus:ring-primary/20 transition-all font-medium text-dark dark:text-white relative z-10"
                    />
                    <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-dark-light dark:text-white/40 z-10" size={24} />
                </div>
            </div>

            <MapContainer
                center={center}
                zoom={13}
                scrollWheelZoom={true}
                className="w-full h-full z-0"
                zoomControl={false}
            >
                {/* Premium Dark Map Style using CartoDB */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                {/* Add a filter for dark mode using CSS on the container if needed */}
                <div className="hidden dark:block">
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />
                </div>

                <MapController />

                {hostels.map((hostel) => (
                    hostel.latitude && hostel.longitude && (
                        <Marker
                            key={hostel._id}
                            position={[parseFloat(hostel.latitude), parseFloat(hostel.longitude)]}
                            icon={createCustomIcon(hostel.type) as any}
                        >
                            <Popup className="custom-popup">
                                <div className="p-4 w-64">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`px-2 py-0.5 ${hostel.type === 'Boys' ? 'bg-primary/10 text-primary' : hostel.type === 'Girls' ? 'bg-secondary/10 text-secondary' : 'bg-accent/10 text-accent'} text-[8px] font-black uppercase tracking-widest rounded-full`}>
                                            {hostel.type}
                                        </span>
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            <Star size={12} fill="currentColor" />
                                            <span className="text-[10px] font-black">{hostel.rating || '4.5'}</span>
                                        </div>
                                    </div>
                                    <h4 className="text-lg font-black text-dark mb-1 leading-tight">{hostel.blockName}</h4>
                                    <p className="text-dark-light font-medium text-xs mb-3">{hostel.location}</p>
                                    <Link
                                        href={`/hostels/${hostel._id}`}
                                        className="flex items-center gap-2 font-black text-primary uppercase tracking-widest text-[10px] hover:gap-3 transition-all"
                                    >
                                        Inspect Block <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </Popup>
                        </Marker>
                    )
                ))}
            </MapContainer>

            {/* Custom UI Elements on Map */}
            <div className="absolute bottom-10 right-10 z-[400] flex flex-col gap-3">
                <button className="w-14 h-14 bg-white dark:bg-card rounded-2xl shadow-premium flex items-center justify-center text-primary border border-white dark:border-white/10 hover:scale-110 transition-transform active:scale-95">
                    <Navigation size={24} />
                </button>
                <div className="w-14 h-40 bg-white dark:bg-card rounded-2xl shadow-premium flex flex-col border border-white dark:border-white/10 overflow-hidden">
                    <button className="flex-1 flex items-center justify-center text-dark-light hover:bg-light dark:hover:bg-white/5 transition-colors font-black text-2xl">+</button>
                    <div className="h-[1px] bg-gray-100 dark:bg-white/10 mx-3" />
                    <button className="flex-1 flex items-center justify-center text-dark-light hover:bg-light dark:hover:bg-white/5 transition-colors font-black text-2xl">−</button>
                </div>
            </div>

            <style jsx global>{`
                .leaflet-container {
                    background: #f8fafc;
                }
                .dark .leaflet-container {
                    background: #020617;
                }
                .leaflet-popup-content-wrapper {
                    border-radius: 1.5rem !important;
                    padding: 0 !important;
                    overflow: hidden !important;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
                }
                .leaflet-popup-content {
                    margin: 0 !important;
                }
                .leaflet-popup-tip {
                    background: white !important;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1) !important;
                }
                .dark .leaflet-layer,
                .dark .leaflet-control-zoom-in,
                .dark .leaflet-control-zoom-out,
                .dark .leaflet-control-attribution {
                    filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
                }
            `}</style>
        </div>
    );
}
