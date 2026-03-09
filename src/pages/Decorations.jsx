/**
 * Decorations.jsx
 *
 * Public browse page for decoration packages.
 * Data fields match what's in decorations.mock.js:
 *   theme, includes, totalPrice, rating, image, name, description
 *
 * "Select Package →" saves to plan store and navigates to /plan/build/vendors.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { mockDecorations } from '../api/mock/decorations.mock';
import { usePlanStore } from '../store/plan.store';
import { Palette, Star, CheckCircle } from 'lucide-react';
import { CardSkeleton } from '../components/ui/Skeleton';

console.log('✅ Decorations page loaded');

export default function Decorations() {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { setDecorations, selectedDecorations } = usePlanStore();

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 600);
        return () => clearTimeout(timer);
    }, []);

    /** Handle selecting a decoration package and moving to the next plan step */
    const handleSelect = (decor) => {
        setDecorations(decor);
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    [1, 2, 3].map(i => <CardSkeleton key={i} />)
                ) : (
                    <AnimatePresence>
                        {mockDecorations.map((decor, index) => (
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
                )}
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
