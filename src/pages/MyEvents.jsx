import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, ChevronRight, Plus } from 'lucide-react';
import { CardSkeleton } from '../components/ui/Skeleton';
import { useAuthStore } from '../store/auth.store';
import { getMyEvents } from '../services/planningService';

function statusClasses(status) {
    switch (status) {
        case 'confirmed': return 'bg-green-100 text-green-700';
        case 'pending': return 'bg-yellow-100 text-yellow-700';
        case 'completed': return 'bg-blue-100 text-blue-700';
        case 'draft':
        default: return 'bg-gray-100 text-gray-600';
    }
}

export default function MyEvents() {
    const user = useAuthStore(state => state.user);
    const [isLoading, setIsLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;
        async function load() {
            if (!user?.id) {
                setIsLoading(false);
                return;
            }
            const { events: data } = await getMyEvents(user.id);
            if (!cancelled) {
                setEvents(data || []);
                setIsLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [user?.id]);

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

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                </div>
            ) : events.length === 0 ? (
                <div className="bg-white border border-gray-100 p-12 rounded-3xl shadow-sm text-center">
                    <Calendar className="w-14 h-14 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-text-dark mb-2">No events yet</h3>
                    <p className="text-text-muted mb-6 max-w-md mx-auto">
                        Start planning your first event with AEVA. Use our AI-powered survey or build your own plan from scratch.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Link to="/survey" className="bg-primary text-white px-5 py-2.5 rounded-full font-semibold hover:bg-secondary transition-colors">
                            Start with AI
                        </Link>
                        <Link to="/plan/build" className="bg-white border-2 border-primary text-primary px-5 py-2.5 rounded-full font-semibold hover:bg-primary/5 transition-colors">
                            Build My Plan
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {events.map((evt, i) => {
                        const displayStatus = evt.booking?.status || evt.status || 'draft';
                        const venueName = evt.venue?.name || evt.city || 'Venue not yet selected';
                        return (
                            <motion.div
                                key={evt.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => navigate(`/events/${evt.id}`)}
                                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${statusClasses(displayStatus)}`}>
                                            {displayStatus}
                                        </span>
                                        <h3 className="text-2xl font-bold font-display text-text-dark">
                                            {evt.title || 'Untitled Event'}
                                        </h3>
                                        {evt.event_type && (
                                            <p className="text-xs text-text-muted uppercase tracking-wider mt-1">{evt.event_type}</p>
                                        )}
                                    </div>
                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2 text-text-muted text-sm">
                                        <Calendar className="w-4 h-4 text-primary" />
                                        {evt.event_date
                                            ? new Date(evt.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                            : 'Date TBD'}
                                    </div>
                                    <div className="flex items-center gap-2 text-text-muted text-sm">
                                        <MapPin className="w-4 h-4 text-secondary" />
                                        <span className="truncate">{venueName}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-text-muted text-sm col-span-2 border-t border-gray-100 pt-3 mt-1">
                                        <Users className="w-4 h-4 text-accent" />
                                        {evt.guest_count ? `${evt.guest_count} Guests` : 'Guest count not set'}
                                        {evt.booking?.total_amount ? (
                                            <span className="ml-auto font-semibold text-text-dark">
                                                {evt.booking.total_amount.toLocaleString()} EGP
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </motion.div>
    );
}
