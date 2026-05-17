import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { getVendors } from '../services/catalogService';
import VendorsFilter from '../components/vendors/VendorsFilter';
import { Camera, Star, Zap, SlidersHorizontal } from 'lucide-react';
import { CardSkeleton } from '../components/ui/Skeleton';

export default function Vendors() {
    const [isLoading, setIsLoading] = useState(true);
    const [vendors, setVendors] = useState([]);
    const [filters, setFilters] = useState({ category: 'all', maxPrice: '50000', rating: 'all' });
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVendors = async () => {
            setIsLoading(true);
            const { data, error } = await getVendors();
            if (error) {
                console.error('[Vendors] Failed to fetch vendors:', error);
                setVendors([]);
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
                        category: v.category,
                        description: v.description,
                        rating: v.rating,
                        image: Array.isArray(v.image_urls)
                            ? v.image_urls[0]
                            : (JSON.parse(v.image_urls || '[]')[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800'),
                        startingPrice: v.price_min,
                        features: details.services || details.specialties || details.packages || []
                    };
                });
                setVendors(mapped);
            }
            setIsLoading(false);
        };
        fetchVendors();
    }, []);

    const filteredVendors = useMemo(() => {
        let result = [...vendors];

        if (filters.category !== 'all') {
            result = result.filter(v => v.category === filters.category);
        }

        result = result.filter(v => v.startingPrice <= parseInt(filters.maxPrice));

        if (filters.rating !== 'all') {
            const minRating = parseFloat(filters.rating);
            result = result.filter(v => v.rating >= minRating);
        }

        return result;
    }, [vendors, filters]);

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-text-dark flex items-center gap-2">
                    Photography & Entertainment <Camera className="text-primary w-6 h-6" />
                </h1>
                <p className="text-text-muted mt-1">Book top photographers, DJs, and makeup artists.</p>

                <button
                    className="md:hidden mt-4 bg-white border border-gray-200 px-4 py-2 rounded-xl flex items-center justify-center gap-2 font-medium text-sm"
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                >
                    <SlidersHorizontal className="w-4 h-4" /> Filters
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className={`w-full md:w-64 shrink-0 transition-all ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
                    <VendorsFilter filters={filters} setFilters={setFilters} />
                </div>

                <div className="flex-1 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <>
                        {[1, 2, 3].map(i => <CardSkeleton key={i} />)}
                    </>
                ) : filteredVendors.length > 0 ? (
                    <AnimatePresence>
                        {filteredVendors.map((vendor, index) => (
                            <VendorCard key={vendor.id} data={vendor} index={index} onView={() => navigate(`/vendors/${vendor.id}`)} />
                        ))}
                    </AnimatePresence>
                ) : (
                    <div className="col-span-full bg-white p-12 rounded-3xl border border-gray-100 text-center flex flex-col items-center justify-center w-full min-h-[40vh]">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Camera className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-text-dark mb-2">No vendors found</h3>
                        <p className="text-text-muted mb-6">Try adjusting your filters to see more results.</p>
                        <button
                            onClick={() => setFilters({ category: 'all', maxPrice: '50000', rating: 'all' })}
                            className="bg-gray-900 hover:bg-primary text-white px-6 py-2 rounded-full font-medium transition-colors text-sm"
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

function VendorCard({ data, index, onView }) {
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
                <div className="absolute bottom-4 left-4 bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                    {data.category}
                </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold font-display text-text-dark">{data.name}</h3>
                </div>
                <p className="text-text-muted text-sm mb-4 line-clamp-2">{data.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                    {data.features.map(feat => (
                        <span key={feat} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md border border-primary/20 flex items-center gap-1">
                            <Zap className="w-3 h-3 text-primary" /> {feat}
                        </span>
                    ))}
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div>
                        <span className="text-xs text-text-muted block">Starting at</span>
                        <span className="font-bold text-gray-900 text-lg">{data.startingPrice.toLocaleString()} EGP</span>
                    </div>
                    <button
                        onClick={onView}
                        className="bg-gray-900 hover:bg-primary hover:text-white text-white px-4 py-2 rounded-xl font-bold transition-colors text-sm shadow-md"
                    >
                        View Details
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
