/**
 * SelectVendors.jsx — Step 4 of the Manual Plan Builder
 *
 * Three sections: Photographers, DJs, Videographers.
 * User selects one from each section.
 * "Continue to Summary →" appears when at least one vendor is selected.
 * On continue: navigates to /plan/build/summary
 */

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getVendors } from '../../services/catalogService';
import { usePlanStore } from '../../store/plan.store';
import { PlanBuilderContext } from '../../contexts/PlanBuilderContext';
import { saveEventSelection } from '../../services/planningService';
import { PlanProgressBar } from '../../components/plan/PlanProgressBar';
import { Star, CheckCircle, ArrowRight } from 'lucide-react';

const CATEGORIES = [
    { key: 'photographer', label: 'Photographers', icon: '📸', color: 'blue' },
    { key: 'dj', label: 'DJs', icon: '🎵', color: 'violet' },
    { key: 'videographer', label: 'Videographers', icon: '🎬', color: 'indigo' },
];

const CATEGORY_MAP = { Photographer: 'photographer', DJ: 'dj', Videographer: 'videographer' };

/** Category-specific color classes */
const COLOR = {
    blue: { ring: 'border-blue-400 ring-blue-100', bg: 'bg-blue-50', badge: 'bg-blue-500', btn: 'bg-blue-50 hover:bg-blue-500 text-blue-600 border-blue-200', sel: 'bg-blue-500 text-white' },
    violet: { ring: 'border-violet-400 ring-violet-100', bg: 'bg-violet-50', badge: 'bg-violet-500', btn: 'bg-violet-50 hover:bg-violet-500 text-violet-600 border-violet-200', sel: 'bg-violet-500 text-white' },
    indigo: { ring: 'border-indigo-400 ring-indigo-100', bg: 'bg-indigo-50', badge: 'bg-indigo-500', btn: 'bg-indigo-50 hover:bg-indigo-500 text-indigo-600 border-indigo-200', sel: 'bg-indigo-500 text-white' },
};

export default function SelectVendors() {
    const navigate = useNavigate();
    const { setVendor, selectedVendors, skipStep } = usePlanStore();
    const { eventId } = useContext(PlanBuilderContext);
    const [vendorsData, setVendorsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const anySelected = Object.values(selectedVendors).some(Boolean);

    useEffect(() => {
        const fetchVendors = async () => {
            setIsLoading(true);
            const { data, error } = await getVendors();
            if (error) {
                console.error('[SelectVendors] Failed to fetch vendors:', error);
                setVendorsData([]);
            } else {
                // Map Supabase vendors to card shape
                const mapped = (data || []).map(v => {
                    let details = {};
                    if (v.details) {
                        details = typeof v.details === 'string' ? JSON.parse(v.details) : v.details;
                    }
                    return {
                        id: v.id,
                        name: v.name,
                        category: v.category,
                        rating: v.rating,
                        image: Array.isArray(v.image_urls)
                            ? v.image_urls[0]
                            : (JSON.parse(v.image_urls || '[]')[0] || 'https://images.unsplash.com/photo-1514306688007-f2e490fb4e90?w=800'),
                        startingPrice: v.price_min
                    };
                });
                setVendorsData(mapped);
            }
            setIsLoading(false);
        };
        fetchVendors();
    }, []);

    const handleVendorSelect = async (vendorType, isSelected, vendor) => {
        setVendor(vendorType, isSelected ? null : vendor);

        // Save to Supabase if selecting (not deselecting)
        if (!isSelected && vendor && eventId) {
            const { error } = await saveEventSelection(eventId, vendorType, vendor.id);
            if (error) {
                console.error('[SelectVendors] Failed to save vendor selection:', error);
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <PlanProgressBar currentStep={3} />

            <div className="mt-8 mb-6 flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-text-dark">🎵 Choose Vendors</h1>
                    <p className="text-text-muted mt-1">Select one from each category — or skip categories you don't need.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-text-muted hover:text-text-dark px-4 py-2 font-medium text-sm transition-colors border border-gray-200 rounded-full hover:bg-gray-50 bg-white"
                    >
                        ← Back
                    </button>
                    <button
                        onClick={() => navigate('/plan/build/summary')}
                        className="text-text-muted hover:text-text-dark px-4 py-2 font-medium text-sm transition-colors border border-gray-200 rounded-full hover:bg-gray-50 bg-white"
                    >
                        Skip this step
                    </button>
                    {anySelected && (
                        <button
                            onClick={() => navigate('/plan/build/summary')}
                            className="bg-primary text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-secondary transition-all shadow-lg"
                        >
                            Continue to Summary <ArrowRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div>Loading vendors...</div>
            ) : CATEGORIES.map(cat => {
                const vendors = vendorsData.filter(v => CATEGORY_MAP[v.category] === cat.key);
                const c = COLOR[cat.color];
                return (
                    <div key={cat.key} className="mb-10">
                        <h2 className="text-xl font-bold text-text-dark mb-4">{cat.icon} {cat.label}</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {vendors.map((vendor, i) => {
                                const isSelected = selectedVendors[cat.key]?.id === vendor.id;
                                return (
                                    <motion.div
                                        key={vendor.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.07 }}
                                        onClick={() => handleVendorSelect(cat.key, isSelected, vendor)}
                                        className={`bg-white rounded-2xl overflow-hidden shadow-sm border-2 transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer ${isSelected ? `${c.ring} ${c.bg} ring-2` : 'border-gray-100'
                                            }`}
                                    >
                                        <div className="relative">
                                            <img src={vendor.image} alt={vendor.name} className="w-full h-40 object-cover" />
                                            {isSelected && (
                                                <div className={`absolute top-2 right-2 w-7 h-7 ${c.badge} rounded-full flex items-center justify-center`}>
                                                    <CheckCircle className="w-4 h-4 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="font-bold text-text-dark text-sm">{vendor.name}</p>
                                                <span className="flex items-center gap-0.5 text-xs text-gray-400">
                                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{vendor.rating}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center mb-3">
                                                <span className={`font-bold text-sm ${cat.color === 'blue' ? 'text-blue-600' : cat.color === 'violet' ? 'text-violet-600' : 'text-indigo-600'}`}>
                                                    {vendor.startingPrice.toLocaleString()} EGP
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); navigate(`/vendors/${vendor.id}`); }}
                                                    className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-text-dark text-xs font-bold rounded-xl transition-colors border border-gray-200"
                                                >
                                                    View Details
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleVendorSelect(cat.key, isSelected, vendor); }}
                                                    className={`w-full py-2 rounded-xl text-sm font-bold transition-all border ${isSelected ? c.sel : c.btn
                                                        } hover:text-white`}
                                                >
                                                    {isSelected ? '✓ Selected' : `Add ${cat.label.slice(0, -1)} →`}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}


            {anySelected && (
                <div className="flex justify-end mt-4 pb-8">
                    <button
                        onClick={() => navigate('/plan/build/summary')}
                        className="bg-primary text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-secondary shadow-lg transition-all text-lg"
                    >
                        Continue to Summary <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
}
