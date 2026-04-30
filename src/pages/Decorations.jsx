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
import { getVendors } from '../services/catalogService';
import { usePlanStore } from '../store/plan.store';
import { Palette, Star, CheckCircle } from 'lucide-react';
import { CardSkeleton } from '../components/ui/Skeleton';

console.log('✅ Decorations page loaded');

export default function Decorations() {
    const [isLoading, setIsLoading] = useState(true);
    const [decorations, setDecorations] = useState([]);
    const navigate = useNavigate();
    const { setDecorations: setPlanDecorations, selectedDecorations } = usePlanStore();

    useEffect(() => {
        const fetchDecorations = async () => {
            setIsLoading(true);
            const { data, error } = await getVendors('decorations');
            if (error) {
                console.error('[Decorations] Failed to fetch decoration vendors:', error);
                setDecorations([]);
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
                            : (JSON.parse(v.image_urls || '[]')[0] || 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800'),
                        totalPrice: v.price_max || v.price_min,
                        theme: (details.styles && details.styles[0]) || 'Custom',
                        includes: details.services || []
                    };
                });
                setDecorations(mapped);
            }
            setIsLoading(false);
        };
        fetchDecorations();
    }, []);

    /** Handle selecting a decoration package and moving to the next plan step */
    const handleSelect = (decor) => {
        setPlanDecorations(decor);
        navigate('/plan/build/vendors');
    };

    return (
        <div style={{ width: '100%' }}>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--aeva-ink)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Decorations &amp; Styling <Palette className="w-6 h-6" style={{ color: 'var(--aeva-ink)' }} />
                </h1>
                <p style={{ color: 'var(--aeva-ink-soft)', marginTop: '4px' }}>Bring your vision to life with expert decoration packages.</p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '24px'
            }}>
                {isLoading ? (
                    [1, 2, 3].map(i => <CardSkeleton key={i} />)
                ) : decorations.length > 0 ? (
                    <AnimatePresence>
                        {decorations.map((decor, index) => (
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
                ) : (
                    <div style={{
                        gridColumn: '1 / -1',
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
                            <Palette className="w-8 h-8" style={{ color: 'var(--aeva-ink-soft)' }} />
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--aeva-ink)', marginBottom: '8px' }}>No decoration packages available</h3>
                        <p style={{ color: 'var(--aeva-ink-soft)' }}>Please check back later.</p>
                    </div>
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
            style={{
                background: 'var(--aeva-canvas)',
                borderRadius: 'var(--r-2xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 300ms',
                border: isSelected ? '2px solid var(--aeva-ink)' : '2px solid var(--aeva-line)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
        >
            <div style={{ position: 'relative', height: '224px', overflow: 'hidden' }}>
                <img
                    src={data.image}
                    alt={data.name}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 700ms'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = ''}
                />
                {/* Rating badge */}
                <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'var(--aeva-canvas)',
                    backdropFilter: 'blur(12px)',
                    padding: '6px 12px',
                    borderRadius: 'var(--r-full)',
                    fontSize: '14px',
                    fontWeight: 700,
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'var(--aeva-ink)'
                }}>
                    <Star className="w-4 h-4" style={{ fill: '#FCD34D', color: '#FCD34D' }} /> {data.rating}
                </div>
                {/* Theme badge */}
                <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    background: 'var(--aeva-ink)',
                    color: 'var(--aeva-paper)',
                    padding: '6px 12px',
                    borderRadius: 'var(--r-full)',
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    boxShadow: 'var(--shadow-md)'
                }}>
                    {data.theme}
                </div>
                {/* Selected overlay */}
                {isSelected && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: 'var(--aeva-ink)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: 'var(--shadow-xl)'
                        }}>
                            <CheckCircle className="w-7 h-7" style={{ color: 'var(--aeva-paper)' }} />
                        </div>
                    </div>
                )}
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--aeva-ink)', marginBottom: '4px' }}>{data.name}</h3>
                <p style={{
                    color: 'var(--aeva-ink-soft)',
                    fontSize: '14px',
                    marginBottom: '16px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>{data.description}</p>

                {/* Package includes tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                    {data.includes.map(item => (
                        <span key={item} style={{
                            fontSize: '12px',
                            background: 'var(--aeva-paper-warm)',
                            color: 'var(--aeva-ink)',
                            padding: '4px 8px',
                            borderRadius: 'var(--r-full)',
                            border: '1px solid var(--aeva-line)'
                        }}>
                            {item}
                        </span>
                    ))}
                </div>

                <div style={{
                    marginTop: 'auto',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--aeva-line)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                }}>
                    <button
                        onClick={onView}
                        style={{
                            width: '100%',
                            padding: '8px',
                            borderRadius: 'var(--r-lg)',
                            fontSize: '12px',
                            fontWeight: 700,
                            color: 'var(--aeva-ink-soft)',
                            transition: 'all 200ms',
                            border: '1px solid var(--aeva-line)',
                            background: 'transparent',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = 'var(--aeva-ink)';
                            e.currentTarget.style.borderColor = 'var(--aeva-ink)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'var(--aeva-ink-soft)';
                            e.currentTarget.style.borderColor = 'var(--aeva-line)';
                        }}
                    >
                        View Details
                    </button>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '4px'
                    }}>
                        <span style={{ fontSize: '12px', color: 'var(--aeva-ink-soft)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Packages from</span>
                        <span style={{ fontWeight: 700, color: 'var(--aeva-ink)', fontSize: '18px' }}>{data.totalPrice.toLocaleString()} EGP</span>
                    </div>
                    {/* Select button */}
                    <button
                        onClick={onSelect}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: 'var(--r-lg)',
                            fontSize: '14px',
                            fontWeight: 700,
                            transition: 'all 200ms',
                            background: isSelected ? 'var(--aeva-ink)' : 'var(--aeva-paper-warm)',
                            color: isSelected ? 'var(--aeva-paper)' : 'var(--aeva-ink)',
                            border: isSelected ? 'none' : '1px solid var(--aeva-line)',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            if (!isSelected) {
                                e.currentTarget.style.background = 'var(--aeva-ink)';
                                e.currentTarget.style.color = 'var(--aeva-paper)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isSelected) {
                                e.currentTarget.style.background = 'var(--aeva-paper-warm)';
                                e.currentTarget.style.color = 'var(--aeva-ink)';
                            }
                        }}
                    >
                        {isSelected ? '✓ Selected' : 'Select Package →'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
