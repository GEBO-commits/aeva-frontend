import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVendors } from '../services/catalogService';
import { Star, ArrowLeft } from 'lucide-react';

export default function CateringDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            const { data, error } = await getVendors('catering');
            if (!error && data) {
                const found = data.find(c => c.id === id);
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
                        image: Array.isArray(found.image_urls) ? found.image_urls[0] : (JSON.parse(found.image_urls || '[]')[0] || 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?w=800'),
                        pricePerPerson: found.price_min,
                        priceMax: found.price_max,
                        specialties: details.specialties || []
                    });
                }
            }
            setLoading(false);
        };
        fetch();
    }, [id]);

    if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center">Loading...</div>;
    if (!item) return <div className="min-h-screen bg-surface flex items-center justify-center text-text-muted">Item not found</div>;

    return (
        <div className="min-h-screen bg-surface pt-24 pb-12 px-4">
            <div className="max-w-5xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-6 group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back
                </button>

                <div className="bg-white rounded-[32px] overflow-hidden shadow-xl border border-gray-100 flex flex-col md:flex-row">
                    <div className="md:w-1/2 h-80 md:h-auto relative">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold text-orange-500 shadow-sm">
                            {item.style}
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

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                <p className="text-xs text-orange-600 font-bold uppercase tracking-wider mb-1">Starting From</p>
                                <p className="text-xl font-bold text-text-dark">{item.pricePerPerson.toLocaleString()} EGP</p>
                                <p className="text-[10px] text-orange-600/70">Per person</p>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                <p className="text-xs text-orange-600 font-bold uppercase tracking-wider mb-1">Up To</p>
                                <p className="text-xl font-bold text-text-dark">{item.priceMax.toLocaleString()} EGP</p>
                                <p className="text-[10px] text-orange-600/70">Per person</p>
                            </div>
                        </div>

                        {item.specialties && item.specialties.length > 0 && (
                            <div className="mb-8">
                                <p className="text-xs text-orange-600 font-bold uppercase tracking-wider mb-3">Specialties</p>
                                <div className="flex flex-wrap gap-2">
                                    {item.specialties.map(spec => (
                                        <span key={spec} className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-bold border border-orange-100">
                                            {spec}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
