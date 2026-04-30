import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getVendors } from '../services/catalogService';
import { Utensils, Star, Check } from 'lucide-react';
import { CardSkeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { Tag } from '../components/ui/Tag';

export default function Catering() {
    const [expanded, setExpanded] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [catering, setCatering] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCatering = async () => {
            setIsLoading(true);
            const { data, error } = await getVendors('catering');
            if (error) {
                console.error('[Catering] Failed to fetch catering vendors:', error);
                setCatering([]);
            } else {
                const mapped = (data || []).map(v => {
                    let details = {};
                    if (v.details) {
                        details = typeof v.details === 'string' ? JSON.parse(v.details) : v.details;
                    }
                    return {
                        id: v.id,
                        name: v.name,
                        description: v.description,
                        rating: v.rating || 4.5,
                        image: Array.isArray(v.image_urls)
                            ? v.image_urls[0]
                            : (JSON.parse(v.image_urls || '[]')[0] || 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800'),
                        startingPrice: v.price_min,
                        dietaryOptions: details.options || [],
                        menuHighlights: details.specialties || []
                    };
                });
                setCatering(mapped);
            }
            setIsLoading(false);
        };
        fetchCatering();
    }, []);

    return (
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px 80px', minHeight: '80vh' }}>
            {/* Hero Section */}
            <div style={{ marginBottom: 32 }}>
                <div className="t-eyebrow" style={{ marginBottom: 8, color: 'var(--aeva-ink-mute)' }}>CULINARY EXCELLENCE</div>
                <h1 className="t-display-lg" style={{ marginBottom: 12, maxWidth: 720 }}>Catering that elevates your event.</h1>
                <p className="t-body-lg" style={{ color: 'var(--aeva-ink-soft)', maxWidth: 600 }}>
                    Handpicked caterers with diverse menus. Browse options, compare pricing, and find the perfect fit for your guests.
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
            ) : catering.length > 0 ? (
                <>
                    {/* Catering Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '24px'
                    }}>
                        <AnimatePresence>
                            {catering.map((c, i) => {
                                const isExpanded = expanded === c.id;
                                return (
                                    <motion.div
                                        key={c.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => setExpanded(isExpanded ? null : c.id)}
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
                                            <img src={c.image} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                                            {/* Rating Badge */}
                                            <div style={{
                                                position: 'absolute', top: 12, right: 12, padding: '6px 10px',
                                                background: 'rgba(26,24,20,0.85)', backdropFilter: 'blur(6px)',
                                                borderRadius: 999, color: 'white', fontSize: 11, fontWeight: 600,
                                                display: 'flex', alignItems: 'center', gap: 5
                                            }}>
                                                <Star size={10} style={{ fill: '#FCD34D', color: '#FCD34D' }}/>
                                                {c.rating}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div style={{ padding: 18 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                                                <h3 className="t-display-sm" style={{ maxWidth: '85%' }}>{c.name}</h3>
                                                <span style={{ fontSize: 14, fontWeight: 600 }}>${c.startingPrice}/guest</span>
                                            </div>
                                            <p style={{
                                                fontSize: 12.5, color: 'var(--aeva-ink-mute)', marginBottom: 10,
                                                lineHeight: 1.4
                                            }}>
                                                {c.description}
                                            </p>
                                            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
                                                {c.dietaryOptions.slice(0, 3).map(t => <Tag key={t} size="sm">{t}</Tag>)}
                                                {c.dietaryOptions.length > 3 && <Tag size="sm">+{c.dietaryOptions.length - 3}</Tag>}
                                            </div>

                                            {/* Expanded Content */}
                                            <div style={{
                                                overflow: 'hidden',
                                                maxHeight: isExpanded ? 300 : 0,
                                                transition: 'max-height 360ms ease'
                                            }}>
                                                <div style={{ paddingTop: 14, borderTop: '1px solid var(--aeva-line)', marginTop: 10 }}>
                                                    <p className="t-eyebrow" style={{ marginBottom: 10, color: 'var(--aeva-ink)' }}>Menu Highlights</p>
                                                    {c.menuHighlights.length > 0 ? (
                                                        <ul style={{ fontSize: 13, color: 'var(--aeva-ink-soft)', lineHeight: 1.6, marginBottom: 14, paddingLeft: 16 }}>
                                                            {c.menuHighlights.map((h, idx) => <li key={idx}>• {h}</li>)}
                                                        </ul>
                                                    ) : (
                                                        <p style={{ fontSize: 13, color: 'var(--aeva-ink-soft)', marginBottom: 14 }}>
                                                            Full menu available on request
                                                        </p>
                                                    )}
                                                    <div style={{ display: 'flex', gap: 8 }}>
                                                        <Button
                                                            variant="primary"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate(`/catering/${c.id}`);
                                                            }}
                                                            style={{ flex: 1 }}
                                                        >
                                                            View Full Menu
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
                        <Utensils size={32} style={{ color: 'var(--aeva-ink-soft)' }}/>
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--aeva-ink)', marginBottom: '8px' }}>No catering options found</h3>
                    <p style={{ color: 'var(--aeva-ink-soft)' }}>Check back soon for our curated catering partners.</p>
                </div>
            )}
        </div>
    );
}
