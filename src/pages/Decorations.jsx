/**
 * Decorations.jsx
 *
 * Public browse page for decoration packages.
 * Data fields match what's in decorations.mock.js:
 *   theme, includes, totalPrice, rating, image, name, description
 *
 * "Select Package →" saves to plan store and navigates to /plan/build/vendors.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getVendors } from '../services/catalogService';
import { usePlanStore } from '../store/plan.store';
import DecorationsFilter from '../components/decorations/DecorationsFilter';
import { Palette, Star, CheckCircle, SlidersHorizontal } from 'lucide-react';
import { CardSkeleton } from '../components/ui/Skeleton';

console.log('✅ Decorations page loaded');

export default function Decorations() {
    const [isLoading, setIsLoading] = useState(true);
    const [decorations, setDecorations] = useState([]);
    const [filters, setFilters] = useState({ maxPrice: '100000', rating: 'all' });
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const navigate = useNavigate();
    const { setDecorations: setPlanDecorations, selectedDecorations } = usePlanStore();

    useEffect(() => {
        const fetchDecorations = async () => {
            setIsLoading(true);
            const { data, error } = await getVendors('decorations');
            if (error) {
                console.error('[Decorations] Failed to fetch decoration vendors:', error);
                setDecorations([]);
            } else {
                // Map Supabase vendors table to card shape
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
                setDecorations(mapped);
            }
            setIsLoading(false);
        };
        fetchDecorations();
    }, []);

    const filteredDecorations = useMemo(() => {
        let result = [...decorations];

        result = result.filter(d => d.totalPrice <= parseInt(filters.maxPrice));

        if (filters.rating !== 'all') {
            const minRating = parseFloat(filters.rating);
            result = result.filter(d => d.rating >= minRating);
        }

        return result;
    }, [decorations, filters]);

    /** Handle selecting a decoration package and moving to the next plan step */
    const handleSelect = (decor) => {
        setPlanDecorations(decor);
        navigate('/plan/build/vendors');
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-text-dark flex items-center gap-2">
                    Decorations &amp; Styling <Palette className="text-pink-500 w-6 h-6" />
                </h1>
                <p className="text-text-muted mt-1">Bring your vision to life with expert decoration packages.</p>

                <button
                    className="md:hidden mt-4 bg-white border border-gray-200 px-4 py-2 rounded-xl flex items-center justify-center gap-2 font-medium text-sm"
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                >
                    <SlidersHorizontal className="w-4 h-4" /> Filters
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className={`w-full md:w-64 shrink-0 transition-all ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
                    <DecorationsFilter filters={filters} setFilters={setFilters} />
                </div>

                <div className="flex-1 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    [1, 2, 3].map(i => <CardSkeleton key={i} />)
                ) : filteredDecorations.length > 0 ? (
                    <AnimatePresence>
                        {filteredDecorations.map((decor, index) => (
                            <DecorCard
                                key={decor.id}
                                data={decor}
                                index={index}
                                isSelected={selectedDecorations?.id === decor.id}
                                onSelect={() => handleSelect(decor)}
                                onView={() => navigate(`/decorations/${decor.id}`)}
                            />
                        ))}
                    </AnimatePresence>
                ) : (
                    <div className="col-span-full bg-white p-12 rounded-3xl border border-gray-100 text-center flex flex-col items-center justify-center w-full min-h-[40vh]">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <SlidersHorizontal className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-text-dark mb-2">No decoration packages found</h3>
                        <p className="text-text-muted mb-6">Try adjusting your filters to see more results.</p>
                        <button
                            onClick={() => setFilters({ maxPrice: '100000', rating: 'all' })}
                            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full font-medium transition-colors text-sm"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
                </div>
                </div>
            </div>
            </div>
        </div>
    );
}

/**
 * Individual decoration package card.
 * Uses correct field names from decorations.mock.js: theme, includes, totalPrice
 */
function DecorCard({ data, index, isSelected, onSelect, onView }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
            className={`bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-2 group flex flex-col h-full ${isSelected ? 'border-pink-500 ring-2 ring-pink-100' : 'border-gray-100'
                }`}
        >
            <div className="relative h-56 overflow-hidden">
                <img
                    src={data.image}
                    alt={data.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Rating badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-bold shadow-sm flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" /> {data.rating}
                </div>
                {/* Theme badge */}
                <div className="absolute top-4 left-4 bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                    {data.theme}
                </div>
                {/* Selected overlay */}
                {isSelected && (
                    <div className="absolute inset-0 bg-pink-500/20 flex items-center justify-center">
                        <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center shadow-xl">
                            <CheckCircle className="w-7 h-7 text-white" />
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold font-display text-text-dark mb-1">{data.name}</h3>
                <p className="text-text-muted text-sm mb-4 line-clamp-2">{data.description}</p>

                {/* Package includes tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                    {data.includes.map(item => (
                        <span key={item} className="text-xs bg-pink-50 text-pink-600 px-2 py-1 rounded-full border border-pink-100">
                            {item}
                        </span>
                    ))}
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-2">
                    <button
                        onClick={onView}
                        className="w-full py-2 rounded-xl text-xs font-bold text-text-muted hover:text-primary transition-colors border border-gray-100 hover:border-primary/20"
                    >
                        View Details
                    </button>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-text-muted uppercase font-bold tracking-wider">Packages from</span>
                        <span className="font-bold text-pink-500 text-lg">{data.totalPrice.toLocaleString()} EGP</span>
                    </div>
                    {/* Select button */}
                    <button
                        onClick={onSelect}
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
}
