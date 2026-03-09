import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { mockCatering } from '../api/mock/catering.mock';
import { Utensils, Star, Check } from 'lucide-react';
import { CardSkeleton } from '../components/ui/Skeleton';

export default function Catering() {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-text-dark flex items-center gap-2">
                    Catering Services <Utensils className="text-accent w-6 h-6" />
                </h1>
                <p className="text-text-muted mt-1">Discover top-rated caterers for your perfect menu.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <>
                        {[1, 2, 3].map(i => <CardSkeleton key={i} />)}
                    </>
                ) : (
                    <AnimatePresence>
                        {mockCatering.map((caterer, index) => (
                            <CateringCard key={caterer.id} data={caterer} index={index} onView={() => navigate(`/catering/${caterer.id}`)} />
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}

function CateringCard({ data, index, onView }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col h-full"
        >
            <div className="relative h-56 overflow-hidden">
                <img src={data.image} alt={data.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-bold shadow-sm flex items-center gap-1">
                    <Star className="w-4 h-4 text-accent fill-current" /> {data.rating}
                </div>
                <div className="absolute bottom-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                    {data.type}
                </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold font-display text-text-dark">{data.name}</h3>
                </div>
                <p className="text-text-muted text-sm mb-4 line-clamp-2">{data.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                    {data.dietaryOptions.map(opt => (
                        <span key={opt} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-md border border-gray-100 flex items-center gap-1">
                            <Check className="w-3 h-3 text-secondary" /> {opt}
                        </span>
                    ))}
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div>
                        <span className="text-xs text-text-muted block">Starting at</span>
                        <span className="font-bold text-primary text-lg">{data.startingPrice} EGP / guest</span>
                    </div>
                    <button
                        onClick={onView}
                        className="bg-gray-50 hover:bg-primary hover:text-white text-primary px-4 py-2 rounded-xl font-bold transition-colors text-sm"
                    >
                        View Menu
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
