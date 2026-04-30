import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Users, Star, Check } from 'lucide-react';
import { mockVenues } from '../api/mock/venues.mock';
import Skeleton, { TextSkeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';

export default function VenueDetail() {
    const { id } = useParams();
    const venue = mockVenues.find(v => v.id === id) || mockVenues[0];
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '48px' }}>
                <Skeleton style={{ height: '400px', width: '100%', maxWidth: '1280px', margin: '0 auto', borderRadius: 'var(--r-2xl)' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }} className="lg:grid-cols-3">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} className="lg:col-span-2">
                        <div style={{ background: 'var(--aeva-canvas)', padding: '32px', borderRadius: 'var(--r-2xl)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--aeva-line)' }}>
                            <Skeleton style={{ width: '192px', height: '32px', marginBottom: '16px' }} />
                            <TextSkeleton lines={4} />
                        </div>
                        <div style={{ background: 'var(--aeva-canvas)', padding: '32px', borderRadius: 'var(--r-2xl)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--aeva-line)' }}>
                            <Skeleton style={{ width: '224px', height: '32px', marginBottom: '24px' }} />
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(128px, 1fr))', gap: '16px' }}>
                                {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} style={{ height: '24px', width: '128px' }} />)}
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ background: 'var(--aeva-canvas)', padding: '24px', borderRadius: 'var(--r-2xl)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--aeva-line)' }}>
                            <Skeleton style={{ width: '160px', height: '28px', marginBottom: '24px' }} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <Skeleton style={{ width: '100%', height: '32px' }} />
                                <Skeleton style={{ width: '100%', height: '32px' }} />
                            </div>
                            <Skeleton style={{ width: '100%', height: '48px', borderRadius: 'var(--r-lg)', marginTop: '32px' }} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '48px' }}>
            <div style={{
                position: 'relative',
                height: '400px',
                width: '100%',
                maxWidth: '1280px',
                margin: '0 auto',
                borderRadius: 'var(--r-2xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-2xl)'
            }}>
                <img src={venue.image} alt={venue.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2), transparent)'
                }}></div>
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    padding: '32px',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '24px',
                    color: 'white'
                }} className="md:flex-row md:items-end md:padding-12">
                    <div>
                        <span style={{
                            background: 'rgba(0,0,0,0.4)',
                            color: 'white',
                            backdropFilter: 'blur(8px)',
                            padding: '6px 16px',
                            borderRadius: 'var(--r-full)',
                            fontSize: '14px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            boxShadow: 'var(--shadow-sm)',
                            display: 'inline-block',
                            marginBottom: '16px'
                        }}>{venue.type}</span>
                        <h1 style={{
                            fontSize: '36px',
                            fontWeight: 700,
                            lineHeight: 1.2,
                            marginBottom: '8px'
                        }}>{venue.name}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin className="w-4 h-4" /> {venue.location}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Star className="w-4 h-4" style={{ fill: '#FCD34D', color: '#FCD34D' }} /> {venue.rating}</span>
                        </div>
                    </div>
                    <Button variant="primary" style={{ width: '100%', marginBottom: '0' }} className="md:width-auto md:shrink-0">
                        Book Venue
                    </Button>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '32px'
            }} className="lg:grid-cols-3">
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '32px'
                }} className="lg:col-span-2">
                    <section style={{
                        background: 'var(--aeva-canvas)',
                        padding: '32px',
                        borderRadius: 'var(--r-2xl)',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid var(--aeva-line)'
                    }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--aeva-ink)', marginBottom: '16px' }}>About this Venue</h2>
                        <p style={{ color: 'var(--aeva-ink-soft)', lineHeight: 1.6, fontSize: '18px' }}>{venue.description}</p>
                    </section>

                    <section style={{
                        background: 'var(--aeva-canvas)',
                        padding: '32px',
                        borderRadius: 'var(--r-2xl)',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid var(--aeva-line)'
                    }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--aeva-ink)', marginBottom: '24px' }}>Amenities & Features</h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(128px, 1fr))',
                            gap: '16px'
                        }}>
                            {venue.amenities.map(item => (
                                <div key={item} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: 'var(--aeva-ink)',
                                    fontWeight: 500
                                }}>
                                    <Check className="w-5 h-5" style={{ color: 'var(--aeva-ink)' }} /> {item}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px'
                }}>
                    <div style={{
                        background: 'var(--aeva-canvas)',
                        padding: '24px',
                        borderRadius: 'var(--r-2xl)',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid var(--aeva-line)',
                        position: 'sticky',
                        top: '96px'
                    }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--aeva-ink)', marginBottom: '24px' }}>Venue Snapshot</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                paddingBottom: '12px',
                                borderBottom: '1px solid var(--aeva-line)'
                            }}>
                                <span style={{ color: 'var(--aeva-ink-soft)' }}>Starting Price</span>
                                <span style={{ fontWeight: 700, fontSize: '18px', color: 'var(--aeva-ink)' }}>{venue.startingPrice.toLocaleString()} EGP</span>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                paddingBottom: '12px',
                                borderBottom: '1px solid var(--aeva-line)',
                                alignItems: 'center'
                            }}>
                                <span style={{ color: 'var(--aeva-ink-soft)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Users className="w-4 h-4" /> Capacity
                                </span>
                                <span style={{ fontWeight: 700, color: 'var(--aeva-ink)' }}>{venue.minGuests} - {venue.maxGuests}</span>
                            </div>
                        </div>
                        <Link to="/survey" style={{
                            marginTop: '32px',
                            display: 'block',
                            width: '100%',
                            textAlign: 'center',
                            border: '2px solid var(--aeva-ink)',
                            color: 'var(--aeva-ink)',
                            padding: '12px 24px',
                            borderRadius: 'var(--r-lg)',
                            fontWeight: 700,
                            transition: 'all 200ms',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                            textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--aeva-ink)';
                            e.currentTarget.style.color = 'var(--aeva-paper)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'var(--aeva-ink)';
                        }}>
                            Start Planning Here
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
