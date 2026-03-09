/**
 * VendorsPick.jsx — Step 4 of the Plan Builder
 * User picks one photographer, one DJ, and one videographer.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mockVendors } from '../../api/mock/vendors.mock';
import { usePlanStore } from '../../store/plan.store';
import { Star, CheckCircle } from 'lucide-react';

const CATEGORIES = ['Photographer', 'DJ', 'Videographer'];
const CATEGORY_KEYS = { Photographer: 'photographer', DJ: 'dj', Videographer: 'videographer' };
const CATEGORY_ICONS = { Photographer: '📸', DJ: '🎵', Videographer: '🎬' };

export default function VendorsPick() {
    const { selectedVendors, setVendor } = usePlanStore();
    const navigate = useNavigate();
    const allPicked = Object.values(selectedVendors).every(Boolean);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-display font-bold text-text-dark">🎵 Choose Your Vendors</h2>
                    <p className="text-text-muted mt-1">Pick one from each category.</p>
                </div>
                {allPicked && (
                    <button onClick={() => navigate('/plan/build/summary')} className="bg-primary text-white px-6 py-2.5 rounded-full font-bold hover:bg-secondary transition-colors shadow-md flex items-center gap-2">
                        See Summary →
                    </button>
                )}
            </div>

            {CATEGORIES.map(category => (
                <div key={category} className="mb-10">
                    <h3 className="text-lg font-bold text-text-dark mb-4">
                        {CATEGORY_ICONS[category]} {category}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {mockVendors.filter(v => v.category === category).map((vendor, i) => {
                            const key = CATEGORY_KEYS[category];
                            const isSelected = selectedVendors[key]?.id === vendor.id;
                            return (
                                <motion.div
                                    key={vendor.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.07 }}
                                    onClick={() => setVendor(key, vendor)}
                                    className={`relative bg-white rounded-2xl overflow-hidden shadow-sm border-2 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 ${isSelected ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-100'}`}
                                >
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 z-10 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center">
                                            <CheckCircle className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                    <img src={vendor.image} alt={vendor.name} className="w-full h-36 object-cover" />
                                    <div className="p-3">
                                        <p className="font-bold text-text-dark text-sm mb-0.5">{vendor.name}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-blue-600 text-sm">{vendor.startingPrice?.toLocaleString()} EGP</span>
                                            <span className="flex items-center gap-0.5 text-xs text-gray-400"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{vendor.rating}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
