/**
 * SelectDecorations.jsx — Step 3 of the Plan Builder
 */

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getVendors } from '../../services/catalogService';
import { usePlanStore } from '../../store/plan.store';
import { PlanBuilderContext } from '../../contexts/PlanBuilderContext';
import { saveEventSelection } from '../../services/planningService';
import { PlanProgressBar } from '../../components/plan/PlanProgressBar';
import { Star, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function SelectDecorations() {
    const navigate = useNavigate();
    const { setDecorations, selectedDecorations, skipStep } = usePlanStore();
    const { eventId } = useContext(PlanBuilderContext);
    const [decorations, setDecorationsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const fetchDecorations = async () => {
            setIsLoading(true);
            const { data, error } = await getVendors('decorations');
            if (!cancelled) {
                if (error) {
                    console.error('[SelectDecorations] Failed to fetch decoration vendors:', error);
                    setDecorationsData([]);
                } else {
                    // Map Supabase vendors to card shape
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
                    setDecorationsData(mapped);
                }
                setIsLoading(false);
            }
        };
        fetchDecorations();
        return () => { cancelled = true; };
    }, []);

    const handleSelect = async (d) => {
        const isSelected = selectedDecorations?.id === d.id;
        setDecorations(isSelected ? null : d);

        // Save to Supabase if selecting (not deselecting)
        if (!isSelected && d && eventId) {
            const { error } = await saveEventSelection(eventId, 'decorations', d.id);
            if (error) {
                console.error('[SelectDecorations] Failed to save decorations selection:', error);
            }
        }
    };

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', paddingTop: '32px', paddingX: '16px' }}>
            <PlanProgressBar currentStep={2} />

            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '32px',
                marginBottom: '24px'
            }}>
                <div>
                    <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--aeva-ink)', marginBottom: '4px' }}>🌸 Choose Decorations</h1>
                    <p style={{ color: 'var(--aeva-ink-soft)', marginTop: '4px' }}>Set the perfect atmosphere for your event.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Button variant="ghost" onClick={() => navigate('/plan/build/catering')}>← Back</Button>
                    <Button variant="ghost" onClick={() => { skipStep(2); navigate('/plan/build/vendors'); }}>Skip this step</Button>
                    {selectedDecorations && (
                        <Button variant="primary" onClick={() => navigate('/plan/build/vendors')}>Next Step: Vendors →</Button>
                    )}
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '24px'
            }}>
                {isLoading ? (
                    <div style={{ color: 'var(--aeva-ink-soft)' }}>Loading decoration packages...</div>
                ) : decorations.length > 0 ? (
                    decorations.map((d, i) => {
                        const isSelected = selectedDecorations?.id === d.id;
                        return (
                            <motion.div
                                key={d.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                onClick={() => handleSelect(d)}
                                style={{
                                    background: isSelected ? 'var(--aeva-canvas)' : 'var(--aeva-canvas)',
                                    borderRadius: 'var(--r-lg)',
                                    overflow: 'hidden',
                                    boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                                    border: isSelected ? '2px solid var(--aeva-ink)' : '1px solid var(--aeva-line)',
                                    cursor: 'pointer',
                                    transition: 'all 200ms'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)';
                                    e.currentTarget.style.transform = '';
                                }}
                            >
                                <div style={{ position: 'relative' }}>
                                    <img src={d.image} alt={d.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                                    {isSelected && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '12px',
                                            right: '12px',
                                            width: '32px',
                                            height: '32px',
                                            background: 'var(--aeva-ink)',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <CheckCircle className="w-5 h-5" style={{ color: 'var(--aeva-paper)' }} />
                                        </div>
                                    )}
                                    <div style={{
                                        position: 'absolute',
                                        top: '12px',
                                        left: '12px',
                                        background: 'var(--aeva-ink)',
                                        color: 'var(--aeva-paper)',
                                        padding: '4px 8px',
                                        borderRadius: 'var(--r-full)',
                                        fontSize: '12px',
                                        fontWeight: 700
                                    }}>
                                        {d.theme}
                                    </div>
                                </div>
                                <div style={{ padding: '16px' }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        marginBottom: '8px'
                                    }}>
                                        <h3 style={{ fontWeight: 700, color: 'var(--aeva-ink)', fontSize: '14px' }}>{d.name}</h3>
                                        <span style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            fontSize: '12px',
                                            color: 'var(--aeva-ink-soft)'
                                        }}>
                                            <Star className="w-3 h-3" style={{ fill: 'currentColor' }} />{d.rating}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                                        {d.includes.slice(0, 3).map(item => (
                                            <span key={item} style={{
                                                fontSize: '10px',
                                                background: 'var(--aeva-paper-warm)',
                                                color: 'var(--aeva-ink)',
                                                padding: '2px 6px',
                                                borderRadius: 'var(--r-full)'
                                            }}>{item}</span>
                                        ))}
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingTop: '8px',
                                        borderTop: '1px solid var(--aeva-line)',
                                        marginBottom: '12px'
                                    }}>
                                        <span style={{ fontWeight: 700, color: 'var(--aeva-ink)', fontSize: '13px' }}>{d.totalPrice.toLocaleString()} EGP</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); navigate(`/decorations/${d.id}`); }}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                background: 'var(--aeva-paper-warm)',
                                                color: 'var(--aeva-ink)',
                                                fontSize: '12px',
                                                fontWeight: 700,
                                                borderRadius: 'var(--r-md)',
                                                border: '1px solid var(--aeva-line)',
                                                cursor: 'pointer',
                                                transition: 'all 200ms'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--aeva-line)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--aeva-paper-warm)'}
                                        >
                                            View Details
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleSelect(d); }}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                borderRadius: 'var(--r-md)',
                                                fontSize: '13px',
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
                    })
                ) : (
                    <div style={{ color: 'var(--aeva-ink-soft)', textAlign: 'center', gridColumn: 'span -1' }}>No decoration packages available</div>
                )}
            </div>
        </div>
    );
}
