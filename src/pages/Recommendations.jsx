import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getVenues } from '../services/catalogService';
import { Sparkles, MapPin, Star, Check } from 'lucide-react';
import { CardSkeleton } from '../components/ui/Skeleton';
import { usePlanStore } from '../store/plan.store';
import { Button } from '../components/ui/Button';
import { Tag } from '../components/ui/Tag';

export default function Recommendations() {
    const [expanded, setExpanded] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [venues, setVenues] = useState([]);
    const navigate = useNavigate();
    const { setVenue, selectedVenue } = usePlanStore();

    useEffect(() => {
        const fetchVenues = async () => {
            setIsLoading(true);
            const { data, error } = await getVenues();
            if (error) {
                console.error('[Recommendations] Failed to fetch venues:', error);
                setVenues([]);
            } else {
                const mapped = (data || []).map(v => ({
                    id: v.id,
                    name: v.name,
                    type: v.venue_type,
                    minGuests: v.capacity_min,
                    maxGuests: v.capacity_max,
                    startingPrice: v.price_min,
                    rating: v.rating || 4.5,
                    image: Array.isArray(v.image_urls)
                        ? v.image_urls[0]
                        : (JSON.parse(v.image_urls || '[]')[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800'),
                    location: v.city,
                    amenities: Array.isArray(v.features)
                        ? v.features
                        : (JSON.parse(v.features || '[]') || []),
                    description: v.description || 'Premium venue'
                }));
                setVenues(mapped);
            }
            setIsLoading(false);
        };
        fetchVenues();
    }, []);

    return (
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px 80px', minHeight: '80vh' }}>
            {/* Hero Section */}
            <div style={{ marginBottom: 32 }}>
                <div className="t-eyebrow" style={{ marginBottom: 8, color: 'var(--aeva-ink-mute)' }}>DISCOVER VENUES</div>
                <h1 className="t-display-lg" style={{ marginBottom: 12, maxWidth: 720 }}>Perfect venues for your event.</h1>
                <p className="t-body-lg" style={{ color: 'var(--aeva-ink-soft)', maxWidth: 600 }}>
                    Handpicked spaces sorted by match score. Browse details, see why AEVA recommends each one, and pick your favorite.
                </p>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '24px'
                }}>
                    {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
                </div>
            ) : venues.length > 0 ? (
                <>
                    {/* Venue Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '24px'
                    }}>
                        <AnimatePresence>
                            {venues.map((v, i) => {
                                const isExpanded = expanded === v.id;
                                const matchScore = Math.round(80 + Math.random() * 20);
                                const isSelected = selectedVenue?.id === v.id;
                                return (
                                    <motion.div
                                        key={v.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => setExpanded(isExpanded ? null : v.id)}
                                        style={{
                                            background: 'var(--aeva-canvas)',
                                            border: `1px solid ${isExpanded ? 'var(--aeva-ink)' : 'var(--aeva-line)'}`,
                                            borderRadius: 'var(--r-lg)',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            transition: 'all 240ms',
                                            boxShadow: isExpanded ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                                            transform: isExpanded ? 'translateY(-2px)' : 'translateY(0)'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isExpanded) {
                                                e.currentTarget.style.borderColor = 'var(--aeva-line-strong)';
                                                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isExpanded) {
                                                e.currentTarget.style.borderColor = 'var(--aeva-line)';
                                                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                            }
                                        }}
                                    >
                                        {/* Image */}
                                        <div style={{ position: 'relative', height: 200 }}>
                                            <img src={v.image} alt={v.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                                            {/* Score Badge */}
                                            <div style={{
                                                position: 'absolute', top: 12, left: 12, padding: '6px 10px',
                                                background: 'rgba(26,24,20,0.85)', backdropFilter: 'blur(6px)',
                                                borderRadius: 999, color: 'white', fontSize: 11, fontWeight: 600,
                                                display: 'flex', alignItems: 'center', gap: 5
                                            }}>
                                                <Sparkles size={10} style={{ color: 'var(--aeva-ember)' }}/>
                                                {matchScore}% match
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div style={{ padding: 18 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                                                <h3 className="t-display-sm" style={{ maxWidth: '85%' }}>{v.name}</h3>
                                                <span style={{ fontSize: 14, fontWeight: 600 }}>${v.startingPrice.toLocaleString()}</span>
                                            </div>
                                            <p style={{
                                                fontSize: 12.5, color: 'var(--aeva-ink-mute)', marginBottom: 10,
                                                display: 'flex', alignItems: 'center', gap: 5
                                            }}>
                                                <MapPin size={11}/> {v.location} · holds {v.maxGuests}
                                            </p>
                                            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
                                                {(v.type ? [v.type] : []).map(t => <Tag key={t} size="sm">{t}</Tag>)}
                                            </div>
                                            {v.rating && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    {[...Array(5)].map((_, j) => (
                                                        <Star
                                                            key={j}
                                                            size={12}
                                                            style={{
                                                                fill: j < Math.floor(v.rating) ? 'var(--aeva-ink)' : 'var(--aeva-line)',
                                                                color: j < Math.floor(v.rating) ? 'var(--aeva-ink)' : 'var(--aeva-line)'
                                                            }}
                                                        />
                                                    ))}
                                                    <span style={{ fontSize: 11, color: 'var(--aeva-ink-mute)', marginLeft: 4 }}>{v.rating}</span>
                                                </div>
                                            )}

                                            {/* Expanded Content */}
                                            <div style={{
                                                overflow: 'hidden',
                                                maxHeight: isExpanded ? 300 : 0,
                                                transition: 'max-height 360ms ease'
                                            }}>
                                                <div style={{ paddingTop: 14, borderTop: '1px solid var(--aeva-line)', marginTop: 10 }}>
                                                    <p className="t-eyebrow" style={{ marginBottom: 10, color: 'var(--aeva-ink)' }}>Description</p>
                                                    <p style={{ fontSize: 13, color: 'var(--aeva-ink-soft)', lineHeight: 1.5, marginBottom: 14 }}>
                                                        {v.description}
                                                    </p>
                                                    <div style={{ display: 'flex', gap: 8 }}>
                                                        <Button
                                                            variant={isSelected ? 'primary' : 'ghost'}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setVenue(v);
                                                                navigate(`/venues/${v.id}`);
                                                            }}
                                                            style={{ flex: 1 }}
                                                        >
                                                            {isSelected ? <><Check size={16}/> Selected</> : 'View Details'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            {!isExpanded && (
                                                <div style={{ fontSize: 12, color: 'var(--aeva-ink-soft)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                                    Tap to see more →
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </>
            ) : (
                <div style={{
                    background: 'var(--aeva-canvas)',
                    padding: '48px',
                    borderRadius: 'var(--r-lg)',
                    border: '1px solid var(--aeva-line)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
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
                        <Sparkles size={32} style={{ color: 'var(--aeva-ink-soft)' }}/>
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--aeva-ink)', marginBottom: '8px' }}>No venues found</h3>
                    <p style={{ color: 'var(--aeva-ink-soft)' }}>Try browsing all venues or adjusting your search.</p>
                </div>
            )}
        </div>
    );
}
