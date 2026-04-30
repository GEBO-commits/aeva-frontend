import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { getVendors } from '../services/catalogService';
import { Utensils, Star, Check } from 'lucide-react';
import { CardSkeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';

export default function Catering() {
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
                            : (JSON.parse(v.image_urls || '[]')[0] || 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800'),
                        startingPrice: v.price_min,
                        pricePerPerson: v.price_min,
                        dietaryOptions: details.options || [],
                        menuHighlights: details.specialties || [],
                        type: 'Catering'
                    };
                });
                setCatering(mapped);
            }
            setIsLoading(false);
        };
        fetchCatering();
    }, []);

    return (
        <div style={{ width: '100%' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--aeva-ink)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Catering Services <Utensils className="w-6 h-6" style={{ color: 'var(--aeva-ink)' }} />
                </h1>
                <p style={{ color: 'var(--aeva-ink-soft)', marginTop: '4px' }}>Discover top-rated caterers for your perfect menu.</p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '24px'
            }}>
                {isLoading ? (
                    <>
                        {[1, 2, 3].map(i => <CardSkeleton key={i} />)}
                    </>
                ) : catering.length > 0 ? (
                    <AnimatePresence>
                        {catering.map((caterer, index) => (
                            <CateringCard key={caterer.id} data={caterer} index={index} onView={() => navigate(`/catering/${caterer.id}`)} />
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
                            <Utensils className="w-8 h-8" style={{ color: 'var(--aeva-ink-soft)' }} />
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--aeva-ink)', marginBottom: '8px' }}>No catering options available</h3>
                        <p style={{ color: 'var(--aeva-ink-soft)' }}>Please check back later.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function CateringCard({ data, index, onView }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            style={{
                background: 'var(--aeva-canvas)',
                borderRadius: 'var(--r-2xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 300ms',
                border: '1px solid var(--aeva-line)',
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
                <img src={data.image} alt={data.name} style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 700ms'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = ''}
                />
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
                <div style={{
                    position: 'absolute',
                    bottom: '16px',
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
                    {data.type}
                </div>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--aeva-ink)' }}>{data.name}</h3>
                </div>
                <p style={{
                    color: 'var(--aeva-ink-soft)',
                    fontSize: '14px',
                    marginBottom: '16px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>{data.description}</p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                    {data.dietaryOptions.map(opt => (
                        <span key={opt} style={{
                            fontSize: '12px',
                            background: 'var(--aeva-paper-warm)',
                            color: 'var(--aeva-ink)',
                            padding: '4px 8px',
                            borderRadius: 'var(--r-md)',
                            border: '1px solid var(--aeva-line)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            <Check className="w-3 h-3" style={{ color: 'var(--aeva-ink)' }} /> {opt}
                        </span>
                    ))}
                </div>

                <div style={{
                    marginTop: 'auto',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--aeva-line)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <span style={{ fontSize: '12px', color: 'var(--aeva-ink-soft)', display: 'block' }}>Starting at</span>
                        <span style={{ fontWeight: 700, color: 'var(--aeva-ink)', fontSize: '18px' }}>{data.startingPrice} EGP / guest</span>
                    </div>
                    <button
                        onClick={onView}
                        style={{
                            background: 'var(--aeva-paper-warm)',
                            color: 'var(--aeva-ink)',
                            padding: '8px 16px',
                            borderRadius: 'var(--r-lg)',
                            fontWeight: 700,
                            transition: 'all 200ms',
                            fontSize: '14px',
                            border: '1px solid var(--aeva-line)',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--aeva-ink)';
                            e.currentTarget.style.color = 'var(--aeva-paper)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'var(--aeva-paper-warm)';
                            e.currentTarget.style.color = 'var(--aeva-ink)';
                        }}
                    >
                        View Menu
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
