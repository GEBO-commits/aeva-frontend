import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Users, Star, Check } from 'lucide-react';
import { mockVenues } from '../api/mock/venues.mock';
import Skeleton, { TextSkeleton } from '../components/ui/Skeleton';

export default function VenueDetail() {
    const { id } = useParams();
    const venue = mockVenues.find(v => v.id === id) || mockVenues[0];
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-8 pb-12">
                <Skeleton className="h-[400px] w-full max-w-7xl mx-auto rounded-[2rem]" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <Skeleton className="w-48 h-8 mb-4" />
                            <TextSkeleton lines={4} />
                        </div>
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <Skeleton className="w-56 h-8 mb-6" />
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-6 w-32" />)}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <Skeleton className="w-40 h-7 mb-6" />
                            <div className="space-y-4">
                                <Skeleton className="w-full h-8" />
                                <Skeleton className="w-full h-8" />
                            </div>
                            <Skeleton className="w-full h-12 rounded-xl mt-8" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="relative h-[400px] w-full max-w-7xl mx-auto rounded-[2rem] overflow-hidden shadow-2xl">
                <img src={venue.image} alt={venue.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full flex flex-col md:flex-row justify-between items-end gap-6 text-white">
                    <div>
                        <span className="bg-primary/90 text-white backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider shadow-sm mb-4 inline-block">{venue.type}</span>
                        <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight mb-2">{venue.name}</h1>
                        <div className="flex items-center gap-4 text-white/80 font-medium">
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {venue.location}</span>
                            <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-current" /> {venue.rating}</span>
                        </div>
                    </div>
                    <button className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-full font-bold shadow-xl transition-all transform hover:-translate-y-1 w-full md:w-auto shrink-0">
                        Book Venue
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-display font-bold text-text-dark mb-4">About this Venue</h2>
                        <p className="text-text-muted leading-relaxed text-lg">{venue.description}</p>
                    </section>

                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-display font-bold text-text-dark mb-6">Amenities & Features</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {venue.amenities.map(item => (
                                <div key={item} className="flex items-center gap-2 text-text-dark font-medium"><Check className="text-primary w-5 h-5" /> {item}</div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
                        <h3 className="text-xl font-bold font-display text-text-dark mb-6">Venue Snapshot</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between border-b pb-3"><span className="text-text-muted">Starting Price</span><span className="font-bold text-lg text-primary">{venue.startingPrice.toLocaleString()} EGP</span></div>
                            <div className="flex justify-between border-b pb-3"><span className="text-text-muted flex items-center gap-2"><Users className="w-4 h-4" /> Capacity</span><span className="font-bold text-text-dark">{venue.minGuests} - {venue.maxGuests}</span></div>
                        </div>
                        <Link to="/survey" className="mt-8 block w-full text-center border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-xl font-bold transition-all">
                            Start Planning Here
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
