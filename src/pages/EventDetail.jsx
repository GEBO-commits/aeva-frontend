import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Users, MapPin, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Skeleton from '../components/ui/Skeleton';
import { getEventDetail, updateEvent } from '../services/planningService';

function statusClasses(status) {
    switch (status) {
        case 'confirmed': return 'bg-green-100 text-green-700';
        case 'pending': return 'bg-yellow-100 text-yellow-700';
        case 'completed': return 'bg-blue-100 text-blue-700';
        case 'draft':
        default: return 'bg-gray-100 text-gray-600';
    }
}

export default function EventDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [event, setEvent] = useState(null);
    const [loadError, setLoadError] = useState(null);
    const [completedTasks, setCompletedTasks] = useState(() => {
        const saved = localStorage.getItem(`aeva_checklist_${id}`);
        return saved ? JSON.parse(saved) : [];
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setIsLoading(true);
            const { event: data, error } = await getEventDetail(id);
            if (cancelled) return;
            if (error || !data) {
                setLoadError(error?.message || 'Event not found');
            } else {
                setEvent(data);
                setEditForm({
                    title: data.title || '',
                    event_date: data.event_date || '',
                    guest_count: data.guest_count || 0,
                    budget_max: data.budget_max || 0,
                });
            }
            setIsLoading(false);
        }
        load();
        return () => { cancelled = true; };
    }, [id]);

    useEffect(() => {
        if (id) localStorage.setItem(`aeva_checklist_${id}`, JSON.stringify(completedTasks));
    }, [completedTasks, id]);

    const toggleTask = (taskId) => {
        setCompletedTasks(prev =>
            prev.includes(taskId) ? prev.filter(x => x !== taskId) : [...prev, taskId]
        );
    };

    const handleSave = async () => {
        setIsSaving(true);
        const payload = {
            title: editForm.title,
            guest_count: Number(editForm.guest_count) || 0,
            budget_max: Number(editForm.budget_max) || 0,
        };
        if (editForm.event_date) payload.event_date = editForm.event_date;

        const { event: updated, error } = await updateEvent(id, payload);
        setIsSaving(false);
        if (error) {
            console.error('[EventDetail] Failed to update event:', error);
            return;
        }
        setEvent(prev => ({ ...prev, ...updated }));
        setIsEditing(false);
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                    <Skeleton className="w-24 h-6 rounded-full mb-3" />
                    <Skeleton className="w-2/3 h-10 rounded-xl mb-4" />
                    <Skeleton className="w-1/3 h-6 rounded-md mb-6" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                        <Skeleton className="w-full h-20 rounded-2xl" />
                        <Skeleton className="w-full h-20 rounded-2xl" />
                        <Skeleton className="w-full h-20 rounded-2xl" />
                        <Skeleton className="w-full h-20 rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (loadError || !event) {
        return (
            <div className="max-w-2xl mx-auto py-10">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 text-center">
                    <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-display font-bold text-text-dark mb-2">Event not found</h2>
                    <p className="text-text-muted mb-6">We couldn't load this event. It may have been removed or you may not have access.</p>
                    <button onClick={() => navigate('/my-events')} className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-secondary transition-colors">
                        Back to My Events
                    </button>
                </div>
            </div>
        );
    }

    const displayStatus = event.booking?.status || event.status || 'draft';
    const venueName = event.venue?.name || event.city || 'Venue not yet selected';
    const bookingTotal = event.booking?.total_amount;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-6 border-b pb-6">
                    <div className="flex-1">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${statusClasses(displayStatus)}`}>
                            {displayStatus}
                        </span>
                        {isEditing ? (
                            <input
                                type="text"
                                value={editForm.title}
                                onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                                className="text-4xl font-display font-bold text-text-dark w-full bg-transparent border-b-2 border-primary/30 focus:outline-none focus:border-primary"
                            />
                        ) : (
                            <h1 className="text-4xl font-display font-bold text-text-dark">{event.title || 'Untitled Event'}</h1>
                        )}
                        <p className="text-text-muted mt-2 capitalize">{event.event_type || 'event'}</p>
                    </div>
                    <button
                        onClick={() => {
                            if (isEditing) handleSave();
                            else setIsEditing(true);
                        }}
                        disabled={isSaving}
                        className={`px-6 py-2 rounded-full font-medium transition-colors ${isEditing ? 'bg-primary text-white hover:bg-secondary shadow-md' : 'bg-gray-100 hover:bg-gray-200 text-text-dark'} disabled:opacity-60`}
                    >
                        {isSaving ? 'Saving…' : (isEditing ? 'Save Changes' : 'Edit Details')}
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gray-50 p-4 rounded-2xl flex flex-col justify-center">
                        <span className="text-sm font-medium text-text-muted block mb-1">Date</span>
                        {isEditing ? (
                            <input type="date" value={editForm.event_date} onChange={e => setEditForm({ ...editForm, event_date: e.target.value })} className="font-bold text-text-dark text-sm bg-white border border-gray-200 rounded-lg px-2 py-1 w-full" />
                        ) : (
                            <span className="font-bold text-text-dark text-sm lg:text-lg flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                                {event.event_date
                                    ? new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                    : 'Not set'}
                            </span>
                        )}
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl flex flex-col justify-center">
                        <span className="text-sm font-medium text-text-muted block mb-1">Venue</span>
                        <span className="font-bold text-text-dark text-sm lg:text-lg flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-secondary flex-shrink-0" /> <span className="truncate">{venueName}</span>
                        </span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl flex flex-col justify-center">
                        <span className="text-sm font-medium text-text-muted block mb-1">Guests</span>
                        {isEditing ? (
                            <input type="number" value={editForm.guest_count} onChange={e => setEditForm({ ...editForm, guest_count: parseInt(e.target.value) || 0 })} className="font-bold text-text-dark text-sm bg-white border border-gray-200 rounded-lg px-2 py-1 w-full" />
                        ) : (
                            <span className="font-bold text-text-dark text-sm lg:text-lg flex items-center gap-2"><Users className="w-4 h-4 text-accent flex-shrink-0" /> {event.guest_count || '—'}</span>
                        )}
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl flex flex-col justify-center">
                        <span className="text-sm font-medium text-text-muted block mb-1">
                            {bookingTotal ? 'Booked Total' : 'Budget'}
                        </span>
                        {isEditing ? (
                            <input type="number" value={editForm.budget_max} onChange={e => setEditForm({ ...editForm, budget_max: Number(e.target.value) || 0 })} className="font-bold text-text-dark text-sm bg-white border border-gray-200 rounded-lg px-2 py-1 w-full" />
                        ) : (
                            <span className="font-bold text-text-dark text-sm lg:text-lg truncate w-full block">
                                {Number(bookingTotal || event.budget_max || 0).toLocaleString()} EGP
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-display font-bold text-text-dark mb-6">Planning Checklist</h2>
                            <div className="space-y-6">
                                {checklistData.map((section, sIndex) => (
                                    <div key={sIndex} className="space-y-3">
                                        <h3 className="font-bold text-lg text-text-dark flex items-center gap-2">
                                            {section.icon} {section.title}
                                        </h3>
                                        <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                                            {section.tasks.map((task, tIndex) => {
                                                const taskId = `${sIndex}-${tIndex}`;
                                                return (
                                                    <label key={tIndex} className="flex items-start gap-3 cursor-pointer group">
                                                        <div className="relative flex items-center justify-center mt-0.5">
                                                            <input
                                                                type="checkbox"
                                                                checked={completedTasks.includes(taskId)}
                                                                onChange={() => toggleTask(taskId)}
                                                                className="peer appearance-none w-5 h-5 rounded border-2 border-gray-300 checked:bg-primary checked:border-primary transition-colors cursor-pointer"
                                                            />
                                                            <CheckCircle className="w-3.5 h-3.5 text-white absolute inset-0 m-auto opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                                                        </div>
                                                        <span className={`transition-colors ${completedTasks.includes(taskId) ? 'text-gray-400 line-through' : 'text-text-dark group-hover:text-primary'}`}>
                                                            {task}
                                                        </span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xl font-bold font-display text-text-dark">Event Modules</h3>

                        {event.booking ? (
                            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                                <span className="font-bold text-text-dark block mb-1">Booking</span>
                                <span className="text-sm text-text-muted">Reference: {event.booking.id.slice(0, 8).toUpperCase()}</span>
                                <p className="text-sm mt-2">
                                    Status: <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${statusClasses(event.booking.status)}`}>{event.booking.status}</span>
                                </p>
                                {event.booking.total_amount ? (
                                    <p className="text-sm text-text-muted mt-2">
                                        Total: <span className="font-semibold text-text-dark">{event.booking.total_amount.toLocaleString()} EGP</span>
                                    </p>
                                ) : null}
                            </div>
                        ) : null}

                        <Link to="/invitations" className="group bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/30 flex items-center justify-between transition-all">
                            <div className="flex flex-col">
                                <span className="font-bold text-text-dark group-hover:text-primary transition-colors">Manage Invitations</span>
                                <span className="text-sm text-text-muted mt-1">Draft & Send RSVPs, Track stats</span>
                            </div>
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all transform group-hover:scale-110">
                                →
                            </div>
                        </Link>

                        <div className="group bg-gray-50 border border-gray-100 p-6 rounded-2xl flex items-center justify-between opacity-60">
                            <div className="flex flex-col text-left">
                                <span className="font-bold text-text-dark">Vendor Management</span>
                                <span className="text-sm text-text-muted mt-1 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Coming soon</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const checklistData = [
    {
        title: "Before You Start",
        icon: "🎯",
        tasks: [
            "Define event type (wedding / birthday / corporate)",
            "Set your total budget (in EGP)",
            "Choose a date and backup date",
            "Estimate guest count",
            "Decide indoor or outdoor"
        ]
    },
    {
        title: "Venue",
        icon: "🏛️",
        tasks: [
            "Search and shortlist 3 venues",
            "Check availability for your date",
            "Confirm capacity fits your guest count",
            "Visit the venue in person",
            "Review contract and payment terms",
            "Pay deposit to confirm booking"
        ]
    },
    {
        title: "Catering",
        icon: "🍽️",
        tasks: [
            "Decide menu style (buffet / plated / stations)",
            "Handle dietary restrictions (vegetarian, halal, etc.)",
            "Arrange cake if needed",
            "Confirm drinks and beverages",
            "Confirm number of waitstaff"
        ]
    },
    {
        title: "Decorations",
        icon: "🎨",
        tasks: [
            "Choose a theme and color palette",
            "Hire a decorator or DIY",
            "Order flowers / centerpieces",
            "Arrange lighting and candles",
            "Table setup and linens"
        ]
    },
    {
        title: "Vendors",
        icon: "📸",
        tasks: [
            "Book photographer",
            "Book videographer",
            "Book DJ or live band",
            "Arrange transportation if needed",
            "Book makeup artist (if wedding)"
        ]
    },
    {
        title: "Invitations",
        icon: "💌",
        tasks: [
            "Finalize guest list",
            "Send save-the-date (6-8 weeks before)",
            "Send formal invitations (4 weeks before)",
            "Track RSVPs",
            "Follow up with non-responders",
            "Share event location/directions"
        ]
    },
    {
        title: "Week Before",
        icon: "📋",
        tasks: [
            "Confirm all vendors and bookings",
            "Share timeline with everyone involved",
            "Prepare payment envelopes for vendors",
            "Assign roles to helpers/family",
            "Prepare emergency kit (safety pins, medicine, charger, etc.)"
        ]
    },
    {
        title: "Day Of",
        icon: "🎉",
        tasks: [
            "Arrive early to venue",
            "Supervise setup",
            "Brief all vendors on the schedule",
            "Designate a point-of-contact person",
            "Enjoy your event! 🥳"
        ]
    },
    {
        title: "After the Event",
        icon: "✅",
        tasks: [
            "Send thank-you messages to guests",
            "Pay remaining vendor balances",
            "Collect photos/videos from photographer",
            "Leave venue reviews",
            "Archive everything for memories"
        ]
    }
];
