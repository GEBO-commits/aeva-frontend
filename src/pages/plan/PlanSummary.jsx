/**
 * PlanSummary.jsx — Step 5 of the Manual Plan Builder
 *
 * Displays a full overview of all selected items (Venue, Catering, Decorations, Vendors)
 * and the total computed cost.
 */

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePlanStore } from '../../store/plan.store';
import { PlanBuilderContext } from '../../contexts/PlanBuilderContext';
import { PlanProgressBar } from '../../components/plan/PlanProgressBar';
import { CheckCircle, Sparkles, Calendar, MapPin, Users, Utensils, Palette, Camera, Music, Video, ArrowRight, AlertTriangle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function PlanSummary() {
    const navigate = useNavigate();
    const { eventId } = useContext(PlanBuilderContext);
    const {
        selectedVenue,
        selectedCatering,
        selectedDecorations,
        selectedVendors,
        skippedSteps,
        getTotalCost,
        clearPlan
    } = usePlanStore();

    const hasAnySelection = Boolean(
        selectedVenue ||
        selectedCatering ||
        selectedDecorations ||
        Object.values(selectedVendors).some(Boolean)
    );

    const totalCost = getTotalCost();

    const handleConfirm = () => {
        navigate('/booking/confirm', { state: { eventId } });
    };

    const handleStartAI = () => {
        // Navigate to dashboard and auto-open chat
        navigate('/dashboard', { state: { openChat: true } });
    };

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', paddingTop: '32px', paddingX: '16px' }}>
            <PlanProgressBar currentStep={4} />

            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '32px',
                marginBottom: '40px'
            }}>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--aeva-ink)', marginBottom: '8px' }}>✨ Your Event Plan is Ready!</h1>
                    <p style={{ color: 'var(--aeva-ink-soft)' }}>Review your selections and confirm your dream event.</p>
                </div>
                <Button variant="ghost" onClick={() => navigate('/plan/build/vendors')}>← Back</Button>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '32px'
            }} className="lg:grid-cols-3">
                {/* Left: Selection Cards */}
                <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Venue */}
                    <SummaryItem
                        title="Venue"
                        icon={<MapPin className="text-primary" size={20} />}
                        item={selectedVenue}
                        placeholder="No venue selected yet"
                        details={selectedVenue ? `${selectedVenue.location} · ${selectedVenue.maxGuests} Guests` : ''}
                        price={selectedVenue?.startingPrice}
                        isSkipped={skippedSteps.includes(0)}
                    />

                    {/* Catering */}
                    <SummaryItem
                        title="Catering"
                        icon={<Utensils className="text-orange-500" size={20} />}
                        item={selectedCatering}
                        placeholder="No catering selected yet"
                        details={selectedCatering ? `${selectedCatering.style} · ${selectedCatering.pricePerPerson} EGP/person` : ''}
                        price={selectedCatering ? selectedCatering.pricePerPerson * 100 : 0} // ~100 guests
                        priceLabel="~For 100 guests"
                        isSkipped={skippedSteps.includes(1)}
                    />

                    {/* Decorations */}
                    <SummaryItem
                        title="Decorations"
                        icon={<Palette className="text-pink-500" size={20} />}
                        item={selectedDecorations}
                        placeholder="No decorations selected yet"
                        details={selectedDecorations ? `${selectedDecorations.theme}` : ''}
                        price={selectedDecorations?.totalPrice}
                        isSkipped={skippedSteps.includes(2)}
                    />

                    {/* Vendors */}
                    <div style={{
                        background: 'var(--aeva-canvas)',
                        borderRadius: 'var(--r-2xl)',
                        padding: '24px',
                        border: '1px solid var(--aeva-line)',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                background: 'var(--aeva-paper-warm)',
                                borderRadius: 'var(--r-lg)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Camera style={{ color: 'var(--aeva-ink)' }} size={20} />
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--aeva-ink)' }}>Vendors</h3>
                            {skippedSteps.includes(3) && (
                                <span style={{
                                    marginLeft: '8px',
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    color: 'var(--aeva-ink-soft)',
                                    background: 'var(--aeva-paper-warm)',
                                    padding: '2px 8px',
                                    borderRadius: 'var(--r-full)',
                                    border: '1px solid var(--aeva-line)'
                                }}>
                                    Skipped
                                </span>
                            )}
                        </div>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                            gap: '16px'
                        }}>
                            <VendorSmall role="Photographer" vendor={selectedVendors.photographer} icon={<Camera size={16} />} />
                            <VendorSmall role="DJ" vendor={selectedVendors.dj} icon={<Music size={16} />} />
                            <VendorSmall role="Videographer" vendor={selectedVendors.videographer} icon={<Video size={16} />} />
                        </div>
                    </div>
                </div>

                {/* Right: Cost Summary & Actions */}
                <div style={{
                    background: 'var(--aeva-canvas)',
                    borderRadius: 'var(--r-2xl)',
                    padding: '32px',
                    border: '1px solid var(--aeva-line)',
                    boxShadow: 'var(--shadow-lg)',
                    position: 'sticky',
                    top: '96px'
                }}>
                    <h3 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--aeva-ink)', marginBottom: '24px' }}>Cost Summary</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                        <CostRow label="Venue" value={selectedVenue?.startingPrice} />
                        <CostRow label="Catering (~100p)" value={selectedCatering ? selectedCatering.pricePerPerson * 100 : 0} />
                        <CostRow label="Decorations" value={selectedDecorations?.totalPrice} />
                        <CostRow label="Vendors" value={
                            (selectedVendors.photographer?.startingPrice || 0) +
                            (selectedVendors.dj?.startingPrice || 0) +
                            (selectedVendors.videographer?.startingPrice || 0)
                        } />
                    </div>

                    <div style={{
                        paddingTop: '24px',
                        borderTop: '1px solid var(--aeva-line)',
                        marginBottom: '32px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '24px', fontWeight: 700 }}>
                            <span style={{ color: 'var(--aeva-ink)' }}>Total Est.</span>
                            <span style={{ color: 'var(--aeva-ink)' }}>{totalCost.toLocaleString()} EGP</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={handleConfirm}
                            disabled={!hasAnySelection}
                            title={!hasAnySelection ? "Please make your selections to continue" : ""}
                            style={{ width: '100%' }}
                        >
                            <CheckCircle size={20} /> Lock In This Plan
                        </Button>

                        <button
                            onClick={handleStartAI}
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: 'var(--aeva-canvas)',
                                border: '2px solid var(--aeva-line)',
                                color: 'var(--aeva-ink)',
                                borderRadius: 'var(--r-xl)',
                                fontWeight: 700,
                                fontSize: '16px',
                                transition: 'all 200ms',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                                marginTop: '16px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--aeva-ink)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--aeva-line)';
                                e.currentTarget.style.boxShadow = '';
                            }}
                        >
                            <Sparkles size={20} /> Want a Better One With AI?
                        </button>

                        <button
                            onClick={() => navigate('/invitations')}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'var(--aeva-paper-warm)',
                                color: 'var(--aeva-ink)',
                                borderRadius: 'var(--r-lg)',
                                fontWeight: 700,
                                fontSize: '14px',
                                border: '1px solid var(--aeva-line)',
                                cursor: 'pointer',
                                transition: 'all 200ms'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--aeva-line)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--aeva-paper-warm)'}
                        >
                            Skip to Invitations
                        </button>

                        <button
                            onClick={clearPlan}
                            style={{
                                width: '100%',
                                padding: '8px',
                                color: 'var(--aeva-ink-soft)',
                                fontSize: '14px',
                                fontWeight: 500,
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'color 200ms'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--aeva-ink)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--aeva-ink-soft)'}
                        >
                            Reset Selections
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SummaryItem({ title, icon, item, placeholder, details, price, priceLabel = null, isSkipped }) {
    return (
        <div style={{
            background: 'var(--aeva-canvas)',
            borderRadius: 'var(--r-2xl)',
            padding: '24px',
            border: '1px solid var(--aeva-line)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '24px'
        }}>
            <div style={{
                width: '96px',
                height: '96px',
                borderRadius: 'var(--r-xl)',
                overflow: 'hidden',
                flexShrink: 0,
                background: 'var(--aeva-paper-warm)',
                border: '1px solid var(--aeva-line)'
            }}>
                {item?.image ? (
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--aeva-ink-soft)' }}>
                        {icon}
                    </div>
                )}
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    {icon}
                    <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--aeva-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h4>
                    {isSkipped && (
                        <span style={{
                            marginLeft: '8px',
                            fontSize: '10px',
                            fontWeight: 700,
                            color: 'var(--aeva-ink-soft)',
                            background: 'var(--aeva-paper-warm)',
                            padding: '2px 8px',
                            borderRadius: 'var(--r-full)',
                            border: '1px solid var(--aeva-line)'
                        }}>
                            Skipped
                        </span>
                    )}
                </div>
                {item ? (
                    <>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--aeva-ink)' }}>{item.name}</h3>
                        <p style={{ color: 'var(--aeva-ink-soft)', fontSize: '14px' }}>{details}</p>
                    </>
                ) : (
                    <p style={{ color: 'var(--aeva-ink-soft)', fontStyle: 'italic' }}>{placeholder}</p>
                )}
            </div>
            {price > 0 && (
                <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--aeva-ink)' }}>{price.toLocaleString()} EGP</p>
                    {priceLabel && <p style={{ fontSize: '10px', color: 'var(--aeva-ink-soft)' }}>{priceLabel}</p>}
                </div>
            )}
        </div>
    );
}

function VendorSmall({ role, vendor, icon }) {
    return (
        <div style={{
            padding: '16px',
            borderRadius: 'var(--r-xl)',
            border: vendor ? '1px solid var(--aeva-line)' : '1px solid var(--aeva-line)',
            background: vendor ? 'var(--aeva-paper-warm)' : 'var(--aeva-paper-warm)'
        }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--aeva-ink-soft)', marginBottom: '8px', textTransform: 'uppercase' }}>{role}</p>
            {vendor ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: 'var(--r-lg)',
                        background: 'var(--aeva-canvas)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--aeva-ink)',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        {icon}
                    </div>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--aeva-ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{vendor.name}</p>
                </div>
            ) : (
                <p style={{ fontSize: '10px', color: 'var(--aeva-ink-soft)', fontStyle: 'italic' }}>Not selected</p>
            )}
        </div>
    );
}

function CostRow({ label, value }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
            <span style={{ color: 'var(--aeva-ink-soft)' }}>{label}</span>
            <span style={{ color: 'var(--aeva-ink)', fontWeight: 600 }}>{value ? value.toLocaleString() : 0} EGP</span>
        </div>
    );
}
