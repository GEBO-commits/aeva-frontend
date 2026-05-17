import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Activity, MapPin, Users, Calendar, CheckCircle2, CreditCard, FileText } from 'lucide-react';
import { useAuthStore } from '../store/auth.store';
import { getMyEvents } from '../services/planningService';

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -10 }
};

function formatDate(d) {
    if (!d) return null;
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function relativeTime(d) {
    if (!d) return '';
    const diff = Date.now() - new Date(d).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'today';
    if (days === 1) return '1 day ago';
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
}

export default function Dashboard() {
    const user = useAuthStore(state => state.user);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [events, setEvents] = useState([]);

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

    const today = new Date().toISOString().slice(0, 10);
    const upcoming = events.filter(e => e.event_date && e.event_date >= today);
    const bookingsConfirmed = events.filter(e => e.booking).length;
    const totalSpent = events.reduce((sum, e) => sum + (e.booking?.total_amount || 0), 0);

    const recentActivity = [...events]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 3);

    return (
        <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">

            <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-display font-bold mb-2">Welcome back, {user?.display_name || 'User'}! 👋</h1>
                    <p className="text-primary-foreground/80 max-w-xl">
                        {upcoming.length > 0
                            ? `You have ${upcoming.length} upcoming event${upcoming.length > 1 ? 's' : ''}. Ready to continue planning?`
                            : "You don't have any upcoming events yet. Start planning your first celebration!"}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <QuickActionCard to="/survey" icon={<Sparkles className="text-secondary" size={24} />} title="Start with AI" desc="Chat with AI or take our survey." />
                <QuickActionCard to="/plan/build" icon={<Activity className="text-orange-500" size={24} />} title="Build My Plan" desc="Choose every detail yourself." />
                <QuickActionCard to="/recommendations" icon={<MapPin className="text-accent" size={24} />} title="Explore Venues" desc="Browse top-rated locations." />
                <QuickActionCard to="/my-events" icon={<Calendar className="text-primary" size={24} />} title="My Events" desc="Manage your celebrations." />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {isLoading ? (
                    <>
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                    </>
                ) : (
                    <>
                        <StatCard title="Total Events" value={events.length} />
                        <StatCard title="Upcoming" value={upcoming.length} />
                        <StatCard title="Bookings" value={bookingsConfirmed} />
                        <StatCard title="Total Spent" value={`${totalSpent.toLocaleString()} EGP`} />
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="mb-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                            <div>
                                <h1 className="text-4xl font-display font-bold text-text-dark flex items-center gap-3">
                                    Your Dashboard <Sparkles className="text-primary w-8 h-8" />
                                </h1>
                                <p className="text-text-muted mt-2 text-lg">Overview of your events and activities.</p>
                            </div>
                            <Link to="/plan/build" className="flex flex-col items-end group">
                                <span className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1 group-hover:text-primary transition-colors text-right">Want to build your own plan?</span>
                                <div className="bg-white border-2 border-primary/20 px-6 py-3 rounded-2xl font-bold text-primary flex items-center gap-2 group-hover:border-primary group-hover:bg-primary/5 transition-all shadow-sm">
                                    Click here to Start Planning →
                                </div>
                            </Link>
                        </div>
                    </div>

                    <section>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-display font-bold text-text-dark">Your Upcoming Events</h2>
                            <Link to="/my-events" className="text-primary text-sm font-semibold hover:underline">View All</Link>
                        </div>
                        {isLoading ? (
                            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm animate-pulse h-24" />
                        ) : upcoming.length === 0 ? (
                            <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm text-center">
                                <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                <p className="text-text-muted mb-4">No upcoming events yet.</p>
                                <Link to="/survey" className="inline-block bg-primary text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-secondary transition-colors">
                                    Plan your first event
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {upcoming.slice(0, 3).map(evt => (
                                    <div
                                        key={evt.id}
                                        onClick={() => navigate(`/events/${evt.id}`)}
                                        className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                                                <Calendar className="text-text-muted" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-text-dark">{evt.title || 'Untitled Event'}</h3>
                                                <p className="text-sm text-text-muted">
                                                    {formatDate(evt.event_date)}
                                                    {evt.guest_count ? ` • ${evt.guest_count} Guests` : ''}
                                                    {evt.venue?.name ? ` • ${evt.venue.name}` : ''}
                                                </p>
                                            </div>
                                        </div>
                                        <StatusBadge status={evt.booking?.status || evt.status} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-purple-100 p-6 rounded-2xl flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-lg text-primary mb-1">Need help planning?</h3>
                            <p className="text-sm text-text-muted max-w-sm">Our AI assistant can suggest vendors, organize schedules, and track your budget.</p>
                        </div>
                        <button
                            onClick={() => navigate('/dashboard', { state: { openChat: true } })}
                            className="bg-primary text-white px-5 py-2.5 rounded-full font-semibold shadow-md hover:bg-secondary transition-colors shrink-0"
                        >
                            Open AI Chat
                        </button>
                    </section>
                </div>

                <div className="space-y-8">
                    <section className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                        <h2 className="text-xl font-display font-bold text-text-dark mb-6">Recent Activity</h2>
                        {isLoading ? (
                            <div className="space-y-4">
                                <div className="h-4 bg-gray-100 rounded animate-pulse" />
                                <div className="h-4 bg-gray-100 rounded animate-pulse" />
                                <div className="h-4 bg-gray-100 rounded animate-pulse" />
                            </div>
                        ) : recentActivity.length === 0 ? (
                            <p className="text-sm text-text-muted">No activity yet. Plan an event to see updates here.</p>
                        ) : (
                            <div className="relative border-l border-gray-200 ml-3 space-y-6">
                                {recentActivity.map(evt => (
                                    <React.Fragment key={evt.id}>
                                        {evt.booking && (
                                            <ActivityItem
                                                icon={<CreditCard className="w-4 h-4 text-green-500" />}
                                                title={evt.booking.status === 'confirmed' ? 'Booking Confirmed' : 'Booking Created'}
                                                time={relativeTime(evt.booking.created_at)}
                                                desc={`${evt.title || 'Event'} • ${(evt.booking.total_amount || 0).toLocaleString()} EGP`}
                                            />
                                        )}
                                        <ActivityItem
                                            icon={<FileText className="w-4 h-4 text-primary" />}
                                            title="Event Created"
                                            time={relativeTime(evt.created_at)}
                                            desc={evt.title || 'Untitled event'}
                                        />
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </motion.div>
    );
}

function StatusBadge({ status }) {
    const map = {
        confirmed: 'bg-green-100 text-green-700',
        pending: 'bg-yellow-100 text-yellow-700',
        draft: 'bg-gray-100 text-gray-600',
        completed: 'bg-blue-100 text-blue-700',
    };
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${map[status] || 'bg-gray-100 text-gray-600'}`}>
            {status || 'draft'}
        </span>
    );
}

function QuickActionCard({ to, icon, title, desc }) {
    return (
        <Link to={to} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="font-bold text-lg text-text-dark mb-1">{title}</h3>
            <p className="text-sm text-text-muted flex items-center gap-1">
                {desc} <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-2 group-hover:translate-x-0" />
            </p>
        </Link>
    );
}

function StatCard({ title, value }) {
    return (
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:border-primary/20 transition-colors">
            <p className="text-sm text-text-muted mb-1">{title}</p>
            <p className="text-3xl font-display font-bold text-text-dark">{value}</p>
        </div>
    );
}

function StatCardSkeleton() {
    return (
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
    );
}

function ActivityItem({ icon, title, time, desc }) {
    return (
        <div className="relative pl-6">
            <span className="absolute -left-[11px] top-1 bg-white border border-gray-200 p-1 rounded-full shadow-sm z-10">
                {icon}
            </span>
            <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm font-bold text-text-dark">{title}</h4>
                <span className="text-xs text-gray-400">{time}</span>
            </div>
            <p className="text-xs text-text-muted">{desc}</p>
        </div>
    );
}
