import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, ChevronRight, Plus } from 'lucide-react';
import { CardSkeleton } from '../components/ui/Skeleton';

const mockEvents = [
    {
        id: "e001",
        title: "Emma & James Wedding",
        type: "wedding",
        date: "2026-01-20",
        status: "confirmed",
        venueName: "Kempinski Hotel",
        guestCount: 60,
    },
    {
        id: "e002",
        title: "Tech Innovators Gala",
        type: "corporate",
        date: "2026-03-15",
        status: "draft",
        venueName: "Nile Ritz-Carlton",
        guestCount: 250,
    }
];

export default function MyEvents() {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    React.useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold text-text-dark">My Events</h1>
                    <p className="text-text-muted">Manage your upcoming and past events.</p>
                </div>
                <Link to="/survey" className="bg-primary hover:bg-secondary text-white px-5 py-2.5 rounded-full font-bold shadow-md transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" /> New Event
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading ? (
                    <>
                        <CardSkeleton />
                        <CardSkeleton />
                        <CardSkeleton />
                    </>
                ) : (
                    mockEvents.map((evt, i) => (
                        <motion.div
                            key={evt.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            onClick={() => navigate(`/events/${evt.id}`)}
                            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${evt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {evt.status}
                                    </span>
                                    <h3 className="text-2xl font-bold font-display text-text-dark">{evt.title}</h3>
                                </div>
                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                    <ChevronRight className="w-5 h-5" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 text-text-muted text-sm">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    {new Date(evt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                                <div className="flex items-center gap-2 text-text-muted text-sm">
                                    <MapPin className="w-4 h-4 text-secondary" />
                                    {evt.venueName}
                                </div>
                                <div className="flex items-center gap-2 text-text-muted text-sm col-span-2 border-t border-gray-100 pt-3 mt-1">
                                    <Users className="w-4 h-4 text-accent" />
                                    {evt.guestCount} Guests Invited
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
}
