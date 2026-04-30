/**
 * SelectVendors.jsx — Step 4 of the Manual Plan Builder
 *
 * Three sections: Photographers, DJs, Videographers.
 * User selects one from each section.
 * "Continue to Summary →" appears when at least one vendor is selected.
 * On continue: navigates to /plan/build/summary
 */

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getVendors } from '../../services/catalogService';
import { usePlanStore } from '../../store/plan.store';
import { PlanBuilderContext } from '../../contexts/PlanBuilderContext';
import { saveEventSelection } from '../../services/planningService';
import { PlanProgressBar } from '../../components/plan/PlanProgressBar';
import { Star, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const CATEGORIES = [
    { key: 'photographer', dbCategory: 'photography', label: 'Photographers', icon: '📸' },
    { key: 'dj', dbCategory: 'dj', label: 'DJs', icon: '🎵' },
    { key: 'videographer', dbCategory: 'videography', label: 'Videographers', icon: '🎬' },
];

export default function SelectVendors() {
    const navigate = useNavigate();
    const { setVendor, selectedVendors, skipStep } = usePlanStore();
    const { eventId } = useContext(PlanBuilderContext);
    const [vendorsData, setVendorsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const fetchVendors = async () => {
            setIsLoading(true);
            const { data, error } = await getVendors();
            if (!cancelled) {
                if (error) {
                    console.error('[SelectVendors] Failed to fetch vendors:', error);
                    setVendorsData([]);
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
                            rating: v.rating,
                            image: Array.isArray(v.image_urls)
                                ? v.image_urls[0]
                                : (JSON.parse(v.image_urls || '[]')[0] || 'https://images.unsplash.com/photo-1514306688007-f2e490fb4e90?w=800'),
                            startingPrice: v.price_min
                        };
                    });
                    setVendorsData(mapped);
                }
                setIsLoading(false);
            }
        };
        fetchVendors();
        return () => { cancelled = true; };
    }, []);

    const handleVendorSelect = async (vendorType, isSelected, vendor) => {
        setVendor(vendorType, isSelected ? null : vendor);

        if (!isSelected && vendor && eventId) {
            const { error } = await saveEventSelection(eventId, vendorType, vendor.id);
            if (error) {
                console.error('[SelectVendors] Failed to save vendor selection:', error);
            }
        }
    };

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', paddingTop: '32px', paddingX: '16px' }}>
            <PlanProgressBar currentStep={3} />

            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '32px',
                marginBottom: '24px'
            }}>
                <div>
                    <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--aeva-ink)', marginBottom: '4px' }}>🎵 Choose Vendors</h1>
                    <p style={{ color: 'var(--aeva-ink-soft)', marginTop: '4px' }}>Select one from each category — or skip categories you don't need.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Button variant="ghost" onClick={() => navigate('/plan/build/decorations')}>← Back</Button>
                    <Button variant="ghost" onClick={() => { skipStep(3); navigate('/plan/build/summary'); }}>Skip this step</Button>
                    {Object.values(selectedVendors).some(Boolean) && (
                        <Button variant="primary" onClick={() => navigate('/plan/build/summary')}>Next Step: Summary →</Button>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div style={{ color: 'var(--aeva-ink-soft)' }}>Loading vendors...</div>
            ) : CATEGORIES.map(cat => {
                const vendors = vendorsData.filter(v => v.category === cat.dbCategory);
                return (
                    <div key={cat.key} style={{ marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--aeva-ink)', marginBottom: '16px' }}>{cat.icon} {cat.label}</h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                            gap: '24px'
                        }}>
                            {vendors.map((vendor, i) => {
                                const isSelected = selectedVendors[cat.key]?.id === vendor.id;
                                return (
                                    <motion.div
                                        key={vendor.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.08 }}
                                        onClick={() => handleVendorSelect(cat.key, isSelected, vendor)}
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
                                            <img src={vendor.image} alt={vendor.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
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
                                        </div>
                                        <div style={{ padding: '16px' }}>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                                marginBottom: '8px'
                                            }}>
                                                <h3 style={{ fontWeight: 700, color: 'var(--aeva-ink)', fontSize: '14px' }}>{vendor.name}</h3>
                                                <span style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    fontSize: '12px',
                                                    color: 'var(--aeva-ink-soft)'
                                                }}>
                                                    <Star className="w-3 h-3" style={{ fill: 'currentColor' }} />{vendor.rating}
                                                </span>
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                paddingTop: '8px',
                                                borderTop: '1px solid var(--aeva-line)',
                                                marginBottom: '12px'
                                            }}>
                                                <span style={{ fontWeight: 700, color: 'var(--aeva-ink)', fontSize: '13px' }}>{vendor.startingPrice.toLocaleString()} EGP</span>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); navigate(`/vendors/${vendor.id}`); }}
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
                                                    onClick={(e) => { e.stopPropagation(); handleVendorSelect(cat.key, isSelected, vendor); }}
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
                                                    {isSelected ? '✓ Selected' : `Select ${cat.label.slice(0, -1)} →`}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}

            {Object.values(selectedVendors).some(Boolean) && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', paddingBottom: '32px' }}>
                    <Button variant="primary" onClick={() => navigate('/plan/build/summary')}>Continue to Summary <ArrowRight className="w-5 h-5" /></Button>
                </div>
            )}
        </div>
    );
}
