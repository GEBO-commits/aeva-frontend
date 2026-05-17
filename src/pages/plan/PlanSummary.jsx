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
        <div className="max-w-6xl mx-auto py-8 px-4">
            <PlanProgressBar currentStep={4} />

            <div className="mt-8 mb-10 flex items-center justify-between">
                <div className="flex-1">
                    <h1 className="text-4xl font-display font-bold text-text-dark mb-2">✨ Your Event Plan is Ready!</h1>
                    <p className="text-text-muted">Review your selections and confirm your dream event.</p>
                </div>
                <button
                    onClick={() => navigate('/plan/build/vendors')}
                    className="text-text-muted hover:text-text-dark px-4 py-2 font-medium text-sm transition-colors border border-gray-200 rounded-full hover:bg-gray-50 bg-white ml-4"
                >
                    ← Back
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left: Selection Cards */}
                <div className="lg:col-span-2 space-y-6">
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
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                <Camera className="text-blue-500" size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-text-dark">Vendors</h3>
                            {skippedSteps.includes(3) && (
                                <span className="ml-2 flex items-center gap-1 text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                                    Skipped
                                </span>
                            )}
                        </div>
                        <div className="grid sm:grid-cols-3 gap-4">
                            <VendorSmall role="Photographer" vendor={selectedVendors.photographer} icon={<Camera size={16} />} color="blue" />
                            <VendorSmall role="DJ" vendor={selectedVendors.dj} icon={<Music size={16} />} color="violet" />
                            <VendorSmall role="Videographer" vendor={selectedVendors.videographer} icon={<Video size={16} />} color="indigo" />
                        </div>
                    </div>
                </div>

                {/* Right: Cost Summary & Actions */}
                <div className="lg:col-start-3">
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl sticky top-24">
                        <h3 className="text-2xl font-bold text-text-dark mb-6">Cost Summary</h3>

                        <div className="space-y-4 mb-8">
                            <CostRow label="Venue" value={selectedVenue?.startingPrice} />
                            <CostRow label="Catering (~100p)" value={selectedCatering ? selectedCatering.pricePerPerson * 100 : 0} />
                            <CostRow label="Decorations" value={selectedDecorations?.totalPrice} />
                            <CostRow label="Vendors" value={
                                (selectedVendors.photographer?.startingPrice || 0) +
                                (selectedVendors.dj?.startingPrice || 0) +
                                (selectedVendors.videographer?.startingPrice || 0)
                            } />
                        </div>

                        <div className="pt-6 border-t border-gray-100 mb-8 font-black">
                            <div className="flex justify-between items-center text-2xl">
                                <span className="text-text-dark">Total Est.</span>
                                <span className="text-primary">{totalCost.toLocaleString()} EGP</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleConfirm}
                                disabled={false}
                                className="w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 bg-primary text-white hover:bg-secondary shadow-lg shadow-primary/20"
                            >
                                <CheckCircle size={20} /> Lock In This Plan
                            </button>

                            <button
                                onClick={handleStartAI}
                                className="w-full py-4 bg-white border-2 border-primary/20 text-primary rounded-2xl font-bold text-lg hover:border-primary transition-all flex items-center justify-center gap-2 group mt-4!"
                            >
                                <Sparkles size={20} className="group-hover:animate-pulse" /> Want a Better One With AI?
                            </button>

                            <button
                                onClick={() => navigate('/invitations')}
                                className="w-full py-3 bg-gray-100 text-text-dark rounded-xl font-bold hover:bg-gray-200 transition-all text-sm"
                            >
                                Skip to Invitations
                            </button>

                            <button
                                onClick={clearPlan}
                                className="w-full py-2 text-text-muted hover:text-red-500 transition-colors text-sm font-medium"
                            >
                                Reset Selections
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SummaryItem({ title, icon, item, placeholder, details, price, priceLabel = null, isSkipped }) {
    return (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100">
                {item?.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        {icon}
                    </div>
                )}
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    {icon}
                    <h4 className="text-sm font-bold text-text-muted uppercase tracking-widest">{title}</h4>
                    {isSkipped && (
                        <span className="ml-2 flex items-center gap-1 text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                            Skipped
                        </span>
                    )}
                </div>
                {item ? (
                    <>
                        <h3 className="text-xl font-bold text-text-dark">{item.name}</h3>
                        <p className="text-text-muted text-sm">{details}</p>
                    </>
                ) : (
                    <p className="text-gray-400 italic">{placeholder}</p>
                )}
            </div>
            {price > 0 && (
                <div className="text-right">
                    <p className="text-lg font-bold text-text-dark">{price.toLocaleString()} EGP</p>
                    {priceLabel && <p className="text-[10px] text-text-muted">{priceLabel}</p>}
                </div>
            )}
        </div>
    );
}

function VendorSmall({ role, vendor, icon, color }) {
    return (
        <div className={`p-4 rounded-2xl border ${vendor ? 'border-primary/20 bg-primary/5' : 'border-gray-100 bg-gray-50'}`}>
            <p className="text-[10px] uppercase font-bold text-text-muted mb-2">{role}</p>
            {vendor ? (
                <div className="flex items-center gap-2 relative">
                    <div className={`w-6 h-6 rounded-lg bg-white flex items-center justify-center text-${color}-500 shadow-sm`}>
                        {icon}
                    </div>
                    <p className="text-xs font-bold text-text-dark truncate flex-1">{vendor.name}</p>
                </div>
            ) : (
                <p className="text-[10px] text-gray-400 italic">Not selected</p>
            )}
        </div>
    );
}

function CostRow({ label, value }) {
    return (
        <div className="flex justify-between items-center text-sm">
            <span className="text-text-muted">{label}</span>
            <span className="text-text-dark font-semibold">{value ? value.toLocaleString() : 0} EGP</span>
        </div>
    );
}
