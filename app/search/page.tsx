"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import HostelBlockCard from '@/components/HostelBlockCard';
import { Filter, X, CheckCircle, Search, Building2 } from 'lucide-react';

function SearchContent() {
    const searchParams = useSearchParams();
    const locationQuery = searchParams.get('location')?.toLowerCase() || '';

    const [hostelBlocks, setHostelBlocks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    useEffect(() => {
        async function fetchHostelBlocks() {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (locationQuery) params.append('location', locationQuery);
                if (selectedTypes.length > 0) params.append('types', selectedTypes.join(','));
                if (selectedFacilities.length > 0) params.append('facilities', selectedFacilities.join(','));

                const res = await fetch(`/api/hostel-blocks?${params.toString()}`);
                if (!res.ok) {
                    console.error('Failed to fetch hostel blocks');
                    setHostelBlocks([]);
                    return;
                }
                const data = await res.json();
                setHostelBlocks(data);
            } catch (error) {
                console.error('Error fetching hostel blocks:', error);
                setHostelBlocks([]);
            } finally {
                setLoading(false);
            }
        }
        fetchHostelBlocks();
    }, [locationQuery, selectedTypes, selectedFacilities]);

    const handleTypeChange = (type: string) => {
        setSelectedTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    const handleFacilityChange = (facility: string) => {
        setSelectedFacilities(prev =>
            prev.includes(facility)
                ? prev.filter(f => f !== facility)
                : [...prev, facility]
        );
    };

    return (
        <div className="min-h-screen bg-background pt-32 pb-12 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="relative mb-12 p-12 bg-dark rounded-[4rem] overflow-hidden shadow-elevated">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-0" />
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 text-white/80 rounded-full font-black text-[10px] uppercase tracking-widest mb-4 border border-white/10 backdrop-blur-md">
                                <Search size={12} />
                                Infrastructure Search
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4">
                                Find Your <span className="text-primary">Sanctuary.</span>
                            </h1>
                            <p className="text-xl text-white/40 font-medium max-w-xl">
                                {loading ? 'Scanning server...' : `${hostelBlocks.length} Elite residences found matching your criteria.`}
                            </p>
                        </div>
                        <button
                            className="md:hidden flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-3xl font-black uppercase tracking-widest text-xs shadow-premium"
                            onClick={() => setShowMobileFilters(true)}
                        >
                            <Filter size={18} /> Modify Search
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    {/* Sidebar Filters */}
                    <aside className={`
                        fixed inset-0 z-[100] lg:z-10 lg:static lg:block
                        ${showMobileFilters ? 'block' : 'hidden'}
                    `}>
                        {/* Overlay for mobile */}
                        <div className="lg:hidden fixed inset-0 bg-dark/60 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />

                        <div className="relative h-full lg:h-auto w-[85%] max-w-sm lg:w-80 bg-white lg:bg-transparent p-8 lg:p-0 overflow-y-auto lg:overflow-visible">
                            <div className="lg:hidden flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                                <h2 className="text-2xl font-black text-dark">Filters</h2>
                                <button className="p-2 bg-light rounded-xl" onClick={() => setShowMobileFilters(false)}><X size={20} /></button>
                            </div>

                            <div className="bg-white lg:p-10 lg:rounded-[3.5rem] lg:shadow-card space-y-10 lg:sticky lg:top-32 border border-gray-50">
                                {/* Hostel Type */}
                                <div>
                                    <h3 className="text-[10px] font-black text-dark-light uppercase tracking-[0.2em] mb-6">Residency Type</h3>
                                    <div className="space-y-4">
                                        {['Boys', 'Girls', 'Co-ed'].map(type => (
                                            <label key={type} className="flex items-center gap-4 cursor-pointer group">
                                                <div className={`w-6 h-6 rounded-xl border-4 flex items-center justify-center transition-all ${selectedTypes.includes(type) ? 'bg-primary border-primary/20 scale-110 shadow-premium' : 'bg-light border-transparent group-hover:border-primary/10'}`}>
                                                    {selectedTypes.includes(type) && <div className="w-2 h-2 bg-white rounded-full" />}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={selectedTypes.includes(type)}
                                                    onChange={() => handleTypeChange(type)}
                                                />
                                                <span className={`text-sm font-black uppercase tracking-widest transition-colors ${selectedTypes.includes(type) ? 'text-primary' : 'text-dark-light group-hover:text-dark'}`}>
                                                    {type}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="h-px bg-gray-50" />

                                {/* Facilities */}
                                <div>
                                    <h3 className="text-[10px] font-black text-dark-light uppercase tracking-[0.2em] mb-6">Core Facilities</h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        {['WiFi', 'Gym', 'Library', 'Mess', 'Laundry', 'Sports'].map(facility => (
                                            <label key={facility} className="flex items-center gap-4 cursor-pointer group">
                                                <div className={`w-6 h-6 rounded-xl border-4 flex items-center justify-center transition-all ${selectedFacilities.includes(facility) ? 'bg-secondary border-secondary/20 scale-110 shadow-premium' : 'bg-light border-transparent group-hover:border-secondary/10'}`}>
                                                    {selectedFacilities.includes(facility) && <CheckCircle size={14} className="text-white" />}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={selectedFacilities.includes(facility)}
                                                    onChange={() => handleFacilityChange(facility)}
                                                />
                                                <span className={`text-sm font-black uppercase tracking-widest transition-colors ${selectedFacilities.includes(facility) ? 'text-secondary' : 'text-dark-light group-hover:text-dark'}`}>
                                                    {facility}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Clear Filters */}
                                {(selectedTypes.length > 0 || selectedFacilities.length > 0) && (
                                    <button
                                        onClick={() => {
                                            setSelectedTypes([]);
                                            setSelectedFacilities([]);
                                        }}
                                        className="w-full py-4 bg-light text-dark text-[10px] font-black uppercase tracking-[0.2em] rounded-[2rem] hover:bg-danger hover:text-white transition-all shadow-inner"
                                    >
                                        Reset Configuration
                                    </button>
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* Results Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="bg-white h-[500px] rounded-[3rem] animate-pulse shadow-sm border border-gray-50"></div>
                                ))}
                            </div>
                        ) : hostelBlocks.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                                {hostelBlocks.map((block) => (
                                    <HostelBlockCard key={block._id} block={block} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-[4rem] p-24 text-center shadow-card border border-gray-50">
                                <div className="w-24 h-24 bg-light rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
                                    <Building2 size={48} className="text-dark-light/40" />
                                </div>
                                <h3 className="text-3xl font-black text-dark mb-4 tracking-tight">Zero Results.</h3>
                                <p className="text-dark-light font-medium max-w-sm mx-auto mb-10 leading-relaxed">
                                    We couldn't find any residences matching your specific configuration. Try relaxing your filters.
                                </p>
                                <button
                                    onClick={() => {
                                        setSelectedTypes([]);
                                        setSelectedFacilities([]);
                                    }}
                                    className="px-10 py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-premium hover:shadow-elevated transition-all active:scale-95"
                                >
                                    Erase All Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <SearchContent />
        </Suspense>
    );
}
