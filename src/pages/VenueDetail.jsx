import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Users, Star, Check } from 'lucide-react';
import { getVenue } from '../services/catalogService';
import Skeleton, { TextSkeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';

export default function VenueDetail() {
    const { id } = useParams();
    const [venue, setVenue] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchVenue = async () => {
            setIsLoading(true);
            const { data, error } = await getVenue(id);
            if (error || !data) {
                console.error('[VenueDetail] Failed to fetch venue:', error);
                setVenue(null);
            } else {
                setVenue({
                    id: data.id,
                    name: data.name,
                    type: data.venue_type,
                    minGuests: data.capacity_min,
                    maxGuests: data.capacity_max,
                    startingPrice: data.price_min,
                    rating: data.rating || 4.5,
                    image: Array.isArray(data.image_urls)
                        ? data.image_urls[0]
                        : (JSON.parse(data.image_urls || '[]')[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800'),
                    location: data.city,
                    amenities: Array.isArray(data.features)
                        ? data.features
                        : (JSON.parse(data.features || '[]') || []),
                    description: data.description || 'Premium venue'
                });
            }
            setIsLoading(false);
        };
        if (id) fetchVenue();
    }, [id]);

    if (isLoading) {
        return (
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px 48px', minHeight: '80vh' }}>
                <Skeleton style={{ height: '400px', width: '100%', borderRadius: 'var(--r-lg)', marginBottom: 32 }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32, gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                        <div style={{ background: 'var(--aeva-canvas)', padding: 32, borderRadius: 'var(--r-lg)', border: '1px solid var(--aeva-line)' }}>
                            <Skeleton style={{ width: 192, height: 32, marginBottom: 16 }} />
                            <TextSkeleton lines={4} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div style={{ background: 'var(--aeva-canvas)', padding: 32, borderRadius: 'var(--r-lg)', border: '1px solid var(--aeva-line)', position: 'sticky', top: 24 }}>
                            <Skeleton style={{ width: 160, height: 28, marginBottom: 24 }} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <Skeleton style={{ width: '100%', height: 32 }} />
                                <Skeleton style={{ width: '100%', height: 32 }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!venue) {
        return (
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px', minHeight: '80vh', textAlign: 'center' }}>
                <h2 className="t-display-md" style={{ marginBottom: 8 }}>Venue not found</h2>
                <p style={{ color: 'var(--aeva-ink-soft)' }}>The venue you're looking for couldn't be loaded.</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px 80px', minHeight: '80vh' }}>
            {/* Hero Image */}
            <div style={{
                position: 'relative',
                height: 400,
                width: '100%',
                borderRadius: 'var(--r-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                marginBottom: 48
            }}>
                <img src={venue.image} alt={venue.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.2), transparent)'
                }}></div>
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                    color: 'white'
                }}>
                    <div>
                        <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 12 }}>
                            {venue.type}
                        </div>
                        <h1 className="t-display-lg" style={{ color: 'white', marginBottom: 12 }}>{venue.name}</h1>
                        <div style={{ display: 'flex', gap: 24, fontSize: 14 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <MapPin size={16} /> {venue.location}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Star size={16} style={{ fill: '#FCD34D', color: '#FCD34D' }} /> {venue.rating}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Two-column layout: 70% left content, 30% right sidebar */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))',
                gap: 48,
                alignItems: 'start'
            }}>
                {/* Left Column: About & Amenities */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                    {/* About Section */}
                    <section style={{
                        background: 'var(--aeva-canvas)',
                        padding: 32,
                        borderRadius: 'var(--r-lg)',
                        border: '1px solid var(--aeva-line)'
                    }}>
                        <h2 className="t-display-sm" style={{ marginBottom: 16, color: 'var(--aeva-ink)' }}>About this Venue</h2>
                        <p className="t-body-lg" style={{ color: 'var(--aeva-ink-soft)', lineHeight: 1.6 }}>
                            {venue.description}
                        </p>
                    </section>

                    {/* Amenities Section */}
                    <section style={{
                        background: 'var(--aeva-canvas)',
                        padding: 32,
                        borderRadius: 'var(--r-lg)',
                        border: '1px solid var(--aeva-line)'
                    }}>
                        <h2 className="t-display-sm" style={{ marginBottom: 24, color: 'var(--aeva-ink)' }}>Amenities & Features</h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: 16
                        }}>
                            {venue.amenities.map(item => (
                                <div key={item} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    color: 'var(--aeva-ink)',
                                    fontWeight: 500,
                                    fontSize: 14
                                }}>
                                    <Check size={18} style={{ color: 'var(--aeva-sage)', flexShrink: 0 }} />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column: Sticky Sidebar */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 24
                }}>
                    <div style={{
                        background: 'var(--aeva-canvas)',
                        padding: 32,
                        borderRadius: 'var(--r-lg)',
                        border: '1px solid var(--aeva-line)',
                        position: 'sticky',
                        top: 24
                    }}>
                        <h3 className="t-display-sm" style={{ marginBottom: 24, color: 'var(--aeva-ink)' }}>Quick Info</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingBottom: 12,
                                borderBottom: '1px solid var(--aeva-line)'
                            }}>
                                <span className="t-body-sm" style={{ color: 'var(--aeva-ink-mute)' }}>Starting Price</span>
                                <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--aeva-ink)' }}>
                                    {venue.startingPrice.toLocaleString()} EGP
                                </span>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingBottom: 12,
                                borderBottom: '1px solid var(--aeva-line)'
                            }}>
                                <span className="t-body-sm" style={{ color: 'var(--aeva-ink-mute)', display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <Users size={16} /> Capacity
                                </span>
                                <span style={{ fontWeight: 700, color: 'var(--aeva-ink)' }}>
                                    {venue.minGuests.toLocaleString()} - {venue.maxGuests.toLocaleString()}
                                </span>
                            </div>
                        </div>
                        <Button
                            variant="primary"
                            style={{ width: '100%', marginTop: 32 }}
                        >
                            Book Venue
                        </Button>
                        <Link to="/survey" style={{
                            marginTop: 12,
                            display: 'block',
                            width: '100%',
                            textAlign: 'center',
                            padding: '12px 24px',
                            borderRadius: 'var(--r-lg)',
                            fontWeight: 700,
                            fontSize: 14,
                            color: 'var(--aeva-ink)',
                            border: '1px solid var(--aeva-line)',
                            textDecoration: 'none',
                            transition: 'all 200ms',
                            backgroundColor: 'transparent',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--aeva-paper-warm)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}>
                            Start Planning
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
