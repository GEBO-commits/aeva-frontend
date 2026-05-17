import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVendors } from '../services/catalogService';
import { Star, ArrowLeft } from 'lucide-react';

export default function VendorDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            const { data, error } = await getVendors();
            if (!error && data) {
                const found = data.find(v => v.id === id);
                if (found) {
                    let details = {};
                    if (found.details) {
                        details = typeof found.details === 'string' ? JSON.parse(found.details) : found.details;
                    }
                    setItem({
                        id: found.id,
                        name: found.name,
                        description: found.description,
                        rating: found.rating,
                        image: Array.isArray(found.image_urls) ? found.image_urls[0] : (JSON.parse(found.image_urls || '[]')[0] || 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?w=800'),
                        priceMin: found.price_min,
                        category: found.category || 'Vendor'
                    });
                }
            }
            setLoading(false);
        };
        fetch();
    }, [id]);

    if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center">Loading...</div>;
    if (!item) return <div className="min-h-screen bg-surface flex items-center justify-center text-text-muted">Vendor not found</div>;

    return (
        <div className="min-h-screen bg-surface pt-24 pb-12 px-4">
            <div className="max-w-5xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-6 group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back
                </button>

                <div className="bg-white rounded-[32px] overflow-hidden shadow-xl border border-gray-100 flex flex-col md:flex-row">
                    <div className="md:w-1/2 h-80 md:h-auto relative">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold text-primary shadow-sm">
                            {item.category}
                        </div>
                    </div>

                    <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-3xl font-display font-bold text-text-dark">{item.name}</h1>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm font-bold">
                                <Star size={14} className="fill-yellow-500 text-yellow-500" /> {item.rating}
                            </div>
                        </div>

                        <p className="text-text-muted leading-relaxed mb-8">{item.description}</p>

                        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                            <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">Starting From</p>
                            <p className="text-2xl font-bold text-text-dark">{item.priceMin.toLocaleString()} EGP</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
