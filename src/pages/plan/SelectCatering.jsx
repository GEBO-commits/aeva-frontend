/**
 * SelectCatering.jsx — Step 2 of the Manual Plan Builder
 *
 * Shown after a venue is selected. User picks a catering service.
 * On selection: saves to plan store → navigates to /plan/build/decorations
 */

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getVendors } from '../../services/catalogService';
import { usePlanStore } from '../../store/plan.store';
import { PlanBuilderContext } from '../../contexts/PlanBuilderContext';
import { saveEventSelection } from '../../services/planningService';
import { PlanProgressBar } from '../../components/plan/PlanProgressBar';
import { Star, CheckCircle } from 'lucide-react';

export default function SelectCatering() {
    const navigate = useNavigate();
    const { setCatering, selectedCatering, skipStep } = usePlanStore();
    const { eventId } = useContext(PlanBuilderContext);
    const [catering, setCateringData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCatering = async () => {
            setIsLoading(true);
            const { data, error } = await getVendors('catering');
            if (error) {
                console.error('[SelectCatering] Failed to fetch catering vendors:', error);
                setCateringData([]);
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
                        description: v.description,
                        rating: v.rating,
                        image: Array.isArray(v.image_urls)
                            ? v.image_urls[0]
                            : (JSON.parse(v.image_urls || '[]')[0] || 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800'),
                        style: 'Buffet',
                        pricePerPerson: v.price_min,
                        dietaryOptions: details.options || [],
                        menuHighlights: details.specialties || [],
                        type: 'Catering'
                    };
                });
                setCateringData(mapped);
            }
            setIsLoading(false);
        };
        fetchCatering();
    }, []);

    const handleSelect = async (c) => {
        const isSelected = selectedCatering?.id === c.id;
        setCatering(isSelected ? null : c);

        // Save to Supabase if selecting (not deselecting)
        if (!isSelected && c && eventId) {
            const { error } = await saveEventSelection(eventId, 'catering', c.id);
            if (error) {
                console.error('[SelectCatering] Failed to save catering selection:', error);
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <PlanProgressBar currentStep={1} />

            <div className="flex items-center justify-between mt-8 mb-6">
                <div>
                    <h1 className="text-3xl font-display font-bold text-text-dark">🍽️ Choose Catering</h1>
                    <p className="text-text-muted mt-1">Pick the perfect menu style for your guests.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/plan/build/venue')}
                        className="text-text-muted hover:text-text-dark px-4 py-2 font-medium text-sm transition-colors border border-gray-200 rounded-full hover:bg-gray-50 bg-white"
                    >
                        ← Back
                    </button>
                    <button
                        onClick={() => { skipStep(1); navigate('/plan/build/decorations'); }}
                        className="text-text-muted hover:text-text-dark px-4 py-2 font-medium text-sm transition-colors border border-gray-200 rounded-full hover:bg-gray-50 bg-white"
                    >
                        Skip this step
                    </button>
                    {selectedCatering && (
                        <button
                            onClick={() => navigate('/plan/build/decorations')}
                            className="bg-orange-400 text-white px-6 py-2.5 rounded-full font-bold hover:bg-orange-500 transition-colors shadow-md flex items-center gap-2"
                        >
                            Next Step: Decorations →
                        </button>
                    )}
                </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div>Loading catering options...</div>
                ) : catering.length > 0 ? (
                    catering.map((c, i) => {
                    const isSelected = selectedCatering?.id === c.id;
                    return (
                        <motion.div
                            key={c.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            onClick={() => handleSelect(c)}
                            className={`bg-white rounded-2xl overflow-hidden shadow-sm border-2 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer ${isSelected ? 'border-orange-400 ring-2 ring-orange-100 bg-orange-50' : 'border-gray-100'
                                }`}
                        >
                            <div className="relative">
                                <img src={c.image} alt={c.name} className="w-full h-48 object-cover" />
                                {isSelected && (
                                    <div className="absolute top-3 right-3 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-5 h-5 text-white" />
                                    </div>
                                )}
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold">
                                    {c.style}
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-text-dark">{c.name}</h3>
                                    <span className="flex items-center gap-1 text-xs text-gray-500">
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{c.rating}
                                    </span>
                                </div>
                                <p className="text-xs text-text-muted mb-3 line-clamp-2">{c.description}</p>
                                <div className="flex justify-between items-center pt-2 border-t border-gray-100 mb-3">
                                    <span className="font-bold text-orange-500">{c.pricePerPerson} EGP/person</span>
                                    <span className="text-xs text-gray-400">~{(c.pricePerPerson * 100).toLocaleString()} for 100 guests</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); navigate(`/catering/${c.id}`); }}
                                        className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-text-dark text-xs font-bold rounded-xl transition-colors border border-gray-200"
                                    >
                                        View Details
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleSelect(c); }}
                                        className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${isSelected
                                            ? 'bg-orange-400 text-white'
                                            : 'bg-orange-50 hover:bg-orange-400 hover:text-white text-orange-600 border border-orange-200'
                                            }`}
                                    >
                                        {isSelected ? '✓ Selected' : 'Select Catering →'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    );
                    })
                ) : (
                    <div className="col-span-full text-center text-text-muted">No catering options available</div>
                )}
            </div>
        </div>
    );
}
