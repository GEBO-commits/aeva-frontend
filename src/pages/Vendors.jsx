import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getVendors } from '../services/catalogService';
import { Camera, Star } from 'lucide-react';
import { CardSkeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { Tag } from '../components/ui/Tag';

export default function Vendors() {
    const [expanded, setExpanded] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [vendors, setVendors] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVendors = async () => {
            setIsLoading(true);
            const { data, error } = await getVendors();
            if (error) {
                console.error('[Vendors] Failed to fetch vendors:', error);
                setVendors([]);
            } else {
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
                        rating: v.rating || 4.5,
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

    return (
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px 80px', minHeight: '80vh' }}>
            {/* Hero Section */}
            <div style={{ marginBottom: 32 }}>
                <div className="t-eyebrow" style={{ marginBottom: 8, color: 'var(--aeva-ink-mute)' }}>PROFESSIONAL SERVICES</div>
                <h1 className="t-display-lg" style={{ marginBottom: 12, maxWidth: 720 }}>Entertainment and services for your event.</h1>
                <p className="t-body-lg" style={{ color: 'var(--aeva-ink-soft)', maxWidth: 600 }}>
                    Discover photographers, DJs, videographers, and more. Browse portfolios and book top-rated professionals.
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
            ) : vendors.length > 0 ? (
                <>
                    {/* Vendors Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '24px'
                    }}>
                        <AnimatePresence>
                            {vendors.map((vendor, i) => {
                                const isExpanded = expanded === vendor.id;
                                return (
                                    <motion.div
                                        key={vendor.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => setExpanded(isExpanded ? null : vendor.id)}
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
                                            <img src={vendor.image} alt={vendor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                                            {/* Rating Badge */}
                                            <div style={{
                                                position: 'absolute', top: 12, right: 12, padding: '6px 10px',
                                                background: 'rgba(26,24,20,0.85)', backdropFilter: 'blur(6px)',
                                                borderRadius: 999, color: 'white', fontSize: 11, fontWeight: 600,
                                                display: 'flex', alignItems: 'center', gap: 5
                                            }}>
                                                <Star size={10} style={{ fill: '#FCD34D', color: '#FCD34D' }}/>
                                                {vendor.rating}
                                            </div>
                                            {/* Category Badge */}
                                            <div style={{
                                                position: 'absolute', bottom: 12, left: 12, padding: '6px 10px',
                                                background: 'var(--aeva-ink)', color: 'white',
                                                borderRadius: 'var(--r-lg)', fontSize: 11, fontWeight: 600
                                            }}>
                                                {vendor.category}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div style={{ padding: 18 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                                                <h3 className="t-display-sm" style={{ maxWidth: '85%' }}>{vendor.name}</h3>
                                                <span style={{ fontSize: 14, fontWeight: 600 }}>${vendor.startingPrice.toLocaleString()}</span>
                                            </div>
                                            <p style={{
                                                fontSize: 12.5, color: 'var(--aeva-ink-mute)', marginBottom: 10,
                                                lineHeight: 1.4
                                            }}>
                                                {vendor.description}
                                            </p>
                                            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
                                                {vendor.features.slice(0, 3).map(f => <Tag key={f} size="sm">{f}</Tag>)}
                                                {vendor.features.length > 3 && <Tag size="sm">+{vendor.features.length - 3}</Tag>}
                                            </div>

                                            {/* Expanded Content */}
                                            <div style={{
                                                overflow: 'hidden',
                                                maxHeight: isExpanded ? 300 : 0,
                                                transition: 'max-height 360ms ease'
                                            }}>
                                                <div style={{ paddingTop: 14, borderTop: '1px solid var(--aeva-line)', marginTop: 10 }}>
                                                    <p className="t-eyebrow" style={{ marginBottom: 10, color: 'var(--aeva-ink)' }}>Services</p>
                                                    {vendor.features.length > 0 ? (
                                                        <ul style={{ fontSize: 13, color: 'var(--aeva-ink-soft)', lineHeight: 1.6, marginBottom: 14, paddingLeft: 16 }}>
                                                            {vendor.features.map((f, idx) => <li key={idx}>• {f}</li>)}
                                                        </ul>
                                                    ) : (
                                                        <p style={{ fontSize: 13, color: 'var(--aeva-ink-soft)', marginBottom: 14 }}>
                                                            Full service list available on detailed profile
                                                        </p>
                                                    )}
                                                    <div style={{ display: 'flex', gap: 8 }}>
                                                        <Button
                                                            variant="primary"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate(`/vendors/${vendor.id}`);
                                                            }}
                                                            style={{ flex: 1 }}
                                                        >
                                                            View Profile
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
                        <Camera size={32} style={{ color: 'var(--aeva-ink-soft)' }}/>
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--aeva-ink)', marginBottom: '8px' }}>No vendors found</h3>
                    <p style={{ color: 'var(--aeva-ink-soft)' }}>Browse back soon for new vendor partners.</p>
                </div>
            )}
        </div>
    );
}
