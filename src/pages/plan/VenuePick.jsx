/**
 * VenuePick.jsx — Step 1 of the Plan Builder
 * User browses and selects a venue.
 */
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getVenues } from '../../services/catalogService';
import { usePlanStore } from '../../store/plan.store';
import { PlanBuilderContext } from '../../contexts/PlanBuilderContext';
import { saveEventSelection } from '../../services/planningService';
import { MapPin, Users, Star, CheckCircle } from 'lucide-react';
import { PlanProgressBar } from '../../components/plan/PlanProgressBar';

export default function VenuePick() {
    const { selectedVenue, setVenue, skipStep } = usePlanStore();
    const navigate = useNavigate();
    const { eventId } = useContext(PlanBuilderContext);
    const [venues, setVenues] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const fetchVenues = async () => {
            setIsLoading(true);
            const { data, error } = await getVenues();
            if (!cancelled) {
                if (error) {
                    console.error('[VenuePick] Failed to fetch venues:', error);
                    setVenues([]);
                } else {
                    // Map Supabase venues to card shape
                    const mapped = (data || []).map(v => ({
                        id: v.id,
                        name: v.name,
                        type: v.venue_type,
                        minGuests: v.capacity_min,
                        maxGuests: v.capacity_max,
                        startingPrice: v.price_min,
                        rating: v.rating,
                        image: Array.isArray(v.image_urls)
                            ? v.image_urls[0]
                            : (JSON.parse(v.image_urls || '[]')[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800'),
                        location: v.city,
                        amenities: Array.isArray(v.features)
                            ? v.features
                            : (JSON.parse(v.features || '[]') || []),
                        description: v.description
                    }));
                    setVenues(mapped);
                }
                setIsLoading(false);
            }
        };
        fetchVenues();
        return () => { cancelled = true; };
    }, []);

    const handleVenueSelect = async (venue, isSelected) => {
        setVenue(isSelected ? null : venue);

        // Save to Supabase if selecting (not deselecting)
        if (!isSelected && venue && eventId) {
            const { error } = await saveEventSelection(eventId, 'venue', venue.id);
            if (error) {
                console.error('[VenuePick] Failed to save venue selection:', error);
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-2">
            <PlanProgressBar currentStep={0} />

            <div className="flex items-center justify-between mt-8 mb-6">
                <div>
                    <h2 className="text-2xl font-display font-bold text-text-dark">🏛️ Choose a Venue</h2>
                    <p className="text-text-muted mt-1">Select the perfect space for your event.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            usePlanStore.getState().clearPlan();
                            navigate('/');
                        }}
                        className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                    >
                        Cancel Plan
                    </button>
                    {selectedVenue ? (
                        <button
                            onClick={() => navigate('/plan/build/catering')}
                            className="bg-primary text-white px-6 py-2.5 rounded-full font-bold hover:bg-secondary transition-colors shadow-md flex items-center gap-2"
                        >
                            Next Step: Catering →
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/plan/build/catering')}
                            className="text-text-muted hover:text-text-dark px-4 py-2 font-medium text-sm transition-colors border border-gray-200 rounded-full hover:bg-gray-50 bg-white"
                        >
                            Skip this step
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div>Loading venues...</div>
                ) : venues.length > 0 ? (
                    venues.map((venue, i) => {
                    const isSelected = selectedVenue?.id === venue.id;
                    return (
                        <motion.div
                            key={venue.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            onClick={() => handleVenueSelect(venue, isSelected)}
                            className={`relative bg-white rounded-3xl overflow-hidden shadow-sm border-2 cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1 ${isSelected ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-gray-100'
                                }`}
                        >
                            {isSelected && (
                                <div className="absolute top-3 right-3 z-10 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                                    <CheckCircle className="w-5 h-5 text-white" />
                                </div>
                            )}
                            <img src={venue.image} alt={venue.name} className="w-full h-44 object-cover" />
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-bold text-text-dark">{venue.name}</h3>
                                    <span className="flex items-center gap-1 text-xs text-gray-500"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{venue.rating}</span>
                                </div>
                                <p className="text-xs text-text-muted flex items-center gap-1 mb-2"><MapPin className="w-3 h-3" />{venue.location}</p>
                                <div className="flex justify-between items-center pt-2 border-t border-gray-100 mb-2">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-text-muted uppercase font-bold">Starts from</span>
                                        <span className="font-bold text-primary text-sm">{venue.startingPrice?.toLocaleString()} EGP</span>
                                    </div>
                                    <span className="text-xs text-gray-500 flex items-center gap-1"><Users className="w-3 h-3" />{venue.maxGuests} max</span>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); navigate(`/venues/${venue.id}`); }}
                                    className="w-full mt-2 py-2 bg-gray-50 hover:bg-gray-100 text-text-dark text-xs font-bold rounded-xl transition-colors border border-gray-200"
                                >
                                    View Details
                                </button>
                            </div>
                        </motion.div>
                    );
                    })
                ) : (
                    <div className="col-span-full text-center text-text-muted">No venues available</div>
                )}
            </div>
        </div>
    );
}
