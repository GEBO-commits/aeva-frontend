/**
 * VenueCard.jsx
 *
 * Reusable card for displaying a venue summary.
 * Props:
 *   - venue: object        — venue data from mock or API
 *   - index: number        — stagger animation index
 *   - onView: function     — called when "View Details" is clicked
 *   - onSelect: function   — called when "Select This Venue →" is clicked
 *                           Saves venue to plan store and navigates to /plan/build/catering
 */

import React from 'react';
import { MapPin, Users, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

export default function VenueCard({ venue, index, onView, onSelect }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
                background: 'var(--aeva-canvas)',
                borderRadius: 'var(--r-2xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--aeva-line)',
                transition: 'all 300ms',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                e.currentTarget.style.transform = '';
            }}
        >
            {/* Image */}
            <div style={{ position: 'relative', height: '224px', overflow: 'hidden' }}>
                <img
                    src={venue.image}
                    alt={venue.name}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 500ms'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = ''}
                />
                <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'var(--aeva-canvas)',
                    backdropFilter: 'blur(10px)',
                    padding: '6px 12px',
                    borderRadius: 'var(--r-full)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'var(--aeva-ink)',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <Star className="w-4 h-4" style={{ fill: '#FCD34D', color: '#FCD34D' }} />
                    {venue.rating}
                </div>
                <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px'
                }}>
                    <span style={{
                        background: 'var(--aeva-ink)',
                        color: 'var(--aeva-paper)',
                        backdropFilter: 'blur(10px)',
                        padding: '6px 12px',
                        borderRadius: 'var(--r-full)',
                        fontSize: '12px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'inline-block'
                    }}>
                        {venue.type}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--aeva-ink)', marginBottom: '8px' }}>{venue.name}</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', color: 'var(--aeva-ink-soft)', fontSize: '14px', gap: '8px' }}>
                        <MapPin className="w-4 h-4" style={{ color: 'var(--aeva-ink-soft)', flexShrink: 0 }} />
                        {venue.location}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', color: 'var(--aeva-ink-soft)', fontSize: '14px', gap: '8px' }}>
                        <Users className="w-4 h-4" style={{ color: 'var(--aeva-ink-soft)', flexShrink: 0 }} />
                        {venue.minGuests} – {venue.maxGuests} Guests
                    </div>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--aeva-line)' }}>
                    {/* Price row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '12px', color: 'var(--aeva-ink-soft)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Starting from</span>
                            <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--aeva-ink)' }}>{venue.startingPrice.toLocaleString()} EGP</span>
                        </div>
                        {/* View Details — navigates to /venues/:id */}
                        <button
                            onClick={() => onView && onView(venue)}
                            style={{
                                background: 'var(--aeva-paper-warm)',
                                color: 'var(--aeva-ink)',
                                padding: '8px 16px',
                                borderRadius: 'var(--r-lg)',
                                transition: 'all 200ms',
                                fontWeight: 600,
                                fontSize: '14px',
                                border: '1px solid var(--aeva-line)',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--aeva-line)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--aeva-paper-warm)'}
                        >
                            View Details
                        </button>
                    </div>

                    {/* Select This Venue — saves to plan store and goes to catering step */}
                    <Button variant="primary" size="lg" onClick={() => onSelect && onSelect(venue)} style={{ width: '100%' }}>
                        Select This Venue →
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
