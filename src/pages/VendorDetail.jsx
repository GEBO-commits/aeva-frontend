import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockVendors } from '../api/mock/vendors.mock';
import { usePlanStore } from '../store/plan.store';
import { Star, CheckCircle, ArrowLeft, Camera, Music, Video } from 'lucide-react';
import { Button } from '../components/ui/Button';

const CATEGORY_MAP = { Photographer: 'photographer', DJ: 'dj', Videographer: 'videographer' };
const ICON_MAP = { photographer: Camera, dj: Music, videographer: Video };

export default function VendorDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setVendor, selectedVendors } = usePlanStore();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const found = mockVendors.find(v => v.id === id);
        if (found) {
            setItem(found);
        }
        setLoading(false);
    }, [id]);

    if (loading) return <div style={{ minHeight: '100vh', background: 'var(--aeva-paper)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
    if (!item) return <div style={{ minHeight: '100vh', background: 'var(--aeva-paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--aeva-ink-soft)' }}>Vendor not found</div>;

    const catKey = CATEGORY_MAP[item.category];
    const isSelected = selectedVendors[catKey]?.id === item.id;
    const Icon = ICON_MAP[catKey] || Camera;

    const handleSelect = () => {
        setVendor(catKey, isSelected ? null : item);
        navigate('/plan/build/vendors');
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--aeva-paper)', paddingTop: '96px', paddingBottom: '48px', paddingLeft: '16px', paddingRight: '16px' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                <button onClick={() => navigate(-1)} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--aeva-ink-soft)',
                    transition: 'color 200ms',
                    marginBottom: '24px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--aeva-ink)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--aeva-ink-soft)'}
                className="group">
                    <ArrowLeft size={18} style={{ transition: 'transform 200ms' }} className="group-hover:-translate-x-1" /> Back
                </button>

                <div style={{
                    background: 'var(--aeva-canvas)',
                    borderRadius: 'var(--r-2xl)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-xl)',
                    border: '1px solid var(--aeva-line)',
                    display: 'grid',
                    gridTemplateColumns: '1fr'
                }} className="md:grid-cols-2">
                    <div style={{ position: 'relative', height: '320px' }} className="md:height-auto">
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{
                            position: 'absolute',
                            top: '24px',
                            left: '24px',
                            background: 'var(--aeva-canvas)',
                            backdropFilter: 'blur(8px)',
                            padding: '6px 16px',
                            borderRadius: 'var(--r-full)',
                            fontSize: '14px',
                            fontWeight: 700,
                            color: 'var(--aeva-ink)',
                            boxShadow: 'var(--shadow-sm)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <Icon size={16} /> {item.category}
                        </div>
                    </div>

                    <div style={{
                        padding: '32px',
                        display: 'flex',
                        flexDirection: 'column'
                    }} className="md:padding-12">
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '16px'
                        }}>
                            <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--aeva-ink)' }}>{item.name}</h1>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '4px 12px',
                                background: 'var(--aeva-paper-warm)',
                                color: 'var(--aeva-ink)',
                                borderRadius: 'var(--r-full)',
                                fontSize: '14px',
                                fontWeight: 700
                            }}>
                                <Star size={14} style={{ fill: '#FCD34D', color: '#FCD34D' }} /> {item.rating}
                            </div>
                        </div>

                        <p style={{
                            color: 'var(--aeva-ink-soft)',
                            lineHeight: 1.6,
                            marginBottom: '32px'
                        }}>
                            Premium {item.category} services in {item.location || 'Cairo'}. Known for exceptional quality and reliability in capturing or creating the perfect atmosphere for your special events.
                        </p>

                        <div style={{
                            padding: '24px',
                            background: 'var(--aeva-paper-warm)',
                            borderRadius: 'var(--r-xl)',
                            border: '1px solid var(--aeva-line)',
                            marginBottom: '32px'
                        }}>
                            <p style={{ fontSize: '12px', color: 'var(--aeva-ink-soft)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Starting From</p>
                            <p style={{ fontSize: '28px', fontWeight: 700, color: 'var(--aeva-ink)' }}>{item.startingPrice.toLocaleString()} EGP</p>
                        </div>

                        <div style={{
                            marginTop: 'auto',
                            paddingTop: '24px',
                            borderTop: '1px solid var(--aeva-line)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px'
                        }} className="sm:flex-row">
                            <Button
                                variant={isSelected ? 'primary' : 'ghost'}
                                onClick={handleSelect}
                                style={{ flex: 1 }}
                            >
                                {isSelected ? <><CheckCircle size={20} /> In Your Plan</> : `Add to Plan →`}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
