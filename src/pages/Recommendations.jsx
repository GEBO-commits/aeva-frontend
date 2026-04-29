import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { getVenues } from '../services/catalogService';
import VenueCard from '../components/venue/VenueCard';
import VenueFilter from '../components/venue/VenueFilter';
import { Sparkles, SlidersHorizontal, Loader2 } from 'lucide-react';
import { CardSkeleton } from '../components/ui/Skeleton';
import { usePlanStore } from '../store/plan.store';

export default function Recommendations() {
    const [filters, setFilters] = useState({
        type: 'all',
        maxPrice: '300000',
        guests: 'any'
    });
    const [sortBy, setSortBy] = useState('match');
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [venues, setVenues] = useState([]);
    const [visibleCount, setVisibleCount] = useState(6);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const navigate = useNavigate();
    const { setVenue } = usePlanStore();

    useEffect(() => {
        const fetchVenues = async () => {
            setIsLoading(true);
            const { data, error } = await getVenues();
            if (error) {
                console.error('[Recommendations] Failed to fetch venues:', error);
                setVenues([]);
            } else {
                // Map Supabase venues table to card shape
                const mapped = (data || []).map(v => ({
                    id: v.id,
                    name: v.name,
                    type: v.venue_type,
                    minGuests: v.capacity_min,
                    maxGuests: v.capacity_max,
                    startingPrice: v.price_min,
                    rating: v.rating,
                    image: Array.isArray(v.image_urls)
                        ? v.image_urls[0]
                        : (JSON.parse(v.image_urls || '[]')[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800'),
                    location: v.city,
                    amenities: Array.isArray(v.features)
                        ? v.features
                        : (JSON.parse(v.features || '[]') || []),
                    description: v.description
                }));
                setVenues(mapped);
            }
            setIsLoading(false);
        };
        fetchVenues();
    }, []);

    const handleLoadMore = () => {
        setIsLoadingMore(true);
        setTimeout(() => {
            setVisibleCount(prev => prev + 6);
            setIsLoadingMore(false);
        }, 1500);
    };

    const filteredVenues = useMemo(() => {
        let result = [...venues];

        if (filters.type !== 'all') {
            result = result.filter(v => v.type === filters.type);
        }

        result = result.filter(v => v.startingPrice <= parseInt(filters.maxPrice));

        if (filters.guests !== 'any') {
            const g = parseInt(filters.guests);
            result = result.filter(v => v.maxGuests >= g);
        }

        if (sortBy === 'price-low') {
            result.sort((a, b) => a.startingPrice - b.startingPrice);
        } else if (sortBy === 'price-high') {
            result.sort((a, b) => b.startingPrice - a.startingPrice);
        }

        return result;
    }, [venues, filters, sortBy]);

    const visibleVenues = filteredVenues.slice(0, visibleCount);

    return (
        <div className="w-full">
            {/* Page Header */}
            <div className="mb-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-4xl font-display font-bold text-text-dark flex items-center gap-3">
                            Perfect Venues for You <Sparkles className="text-primary w-8 h-8" />
                        </h1>
                        <p className="text-text-muted mt-2 text-lg">We've found {filteredVenues.length} amazing venues that match your style.</p>
                    </div>

                    {/* Build My Own Plan CTA Header */}
                    <Link
                        to="/plan/build"
                        className="flex flex-col items-end group"
                    >
                        <span className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1 group-hover:text-primary transition-colors text-right">Want to build your own plan?</span>
                        <div className="bg-white border-2 border-primary/20 px-6 py-3 rounded-2xl font-bold text-primary flex items-center gap-2 group-hover:border-primary group-hover:bg-primary/5 transition-all shadow-sm">
                            Click here to Start Planning →
                        </div>
                    </Link>
                </div>

                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <button
                        className="md:hidden flex-1 bg-white border border-gray-200 px-4 py-2 rounded-xl flex items-center justify-center gap-2 font-medium"
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                    >
                        <SlidersHorizontal className="w-4 h-4" /> Filters
                    </button>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="flex-1 md:w-48 bg-white border border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:border-primary text-text-dark text-sm font-medium"
                    >
                        <option value="match">Best Match</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Sidebar Filters */}
                <div className={`w-full md:w-64 shrink-0 transition-all ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
                    <VenueFilter filters={filters} setFilters={setFilters} />
                </div>

                {/* Venue Grid */}
                <div className="flex-1 w-full">
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
                        </div>
                    ) : filteredVenues.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {visibleVenues.map((venue, i) => (
                                    <VenueCard
                                        key={venue.id}
                                        venue={venue}
                                        index={i}
                                        onView={(v) => navigate(`/venues/${v.id}`)}
                                        onSelect={(v) => {
                                            setVenue(v);
                                            navigate('/plan/build/catering');
                                        }}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center flex flex-col items-center justify-center w-full min-h-[40vh]">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <SlidersHorizontal className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-text-dark mb-2">No venues found</h3>
                            <p className="text-text-muted mb-6">Try adjusting your filters to see more results.</p>
                            <button
                                onClick={() => {
                                    setFilters({ type: 'all', maxPrice: '300000', guests: 'any' });
                                    setVisibleCount(6);
                                }}
                                className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-full font-medium transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}

                    {!isLoading && filteredVenues.length > visibleCount && (
                        <div className="mt-12 text-center">
                            <button
                                onClick={handleLoadMore}
                                disabled={isLoadingMore}
                                className="border-2 border-gray-200 hover:border-primary hover:text-primary text-text-muted px-8 py-3 rounded-full font-bold transition-all shadow-sm flex items-center justify-center gap-2 mx-auto disabled:opacity-75 disabled:cursor-not-allowed"
                            >
                                {isLoadingMore ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Loading...</>
                                ) : (
                                    'Load More Venues'
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
