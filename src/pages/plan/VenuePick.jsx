/**
 * VenuePick.jsx — Step 1 of the Plan Builder
 * User browses and selects a venue.
 */
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getVenues } from '../../services/catalogService';
import { usePlanStore } from '../../store/plan.store';
import { PlanBuilderContext } from '../../contexts/PlanBuilderContext';
import { saveEventSelection } from '../../services/planningService';
import { MapPin, Users, Star, CheckCircle } from 'lucide-react';
import { PlanProgressBar } from '../../components/plan/PlanProgressBar';
import { Button } from '../../components/ui/Button';

export default function VenuePick() {
    const { selectedVenue, setVenue, skipStep } = usePlanStore();
    const navigate = useNavigate();
    const { eventId } = useContext(PlanBuilderContext);
    const [venues, setVenues] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const fetchVenues = async () => {
            setIsLoading(true);
            const { data, error } = await getVenues();
            if (!cancelled) {
                if (error) {
                    console.error('[VenuePick] Failed to fetch venues:', error);
                    setVenues([]);
                } else {
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
            }
        };
        fetchVenues();
        return () => { cancelled = true; };
    }, []);

    const handleVenueSelect = async (venue, isSelected) => {
        setVenue(isSelected ? null : venue);
        if (!isSelected && venue && eventId) {
            const { error } = await saveEventSelection(eventId, 'venue', venue.id);
            if (error) {
                console.error('[VenuePick] Failed to save venue selection:', error);
            }
        }
    };

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '8px' }}>
            <PlanProgressBar currentStep={0} />

            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '32px',
                marginBottom: '24px'
            }}>
                <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--aeva-ink)', marginBottom: '4px' }}>🏛️ Choose a Venue</h2>
                    <p style={{ color: 'var(--aeva-ink-soft)', marginTop: '4px' }}>Select the perfect space for your event.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                        onClick={() => {
                            usePlanStore.getState().clearPlan();
                            navigate('/');
                        }}
                        style={{
                            fontSize: '14px',
                            fontWeight: 500,
                            color: 'var(--aeva-ink-soft)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'color 200ms'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--aeva-ink)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--aeva-ink-soft)'}
                    >
                        Cancel Plan
                    </button>
                    {selectedVenue ? (
                        <Button variant="primary" onClick={() => navigate('/plan/build/catering')}>
                            Next Step: Catering →
                        </Button>
                    ) : (
                        <Button variant="ghost" onClick={() => navigate('/plan/build/catering')}>
                            Skip this step
                        </Button>
                    )}
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '24px'
            }}>
                {isLoading ? (
                    <div style={{ color: 'var(--aeva-ink-soft)' }}>Loading venues...</div>
                ) : venues.length > 0 ? (
                    venues.map((venue, i) => {
                        const isSelected = selectedVenue?.id === venue.id;
                        return (
                            <motion.div
                                key={venue.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                onClick={() => handleVenueSelect(venue, isSelected)}
                                style={{
                                    position: 'relative',
                                    background: isSelected ? 'var(--aeva-canvas)' : 'var(--aeva-canvas)',
                                    borderRadius: 'var(--r-lg)',
                                    overflow: 'hidden',
                                    boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                                    border: isSelected ? '2px solid var(--aeva-ink)' : '1px solid var(--aeva-line)',
                                    cursor: 'pointer',
                                    transition: 'all 200ms'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)';
                                    e.currentTarget.style.transform = '';
                                }}
                            >
                                {isSelected && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '12px',
                                        right: '12px',
                                        zIndex: 10,
                                        width: '32px',
                                        height: '32px',
                                        background: 'var(--aeva-ink)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: 'var(--shadow-md)'
                                    }}>
                                        <CheckCircle className="w-5 h-5" style={{ color: 'var(--aeva-paper)' }} />
                                    </div>
                                )}
                                <img src={venue.image} alt={venue.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                                <div style={{ padding: '16px' }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginBottom: '8px'
                                    }}>
                                        <h3 style={{ fontWeight: 700, color: 'var(--aeva-ink)', fontSize: '14px' }}>{venue.name}</h3>
                                        <span style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            fontSize: '12px',
                                            color: 'var(--aeva-ink-soft)'
                                        }}>
                                            <Star className="w-3 h-3" style={{ fill: 'currentColor' }} />{venue.rating}
                                        </span>
                                    </div>
                                    <p style={{
                                        fontSize: '12px',
                                        color: 'var(--aeva-ink-soft)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        marginBottom: '8px'
                                    }}>
                                        <MapPin className="w-3 h-3" />{venue.location}
                                    </p>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingTop: '8px',
                                        borderTop: '1px solid var(--aeva-line)',
                                        marginBottom: '8px'
                                    }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{
                                                fontSize: '10px',
                                                color: 'var(--aeva-ink-soft)',
                                                textTransform: 'uppercase',
                                                fontWeight: 700
                                            }}>Starts from</span>
                                            <span style={{
                                                fontWeight: 700,
                                                color: 'var(--aeva-ink)',
                                                fontSize: '13px'
                                            }}>{venue.startingPrice?.toLocaleString()} EGP</span>
                                        </div>
                                        <span style={{
                                            fontSize: '12px',
                                            color: 'var(--aeva-ink-soft)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            <Users className="w-3 h-3" />{venue.maxGuests} max
                                        </span>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); navigate(`/venues/${venue.id}`); }}
                                        style={{
                                            width: '100%',
                                            marginTop: '8px',
                                            padding: '8px',
                                            background: 'var(--aeva-paper-warm)',
                                            color: 'var(--aeva-ink)',
                                            fontSize: '12px',
                                            fontWeight: 700,
                                            borderRadius: 'var(--r-md)',
                                            border: '1px solid var(--aeva-line)',
                                            cursor: 'pointer',
                                            transition: 'all 200ms'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'var(--aeva-line)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'var(--aeva-paper-warm)';
                                        }}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })
                ) : (
                    <div style={{ color: 'var(--aeva-ink-soft)', textAlign: 'center', gridColumn: 'span -1' }}>No venues available</div>
                )}
            </div>
        </div>
    );
}
