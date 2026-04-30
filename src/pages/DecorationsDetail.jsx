import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mockDecorations } from '../api/mock/decorations.mock';
import { usePlanStore } from '../store/plan.store';
import { Star, CheckCircle, Palette, ArrowLeft, Tag } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function DecorationsDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setDecorations, selectedDecorations } = usePlanStore();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const found = mockDecorations.find(d => d.id === id);
        if (found) {
            setItem(found);
        }
        setLoading(false);
    }, [id]);

    if (loading) return <div style={{ minHeight: '100vh', background: 'var(--aeva-paper)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
    if (!item) return <div style={{ minHeight: '100vh', background: 'var(--aeva-paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--aeva-ink-soft)' }}>Item not found</div>;

    const isSelected = selectedDecorations?.id === item.id;

    const handleSelect = () => {
        setDecorations(item);
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
                            background: 'var(--aeva-ink)',
                            color: 'var(--aeva-paper)',
                            padding: '6px 16px',
                            borderRadius: 'var(--r-full)',
                            fontSize: '14px',
                            fontWeight: 700,
                            boxShadow: 'var(--shadow-md)'
                        }}>
                            {item.theme}
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

                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px',
                            marginBottom: '24px'
                        }}>
                            {item.includes.map(inc => (
                                <span key={inc} style={{
                                    padding: '4px 12px',
                                    background: 'var(--aeva-paper-warm)',
                                    color: 'var(--aeva-ink)',
                                    borderRadius: 'var(--r-full)',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    border: '1px solid var(--aeva-line)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}>
                                    <Tag size={12} /> {inc}
                                </span>
                            ))}
                        </div>

                        <div style={{
                            padding: '24px',
                            background: 'var(--aeva-paper-warm)',
                            borderRadius: 'var(--r-xl)',
                            border: '1px solid var(--aeva-line)',
                            marginBottom: '32px'
                        }}>
                            <p style={{ fontSize: '12px', color: 'var(--aeva-ink-soft)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Package Price</p>
                            <p style={{ fontSize: '28px', fontWeight: 700, color: 'var(--aeva-ink)' }}>{item.totalPrice.toLocaleString()} EGP</p>
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
                                {isSelected ? <><CheckCircle size={20} /> Selected</> : 'Select This Package →'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
