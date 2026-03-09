import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Users, MapPin, CheckCircle, Clock } from 'lucide-react';
import Skeleton from '../components/ui/Skeleton';

export default function EventDetail() {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [completedTasks, setCompletedTasks] = useState(['0-0', '0-1']); // Mock some initial completion

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const toggleTask = (taskId) => {
        setCompletedTasks(prev =>
            prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
        );
    };

    // Mock specific event
    const [evt, setEvt] = useState({
        title: "Emma & James Wedding",
        type: "wedding",
        date: "2026-01-20",
        status: "confirmed",
        venueName: "Kempinski Hotel",
        guestCount: 60,
        budget: 120000
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(evt);

    const handleSave = () => {
        setEvt(editForm);
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

                    <Skeleton className="w-48 h-8 rounded-md mb-4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Skeleton className="w-full h-24 rounded-2xl" />
                        <Skeleton className="w-full h-24 rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-6 border-b pb-6">
                    <div>
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                            {evt.status}
                        </span>
                        <h1 className="text-4xl font-display font-bold text-text-dark">{evt.title}</h1>
                        <p className="text-text-muted mt-2 capitalize">{evt.type} Event</p>
                    </div>
                    <button
                        onClick={() => {
                            if (isEditing) {
                                handleSave();
                            } else {
                                setEditForm(evt);
                                setIsEditing(true);
                            }
                        }}
                        className={`px-6 py-2 rounded-full font-medium transition-colors ${isEditing ? 'bg-primary text-white hover:bg-secondary shadow-md' : 'bg-gray-100 hover:bg-gray-200 text-text-dark'}`}
                    >
                        {isEditing ? 'Save Changes' : 'Edit Details'}
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gray-50 p-4 rounded-2xl flex flex-col justify-center">
                        <span className="text-sm font-medium text-text-muted block mb-1">Date</span>
                        {isEditing ? (
                            <input type="date" value={editForm.date} onChange={e => setEditForm({ ...editForm, date: e.target.value })} className="font-bold text-text-dark text-sm bg-white border border-gray-200 rounded-lg px-2 py-1 w-full" />
                        ) : (
                            <span className="font-bold text-text-dark text-sm lg:text-lg flex items-center gap-2"><Calendar className="w-4 h-4 text-primary flex-shrink-0" /> {new Date(evt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        )}
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl flex flex-col justify-center">
                        <span className="text-sm font-medium text-text-muted block mb-1">Venue</span>
                        {isEditing ? (
                            <input type="text" value={editForm.venueName} onChange={e => setEditForm({ ...editForm, venueName: e.target.value })} className="font-bold text-text-dark text-sm bg-white border border-gray-200 rounded-lg px-2 py-1 w-full" />
                        ) : (
                            <span className="font-bold text-text-dark text-sm lg:text-lg flex items-center gap-2"><MapPin className="w-4 h-4 text-secondary flex-shrink-0" /> <span className="truncate">{evt.venueName}</span></span>
                        )}
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl flex flex-col justify-center">
                        <span className="text-sm font-medium text-text-muted block mb-1">Guests</span>
                        {isEditing ? (
                            <input type="number" value={editForm.guestCount} onChange={e => setEditForm({ ...editForm, guestCount: parseInt(e.target.value) || 0 })} className="font-bold text-text-dark text-sm bg-white border border-gray-200 rounded-lg px-2 py-1 w-full" />
                        ) : (
                            <span className="font-bold text-text-dark text-sm lg:text-lg flex items-center gap-2"><Users className="w-4 h-4 text-accent flex-shrink-0" /> {evt.guestCount}</span>
                        )}
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl flex flex-col justify-center">
                        <span className="text-sm font-medium text-text-muted block mb-1">Budget</span>
                        {isEditing ? (
                            <input type="number" value={editForm.budget} onChange={e => setEditForm({ ...editForm, budget: Number(e.target.value) || 0 })} className="font-bold text-text-dark text-sm bg-white border border-gray-200 rounded-lg px-2 py-1 w-full" />
                        ) : (
                            <span className="font-bold text-text-dark text-sm lg:text-lg truncate w-full block">{Number(evt.budget).toLocaleString()} EGP</span>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Planning Checklist */}
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

                    {/* Right: Modules */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold font-display text-text-dark">Event Modules</h3>

                        <Link to="/invitations" className="group bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/30 flex items-center justify-between transition-all block">
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
