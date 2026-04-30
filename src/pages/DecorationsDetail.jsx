import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVendor } from '../services/catalogService';
import { usePlanStore } from '../store/plan.store';
import { Star, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Tag } from '../components/ui/Tag';
import Skeleton from '../components/ui/Skeleton';

export default function DecorationsDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setDecorations } = usePlanStore();
    const [decorations, setDecorationsData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDecorations = async () => {
            setIsLoading(true);
            const { data, error } = await getVendor(id);
            if (error || !data) {
                console.error('[DecorationsDetail] Failed to fetch decorations:', error);
                setDecorationsData(null);
            } else {
                let details = {};
                if (data.details) {
                    details = typeof data.details === 'string' ? JSON.parse(data.details) : data.details;
                }
                setDecorationsData({
                    id: data.id,
                    name: data.name,
                    description: data.description,
                    rating: data.rating || 4.5,
                    image: Array.isArray(data.image_urls)
                        ? data.image_urls[0]
                        : (JSON.parse(data.image_urls || '[]')[0] || 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800'),
                    totalPrice: data.price_max || data.price_min,
                    theme: (details.styles && details.styles[0]) || 'Custom',
                    includes: details.services || []
                });
            }
            setIsLoading(false);
        };
        if (id) fetchDecorations();
    }, [id]);

    if (isLoading) {
        return (
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px', minHeight: '80vh' }}>
                <Skeleton style={{ height: 400, width: '100%', borderRadius: 'var(--r-lg)', marginBottom: 32 }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))', gap: 48 }}>
                    <Skeleton style={{ height: 300 }} />
                    <Skeleton style={{ height: 300 }} />
                </div>
            </div>
        );
    }

    if (!decorations) {
        return (
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px', minHeight: '80vh', textAlign: 'center' }}>
                <h2 className="t-display-md">Decoration package not found</h2>
                <p style={{ color: 'var(--aeva-ink-soft)', marginBottom: 24 }}>The decoration package you're looking for couldn't be loaded.</p>
                <Button onClick={() => navigate('/decorations')}>Back to Decorations</Button>
            </div>
        );
    }

    const handleSelect = () => {
        setDecorations(decorations);
        navigate('/plan/build/vendors');
    };

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
                <img src={decorations.image} alt={decorations.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                            {decorations.theme}
                        </div>
                        <h1 className="t-display-lg" style={{ color: 'white', marginBottom: 12 }}>{decorations.name}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                            <Star size={16} style={{ fill: '#FCD34D', color: '#FCD34D' }} />
                            {decorations.rating}
                        </div>
                    </div>
                </div>
            </div>

            {/* Two-column layout */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))',
                gap: 48,
                alignItems: 'start'
            }}>
                {/* Left Column: About & Services */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                    {/* About Section */}
                    <section style={{
                        background: 'var(--aeva-canvas)',
                        padding: 32,
                        borderRadius: 'var(--r-lg)',
                        border: '1px solid var(--aeva-line)'
                    }}>
                        <h2 className="t-display-sm" style={{ marginBottom: 16, color: 'var(--aeva-ink)' }}>About This Package</h2>
                        <p className="t-body-lg" style={{ color: 'var(--aeva-ink-soft)', lineHeight: 1.6 }}>
                            {decorations.description}
                        </p>
                    </section>

                    {/* Package Includes */}
                    {decorations.includes.length > 0 && (
                        <section style={{
                            background: 'var(--aeva-canvas)',
                            padding: 32,
                            borderRadius: 'var(--r-lg)',
                            border: '1px solid var(--aeva-line)'
                        }}>
                            <h2 className="t-display-sm" style={{ marginBottom: 24, color: 'var(--aeva-ink)' }}>Package Includes</h2>
                            <ul style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: 12,
                                listStyle: 'none',
                                padding: 0,
                                margin: 0
                            }}>
                                {decorations.includes.map(item => (
                                    <li key={item} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        color: 'var(--aeva-ink)',
                                        fontWeight: 500,
                                        fontSize: 14
                                    }}>
                                        <Check size={18} style={{ color: 'var(--aeva-sage)', flexShrink: 0 }} />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
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
                        <h3 className="t-display-sm" style={{ marginBottom: 24, color: 'var(--aeva-ink)' }}>Package Details</h3>
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
                                    {decorations.totalPrice.toLocaleString()} EGP
                                </span>
                            </div>
                        </div>
                        <Button
                            variant="primary"
                            onClick={handleSelect}
                            style={{ width: '100%', marginTop: 32 }}
                        >
                            Select This Package
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/decorations')}
                            style={{ width: '100%', marginTop: 12 }}
                        >
                            View All Packages
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}