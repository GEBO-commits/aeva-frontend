/**
 * SelectCatering.jsx — Step 2 of the Plan Builder
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

export default function SelectCatering() {
    const navigate = useNavigate();
    const { setCatering, selectedCatering, skipStep } = usePlanStore();
    const { eventId } = useContext(PlanBuilderContext);
    const [catering, setCateringData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const fetchCatering = async () => {
            setIsLoading(true);
            const { data, error } = await getVendors('catering');
            if (!cancelled) {
                if (error) {
                    console.error('[SelectCatering] Failed to fetch catering vendors:', error);
                    setCateringData([]);
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
                            rating: v.rating,
                            image: Array.isArray(v.image_urls)
                                ? v.image_urls[0]
                                : (JSON.parse(v.image_urls || '[]')[0] || 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800'),
                            style: 'Buffet',
                            pricePerPerson: v.price_min,
                            dietaryOptions: details.options || [],
                            menuHighlights: details.specialties || [],
                            type: 'Catering'
                        };
                    });
                    setCateringData(mapped);
                }
                setIsLoading(false);
            }
        };
        fetchCatering();
        return () => { cancelled = true; };
    }, []);

    const handleSelect = async (c) => {
        const isSelected = selectedCatering?.id === c.id;
        setCatering(isSelected ? null : c);

        if (!isSelected && c && eventId) {
            const { error } = await saveEventSelection(eventId, 'catering', c.id);
            if (error) {
                console.error('[SelectCatering] Failed to save catering selection:', error);
            }
        }
    };

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', paddingTop: '32px', paddingX: '16px' }}>
            <PlanProgressBar currentStep={1} />

            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '32px',
                marginBottom: '24px'
            }}>
                <div>
                    <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--aeva-ink)', marginBottom: '4px' }}>🍽️ Choose Catering</h1>
                    <p style={{ color: 'var(--aeva-ink-soft)', marginTop: '4px' }}>Pick the perfect menu style for your guests.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Button variant="ghost" onClick={() => navigate('/plan/build/venue')}>← Back</Button>
                    <Button variant="ghost" onClick={() => { skipStep(1); navigate('/plan/build/decorations'); }}>Skip this step</Button>
                    {selectedCatering && (
                        <Button variant="primary" onClick={() => navigate('/plan/build/decorations')}>Next Step: Decorations →</Button>
                    )}
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '24px'
            }}>
                {isLoading ? (
                    <div style={{ color: 'var(--aeva-ink-soft)' }}>Loading catering options...</div>
                ) : catering.length > 0 ? (
                    catering.map((c, i) => {
                        const isSelected = selectedCatering?.id === c.id;
                        return (
                            <motion.div
                                key={c.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                onClick={() => handleSelect(c)}
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
                                    <img src={c.image} alt={c.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
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
                                        background: 'var(--aeva-paper)',
                                        backdropFilter: 'blur(10px)',
                                        padding: '4px 8px',
                                        borderRadius: 'var(--r-full)',
                                        fontSize: '12px',
                                        fontWeight: 700,
                                        color: 'var(--aeva-ink)'
                                    }}>
                                        {c.style}
                                    </div>
                                </div>
                                <div style={{ padding: '16px' }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        marginBottom: '8px'
                                    }}>
                                        <h3 style={{ fontWeight: 700, color: 'var(--aeva-ink)', fontSize: '14px' }}>{c.name}</h3>
                                        <span style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            fontSize: '12px',
                                            color: 'var(--aeva-ink-soft)'
                                        }}>
                                            <Star className="w-3 h-3" style={{ fill: 'currentColor' }} />{c.rating}
                                        </span>
                                    </div>
                                    <p style={{
                                        fontSize: '12px',
                                        color: 'var(--aeva-ink-soft)',
                                        marginBottom: '12px',
                                        lineHeight: '1.3',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>{c.description}</p>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingTop: '8px',
                                        borderTop: '1px solid var(--aeva-line)',
                                        marginBottom: '12px',
                                        fontSize: '12px'
                                    }}>
                                        <span style={{ fontWeight: 700, color: 'var(--aeva-ink)' }}>{c.pricePerPerson} EGP/person</span>
                                        <span style={{ color: 'var(--aeva-ink-soft)' }}>~{(c.pricePerPerson * 100).toLocaleString()}</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); navigate(`/catering/${c.id}`); }}
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
                                            onClick={(e) => { e.stopPropagation(); handleSelect(c); }}
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
                                            {isSelected ? '✓ Selected' : 'Select Catering →'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                ) : (
                    <div style={{ color: 'var(--aeva-ink-soft)', textAlign: 'center', gridColumn: 'span -1' }}>No catering options available</div>
                )}
            </div>
        </div>
    );
}
