import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockVendors } from '../api/mock/vendors.mock';
import { usePlanStore } from '../store/plan.store';
import { Star, CheckCircle, ArrowLeft, Camera, Music, Video } from 'lucide-react';

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

    if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center">Loading...</div>;
    if (!item) return <div className="min-h-screen bg-surface flex items-center justify-center text-text-muted">Vendor not found</div>;

    const catKey = CATEGORY_MAP[item.category];
    const isSelected = selectedVendors[catKey]?.id === item.id;
    const Icon = ICON_MAP[catKey] || Camera;

    const handleSelect = () => {
        setVendor(catKey, isSelected ? null : item);
        navigate('/plan/build/vendors');
    };

    return (
        <div className="min-h-screen bg-surface pt-24 pb-12 px-4">
            <div className="max-w-5xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-6 group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back
                </button>

                <div className="bg-white rounded-[32px] overflow-hidden shadow-xl border border-gray-100 flex flex-col md:flex-row">
                    <div className="md:w-1/2 h-80 md:h-auto relative">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold text-primary shadow-sm flex items-center gap-2">
                            <Icon size={16} /> {item.category}
                        </div>
                    </div>

                    <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-3xl font-display font-bold text-text-dark">{item.name}</h1>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm font-bold">
                                <Star size={14} className="fill-yellow-500 text-yellow-500" /> {item.rating}
                            </div>
                        </div>

                        <p className="text-text-muted leading-relaxed mb-8">
                            Premium {item.category} services in {item.location || 'Cairo'}. Known for exceptional quality and reliability in capturing or creating the perfect atmosphere for your special events.
                        </p>

                        <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 mb-8">
                            <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">Starting From</p>
                            <p className="text-3xl font-display font-black text-primary">{item.startingPrice.toLocaleString()} EGP</p>
                        </div>

                        <div className="mt-auto pt-6 border-t border-gray-50 flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleSelect}
                                className={`flex-1 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${isSelected
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                        : 'bg-primary/5 text-primary border border-primary/20 hover:bg-primary hover:text-white'
                                    }`}
                            >
                                {isSelected ? <><CheckCircle size={20} /> In Your Plan</> : `Add to Plan →`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
