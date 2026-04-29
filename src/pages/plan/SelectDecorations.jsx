/**
 * SelectDecorations.jsx — Step 3 of the Manual Plan Builder
 *
 * On selection: saves to plan store → navigates to /plan/build/vendors
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

export default function SelectDecorations() {
    const navigate = useNavigate();
    const { setDecorations, selectedDecorations, skipStep } = usePlanStore();
    const { eventId } = useContext(PlanBuilderContext);
    const [decorations, setDecorationsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const fetchDecorations = async () => {
            setIsLoading(true);
            const { data, error } = await getVendors('decorations');
            if (!cancelled) {
                if (error) {
                    console.error('[SelectDecorations] Failed to fetch decoration vendors:', error);
                    setDecorationsData([]);
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
                                : (JSON.parse(v.image_urls || '[]')[0] || 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800'),
                            totalPrice: v.price_max || v.price_min,
                            theme: (details.styles && details.styles[0]) || 'Custom',
                            includes: details.services || []
                        };
                    });
                    setDecorationsData(mapped);
                }
                setIsLoading(false);
            }
        };
        fetchDecorations();
        return () => { cancelled = true; };
    }, []);

    const handleSelect = async (d) => {
        const isSelected = selectedDecorations?.id === d.id;
        setDecorations(isSelected ? null : d);

        // Save to Supabase if selecting (not deselecting)
        if (!isSelected && d && eventId) {
            const { error } = await saveEventSelection(eventId, 'decorations', d.id);
            if (error) {
                console.error('[SelectDecorations] Failed to save decorations selection:', error);
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <PlanProgressBar currentStep={2} />

            <div className="flex items-center justify-between mt-8 mb-6">
                <div>
                    <h1 className="text-3xl font-display font-bold text-text-dark">🌸 Choose Decorations</h1>
                    <p className="text-text-muted mt-1">Set the perfect atmosphere for your event.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/plan/build/catering')}
                        className="text-text-muted hover:text-text-dark px-4 py-2 font-medium text-sm transition-colors border border-gray-200 rounded-full hover:bg-gray-50 bg-white"
                    >
                        ← Back
                    </button>
                    <button
                        onClick={() => { skipStep(2); navigate('/plan/build/vendors'); }}
                        className="text-text-muted hover:text-text-dark px-4 py-2 font-medium text-sm transition-colors border border-gray-200 rounded-full hover:bg-gray-50 bg-white"
                    >
                        Skip this step
                    </button>
                    {selectedDecorations && (
                        <button
                            onClick={() => navigate('/plan/build/vendors')}
                            className="bg-pink-500 text-white px-6 py-2.5 rounded-full font-bold hover:bg-pink-600 transition-colors shadow-md flex items-center gap-2"
                        >
                            Next Step: Vendors →
                        </button>
                    )}
                </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div>Loading decoration packages...</div>
                ) : decorations.length > 0 ? (
                    decorations.map((d, i) => {
                    const isSelected = selectedDecorations?.id === d.id;
                    return (
                        <motion.div
                            key={d.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            onClick={() => handleSelect(d)}
                            className={`bg-white rounded-2xl overflow-hidden shadow-sm border-2 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer ${isSelected ? 'border-pink-400 ring-2 ring-pink-100 bg-pink-50' : 'border-gray-100'
                                }`}
                        >
                            <div className="relative">
                                <img src={d.image} alt={d.name} className="w-full h-48 object-cover" />
                                {isSelected && (
                                    <div className="absolute top-3 right-3 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-5 h-5 text-white" />
                                    </div>
                                )}
                                <div className="absolute top-3 left-3 bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                    {d.theme}
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-text-dark">{d.name}</h3>
                                    <span className="flex items-center gap-1 text-xs text-gray-500">
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{d.rating}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-1 my-2">
                                    {d.includes.slice(0, 3).map(item => (
                                        <span key={item} className="text-[10px] bg-pink-50 text-pink-600 px-2 py-0.5 rounded-full">{item}</span>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-gray-100 mb-3">
                                    <span className="font-bold text-pink-500">{d.totalPrice.toLocaleString()} EGP</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); navigate(`/decorations/${d.id}`); }}
                                        className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-text-dark text-xs font-bold rounded-xl transition-colors border border-gray-200"
                                    >
                                        View Details
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleSelect(d); }}
                                        className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${isSelected
                                            ? 'bg-pink-500 text-white'
                                            : 'bg-pink-50 hover:bg-pink-500 hover:text-white text-pink-600 border border-pink-200'
                                            }`}
                                    >
                                        {isSelected ? '✓ Selected' : 'Select Package →'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    );
                    })
                ) : (
                    <div className="col-span-full text-center text-text-muted">No decoration packages available</div>
                )}
            </div>
        </div>
    );
}
