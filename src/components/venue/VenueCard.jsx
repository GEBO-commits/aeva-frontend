/**
 * VenueCard.jsx
 *
 * Reusable card for displaying a venue summary.
 * Props:
 *   - venue: object        — venue data from mock or API
 *   - index: number        — stagger animation index
 *   - onView: function     — called when "View Details" is clicked
 *   - onSelect: function   — called when "Select This Venue →" is clicked
 *                           Saves venue to plan store and navigates to /plan/build/catering
 */

import React from 'react';
import { MapPin, Users, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VenueCard({ venue, index, onView, onSelect }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full"
        >
            {/* Image */}
            <div className="relative h-56 overflow-hidden">
                <img
                    src={venue.image}
                    alt={venue.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-sm font-bold text-text-dark shadow-sm">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    {venue.rating}
                </div>
                <div className="absolute top-4 left-4">
                    <span className="bg-primary/90 text-white backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                        {venue.type}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold font-display text-text-dark mb-2">{venue.name}</h3>

                <div className="flex flex-col gap-1.5 mb-4">
                    <div className="flex items-center text-text-muted text-sm gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        {venue.location}
                    </div>
                    <div className="flex items-center text-text-muted text-sm gap-2">
                        <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        {venue.minGuests} – {venue.maxGuests} Guests
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100">
                    {/* Price row */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex flex-col">
                            <span className="text-xs text-text-muted uppercase font-bold tracking-wider">Starting from</span>
                            <span className="text-lg font-bold text-primary">{venue.startingPrice.toLocaleString()} EGP</span>
                        </div>
                        {/* View Details — navigates to /venues/:id */}
                        <button
                            onClick={() => onView && onView(venue)}
                            className="bg-gray-50 hover:bg-gray-100 text-text-dark px-4 py-2 rounded-xl transition-colors font-medium text-sm border border-gray-200"
                        >
                            View Details
                        </button>
                    </div>

                    {/* Select This Venue — saves to plan store and goes to catering step */}
                    <button
                        onClick={() => onSelect && onSelect(venue)}
                        className="w-full py-2.5 bg-primary hover:bg-secondary text-white rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md"
                    >
                        Select This Venue →
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
