import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mockDecorations } from '../api/mock/decorations.mock';
import { usePlanStore } from '../store/plan.store';
import { Star, CheckCircle, Palette, ArrowLeft, Tag } from 'lucide-react';

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

    if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center">Loading...</div>;
    if (!item) return <div className="min-h-screen bg-surface flex items-center justify-center text-text-muted">Item not found</div>;

    const isSelected = selectedDecorations?.id === item.id;

    const handleSelect = () => {
        setDecorations(item);
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
                        <div className="absolute top-6 left-6 bg-pink-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md">
                            {item.theme}
                        </div>
                    </div>

                    <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-3xl font-display font-bold text-text-dark">{item.name}</h1>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm font-bold">
                                <Star size={14} className="fill-yellow-500 text-yellow-500" /> {item.rating}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {item.includes.map(inc => (
                                <span key={inc} className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-xs font-bold border border-pink-100 flex items-center gap-1">
                                    <Tag size={12} /> {inc}
                                </span>
                            ))}
                        </div>

                        <div className="p-6 bg-pink-50 rounded-2xl border border-pink-100 mb-8">
                            <p className="text-xs text-pink-600 font-bold uppercase tracking-wider mb-1">Package Price</p>
                            <p className="text-3xl font-display font-black text-pink-600">{item.totalPrice.toLocaleString()} EGP</p>
                        </div>

                        <div className="mt-auto pt-6 border-t border-gray-50 flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleSelect}
                                className={`flex-1 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${isSelected
                                        ? 'bg-pink-500 text-white shadow-lg shadow-pink-200'
                                        : 'bg-pink-50 text-pink-600 border border-pink-200 hover:bg-pink-500 hover:text-white'
                                    }`}
                            >
                                {isSelected ? <><CheckCircle size={20} /> Selected</> : 'Select This Package →'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
