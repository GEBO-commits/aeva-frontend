import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { getVenues } from '../services/catalogService';
import VenueCard from '../components/venue/VenueCard';
import VenueFilter from '../components/venue/VenueFilter';
import { Sparkles, SlidersHorizontal, Loader2 } from 'lucide-react';
import { CardSkeleton } from '../components/ui/Skeleton';
import { usePlanStore } from '../store/plan.store';
import { Button } from '../components/ui/Button';

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
        <div style={{ width: '100%' }}>
            {/* Page Header */}
            <div style={{ marginBottom: '40px' }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    marginBottom: '32px'
                }} className="md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'var(--aeva-ink)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            Perfect Venues for You <Sparkles style={{ color: 'var(--aeva-ink)' }} className="w-8 h-8" />
                        </h1>
                        <p style={{ color: 'var(--aeva-ink-soft)', marginTop: '8px', fontSize: '18px' }}>We've found {filteredVenues.length} amazing venues that match your style.</p>
                    </div>

                    {/* Build My Own Plan CTA Header */}
                    <Link
                        to="/plan/build"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            gap: '8px',
                            textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.querySelector('span').style.color = 'var(--aeva-ink)';
                            e.currentTarget.querySelector('div').style.borderColor = 'var(--aeva-ink)';
                            e.currentTarget.querySelector('div').style.backgroundColor = 'var(--aeva-paper-warm)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.querySelector('span').style.color = 'var(--aeva-ink-soft)';
                            e.currentTarget.querySelector('div').style.borderColor = 'var(--aeva-line)';
                            e.currentTarget.querySelector('div').style.backgroundColor = 'var(--aeva-canvas)';
                        }}
                    >
                        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--aeva-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right', transition: 'color 200ms' }}>Want to build your own plan?</span>
                        <div style={{
                            background: 'var(--aeva-canvas)',
                            border: '2px solid var(--aeva-line)',
                            padding: '12px 24px',
                            borderRadius: 'var(--r-xl)',
                            fontWeight: 700,
                            color: 'var(--aeva-ink)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 200ms',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            Click here to Start Planning →
                        </div>
                    </Link>
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid var(--aeva-line)',
                    paddingBottom: '16px'
                }}>
                    <button
                        style={{
                            flex: 1,
                            background: 'var(--aeva-canvas)',
                            border: '1px solid var(--aeva-line)',
                            padding: '8px 16px',
                            borderRadius: 'var(--r-lg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            color: 'var(--aeva-ink)'
                        }}
                        className="md:hidden"
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                    >
                        <SlidersHorizontal className="w-4 h-4" /> Filters
                    </button>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{
                            flex: 1,
                            maxWidth: '192px',
                            background: 'var(--aeva-canvas)',
                            border: '1px solid var(--aeva-line)',
                            padding: '8px 16px',
                            borderRadius: 'var(--r-lg)',
                            outline: 'none',
                            color: 'var(--aeva-ink)',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 200ms'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = 'var(--aeva-ink)'}
                        onBlur={(e) => e.currentTarget.style.borderColor = 'var(--aeva-line)'}
                    >
                        <option value="match">Best Match</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                    </select>
                </div>
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '32px',
                alignItems: 'flex-start'
            }} className="md:flex-row">
                {/* Sidebar Filters */}
                <div style={{
                    width: '100%',
                    display: showMobileFilters ? 'block' : 'none',
                    transition: 'all 200ms'
                }} className="md:block md:w-64 md:shrink-0">
                    <VenueFilter filters={filters} setFilters={setFilters} />
                </div>

                {/* Venue Grid */}
                <div style={{ flex: 1, width: '100%' }}>
                    {isLoading ? (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                            gap: '24px'
                        }}>
                            {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
                        </div>
                    ) : filteredVenues.length > 0 ? (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                            gap: '24px'
                        }}>
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
                        <div style={{
                            background: 'var(--aeva-canvas)',
                            padding: '48px',
                            borderRadius: 'var(--r-2xl)',
                            border: '1px solid var(--aeva-line)',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            minHeight: '40vh'
                        }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: 'var(--aeva-paper-warm)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '16px'
                            }}>
                                <SlidersHorizontal className="w-8 h-8" style={{ color: 'var(--aeva-ink-soft)' }} />
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--aeva-ink)', marginBottom: '8px' }}>No venues found</h3>
                            <p style={{ color: 'var(--aeva-ink-soft)', marginBottom: '24px' }}>Try adjusting your filters to see more results.</p>
                            <Button variant="primary" onClick={() => {
                                setFilters({ type: 'all', maxPrice: '300000', guests: 'any' });
                                setVisibleCount(6);
                            }}>
                                Clear Filters
                            </Button>
                        </div>
                    )}

                    {!isLoading && filteredVenues.length > visibleCount && (
                        <div style={{ marginTop: '48px', textAlign: 'center' }}>
                            <button
                                onClick={handleLoadMore}
                                disabled={isLoadingMore}
                                style={{
                                    border: '2px solid var(--aeva-line)',
                                    color: 'var(--aeva-ink)',
                                    padding: '12px 32px',
                                    borderRadius: 'var(--r-full)',
                                    fontWeight: 700,
                                    transition: 'all 200ms',
                                    boxShadow: 'var(--shadow-sm)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    margin: '0 auto',
                                    cursor: 'pointer',
                                    opacity: isLoadingMore ? 0.75 : 1,
                                    background: 'var(--aeva-canvas)'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isLoadingMore) {
                                        e.currentTarget.style.borderColor = 'var(--aeva-ink)';
                                        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--aeva-line)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                }}
                            >
                                {isLoadingMore ? (
                                    <><Loader2 className="w-5 h-5" style={{ animation: 'spin 1s linear infinite' }} /> Loading...</>
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
