/**
 * DecorationsPick.jsx — Step 3 of the Plan Builder
 * User selects a decoration package.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mockDecorations } from '../../api/mock/decorations.mock';
import { usePlanStore } from '../../store/plan.store';
import { Star, CheckCircle, Sparkles } from 'lucide-react';

export default function DecorationsPick() {
    const { selectedDecorations, setDecorations } = usePlanStore();
    const navigate = useNavigate();

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-display font-bold text-text-dark">🌸 Choose Decorations</h2>
                    <p className="text-text-muted mt-1">Set the scene with the perfect decoration theme.</p>
                </div>
                {selectedDecorations && (
                    <button onClick={() => navigate('/plan/build/vendors')} className="bg-primary text-white px-6 py-2.5 rounded-full font-bold hover:bg-secondary transition-colors shadow-md flex items-center gap-2">
                        Next Step →
                    </button>
                )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockDecorations.map((d, i) => {
                    const isSelected = selectedDecorations?.id === d.id;
                    return (
                        <motion.div
                            key={d.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            onClick={() => setDecorations(d)}
                            className={`relative bg-white rounded-3xl overflow-hidden shadow-sm border-2 cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1 ${isSelected ? 'border-pink-500 ring-2 ring-pink-100' : 'border-gray-100'}`}
                        >
                            {isSelected && (
                                <div className="absolute top-3 right-3 z-10 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
                                    <CheckCircle className="w-5 h-5 text-white" />
                                </div>
                            )}
                            <img src={d.image} alt={d.name} className="w-full h-44 object-cover" />
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-bold text-text-dark">{d.name}</h3>
                                    <span className="flex items-center gap-1 text-xs text-gray-500"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{d.rating}</span>
                                </div>
                                <p className="text-xs text-pink-500 font-medium mb-2">{d.theme}</p>
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {d.includes.slice(0, 2).map(tag => (
                                        <span key={tag} className="text-[10px] bg-pink-50 text-pink-600 px-2 py-0.5 rounded-full">{tag}</span>
                                    ))}
                                </div>
                                <div className="pt-2 border-t border-gray-100">
                                    <span className="font-bold text-pink-500 text-sm">{d.totalPrice?.toLocaleString()} EGP</span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
