import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { getVendors } from '../services/catalogService';
import CateringFilter from '../components/catering/CateringFilter';
import { Utensils, Star, Check, SlidersHorizontal } from 'lucide-react';
import { CardSkeleton } from '../components/ui/Skeleton';

export default function Catering() {
    const [isLoading, setIsLoading] = useState(true);
    const [catering, setCatering] = useState([]);
    const [filters, setFilters] = useState({ maxPrice: '5000', rating: 'all' });
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCatering = async () => {
            setIsLoading(true);
            const { data, error } = await getVendors('catering');
            if (error) {
                console.error('[Catering] Failed to fetch catering vendors:', error);
                setCatering([]);
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
                            : (JSON.parse(v.image_urls || '[]')[0] || 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800'),
                        startingPrice: v.price_min,
                        pricePerPerson: v.price_min,
                        dietaryOptions: details.options || [],
                        menuHighlights: details.specialties || [],
                        type: 'Catering'
                    };
                });
                setCatering(mapped);
            }
            setIsLoading(false);
        };
        fetchCatering();
    }, []);

    const filteredCatering = useMemo(() => {
        let result = [...catering];

        result = result.filter(c => c.startingPrice <= parseInt(filters.maxPrice));

        if (filters.rating !== 'all') {
            const minRating = parseFloat(filters.rating);
            result = result.filter(c => c.rating >= minRating);
        }

        return result;
    }, [catering, filters]);

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-text-dark flex items-center gap-2">
                    Catering Services <Utensils className="text-accent w-6 h-6" />
                </h1>
                <p className="text-text-muted mt-1">Discover top-rated caterers for your perfect menu.</p>

                <button
                    className="md:hidden mt-4 bg-white border border-gray-200 px-4 py-2 rounded-xl flex items-center justify-center gap-2 font-medium text-sm"
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                >
                    <SlidersHorizontal className="w-4 h-4" /> Filters
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className={`w-full md:w-64 shrink-0 transition-all ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
                    <CateringFilter filters={filters} setFilters={setFilters} />
                </div>

                <div className="flex-1 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <>
                        {[1, 2, 3].map(i => <CardSkeleton key={i} />)}
                    </>
                ) : filteredCatering.length > 0 ? (
                    <AnimatePresence>
                        {filteredCatering.map((caterer, index) => (
                            <CateringCard key={caterer.id} data={caterer} index={index} onView={() => navigate(`/catering/${caterer.id}`)} />
                        ))}
                    </AnimatePresence>
                ) : (
                    <div className="col-span-full bg-white p-12 rounded-3xl border border-gray-100 text-center flex flex-col items-center justify-center w-full min-h-[40vh]">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <SlidersHorizontal className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-text-dark mb-2">No catering options found</h3>
                        <p className="text-text-muted mb-6">Try adjusting your filters to see more results.</p>
                        <button
                            onClick={() => setFilters({ maxPrice: '5000', rating: 'all' })}
                            className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-full font-medium transition-colors text-sm"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
                </div>
                </div>
            </div>
        </div>
    );
}

function CateringCard({ data, index, onView }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col h-full"
        >
            <div className="relative h-56 overflow-hidden">
                <img src={data.image} alt={data.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-bold shadow-sm flex items-center gap-1">
                    <Star className="w-4 h-4 text-accent fill-current" /> {data.rating}
                </div>
                <div className="absolute bottom-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                    {data.type}
                </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold font-display text-text-dark">{data.name}</h3>
                </div>
                <p className="text-text-muted text-sm mb-4 line-clamp-2">{data.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                    {data.dietaryOptions.map(opt => (
                        <span key={opt} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-md border border-gray-100 flex items-center gap-1">
                            <Check className="w-3 h-3 text-secondary" /> {opt}
                        </span>
                    ))}
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div>
                        <span className="text-xs text-text-muted block">Starting at</span>
                        <span className="font-bold text-primary text-lg">{data.startingPrice} EGP / guest</span>
                    </div>
                    <button
                        onClick={onView}
                        className="bg-gray-50 hover:bg-primary hover:text-white text-primary px-4 py-2 rounded-xl font-bold transition-colors text-sm"
                    >
                        View Menu
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
