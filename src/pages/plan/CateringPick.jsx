/**
 * CateringPick.jsx — Step 2 of the Plan Builder
 * User browses and selects a catering service.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mockCatering } from '../../api/mock/catering.mock';
import { usePlanStore } from '../../store/plan.store';
import { Star, CheckCircle } from 'lucide-react';

export default function CateringPick() {
    const { selectedCatering, setCatering } = usePlanStore();
    const navigate = useNavigate();

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-display font-bold text-text-dark">🍽️ Choose Catering</h2>
                    <p className="text-text-muted mt-1">Pick the perfect menu style for your guests.</p>
                </div>
                {selectedCatering && (
                    <button onClick={() => navigate('/plan/build/decorations')} className="bg-primary text-white px-6 py-2.5 rounded-full font-bold hover:bg-secondary transition-colors shadow-md flex items-center gap-2">
                        Next Step →
                    </button>
                )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockCatering.map((c, i) => {
                    const isSelected = selectedCatering?.id === c.id;
                    return (
                        <motion.div
                            key={c.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            onClick={() => setCatering(c)}
                            className={`relative bg-white rounded-3xl overflow-hidden shadow-sm border-2 cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1 ${isSelected ? 'border-[#f97316] ring-2 ring-orange-200' : 'border-gray-100'}`}
                        >
                            {isSelected && (
                                <div className="absolute top-3 right-3 z-10 w-8 h-8 bg-[#f97316] rounded-full flex items-center justify-center shadow-lg">
                                    <CheckCircle className="w-5 h-5 text-white" />
                                </div>
                            )}
                            <img src={c.image} alt={c.name} className="w-full h-44 object-cover" />
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-bold text-text-dark">{c.name}</h3>
                                    <span className="flex items-center gap-1 text-xs text-gray-500"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{c.rating}</span>
                                </div>
                                <p className="text-xs text-orange-500 font-medium mb-2">{c.style}</p>
                                <div className="pt-2 border-t border-gray-100">
                                    <span className="font-bold text-[#f97316] text-sm">{c.pricePerPerson} EGP / person</span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
