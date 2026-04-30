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
            <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={{
                    background: 'var(--aeva-canvas)',
                    padding: '32px',
                    borderRadius: 'var(--r-2xl)',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--aeva-line)'
                }}>
                    <Skeleton style={{ width: '96px', height: '24px', borderRadius: 'var(--r-full)', marginBottom: '12px' }} />
                    <Skeleton style={{ width: '66%', height: '40px', borderRadius: 'var(--r-xl)', marginBottom: '16px' }} />
                    <Skeleton style={{ width: '33%', height: '24px', borderRadius: 'var(--r-md)', marginBottom: '24px' }} />

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '24px',
                        marginBottom: '32px'
                    }} className="md:grid-cols-4">
                        <Skeleton style={{ width: '100%', height: '80px', borderRadius: 'var(--r-2xl)' }} />
                        <Skeleton style={{ width: '100%', height: '80px', borderRadius: 'var(--r-2xl)' }} />
                        <Skeleton style={{ width: '100%', height: '80px', borderRadius: 'var(--r-2xl)' }} />
                        <Skeleton style={{ width: '100%', height: '80px', borderRadius: 'var(--r-2xl)' }} />
                    </div>

                    <Skeleton style={{ width: '192px', height: '32px', borderRadius: 'var(--r-md)', marginBottom: '16px' }} />
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        gap: '16px'
                    }} className="md:grid-cols-2">
                        <Skeleton style={{ width: '100%', height: '96px', borderRadius: 'var(--r-2xl)' }} />
                        <Skeleton style={{ width: '100%', height: '96px', borderRadius: 'var(--r-2xl)' }} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{
                background: 'var(--aeva-canvas)',
                padding: '32px',
                borderRadius: 'var(--r-2xl)',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--aeva-line)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '24px',
                    borderBottom: '1px solid var(--aeva-line)',
                    paddingBottom: '24px'
                }}>
                    <div>
                        <span style={{
                            display: 'inline-block',
                            padding: '4px 12px',
                            background: 'var(--aeva-sage)',
                            color: 'var(--aeva-paper)',
                            borderRadius: 'var(--r-full)',
                            fontSize: '12px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '12px'
                        }}>
                            {evt.status}
                        </span>
                        <h1 style={{ fontSize: '36px', fontWeight: 700, color: 'var(--aeva-ink)' }}>{evt.title}</h1>
                        <p style={{ color: 'var(--aeva-ink-soft)', marginTop: '8px', textTransform: 'capitalize' }}>{evt.type} Event</p>
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
                        style={{
                            padding: '8px 24px',
                            borderRadius: 'var(--r-full)',
                            fontWeight: 500,
                            transition: 'all 300ms',
                            border: 'none',
                            cursor: 'pointer',
                            background: isEditing ? 'var(--aeva-ink)' : 'var(--aeva-paper)',
                            color: isEditing ? 'white' : 'var(--aeva-ink)',
                            boxShadow: isEditing ? 'var(--shadow-md)' : 'none'
                        }}
                    >
                        {isEditing ? 'Save Changes' : 'Edit Details'}
                    </button>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '24px',
                    marginBottom: '32px'
                }} className="md:grid-cols-4">
                    <div style={{
                        background: 'var(--aeva-paper)',
                        padding: '16px',
                        borderRadius: 'var(--r-2xl)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--aeva-ink-soft)', display: 'block', marginBottom: '4px' }}>Date</span>
                        {isEditing ? (
                            <input type="date" value={editForm.date} onChange={e => setEditForm({ ...editForm, date: e.target.value })} style={{
                                fontWeight: 700,
                                color: 'var(--aeva-ink)',
                                fontSize: '14px',
                                background: 'var(--aeva-canvas)',
                                border: '1px solid var(--aeva-line)',
                                borderRadius: 'var(--r-lg)',
                                padding: '8px',
                                width: '100%',
                                boxSizing: 'border-box'
                            }} />
                        ) : (
                            <span style={{ fontWeight: 700, color: 'var(--aeva-ink)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={16} style={{ color: 'var(--aeva-ink)' }} /> {new Date(evt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        )}
                    </div>
                    <div style={{
                        background: 'var(--aeva-paper)',
                        padding: '16px',
                        borderRadius: 'var(--r-2xl)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--aeva-ink-soft)', display: 'block', marginBottom: '4px' }}>Venue</span>
                        {isEditing ? (
                            <input type="text" value={editForm.venueName} onChange={e => setEditForm({ ...editForm, venueName: e.target.value })} style={{
                                fontWeight: 700,
                                color: 'var(--aeva-ink)',
                                fontSize: '14px',
                                background: 'var(--aeva-canvas)',
                                border: '1px solid var(--aeva-line)',
                                borderRadius: 'var(--r-lg)',
                                padding: '8px',
                                width: '100%',
                                boxSizing: 'border-box'
                            }} />
                        ) : (
                            <span style={{ fontWeight: 700, color: 'var(--aeva-ink)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}><MapPin size={16} style={{ color: 'var(--aeva-ink)', flexShrink: 0 }} /> <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{evt.venueName}</span></span>
                        )}
                    </div>
                    <div style={{
                        background: 'var(--aeva-paper)',
                        padding: '16px',
                        borderRadius: 'var(--r-2xl)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--aeva-ink-soft)', display: 'block', marginBottom: '4px' }}>Guests</span>
                        {isEditing ? (
                            <input type="number" value={editForm.guestCount} onChange={e => setEditForm({ ...editForm, guestCount: parseInt(e.target.value) || 0 })} style={{
                                fontWeight: 700,
                                color: 'var(--aeva-ink)',
                                fontSize: '14px',
                                background: 'var(--aeva-canvas)',
                                border: '1px solid var(--aeva-line)',
                                borderRadius: 'var(--r-lg)',
                                padding: '8px',
                                width: '100%',
                                boxSizing: 'border-box'
                            }} />
                        ) : (
                            <span style={{ fontWeight: 700, color: 'var(--aeva-ink)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={16} style={{ color: 'var(--aeva-ink)' }} /> {evt.guestCount}</span>
                        )}
                    </div>
                    <div style={{
                        background: 'var(--aeva-paper)',
                        padding: '16px',
                        borderRadius: 'var(--r-2xl)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--aeva-ink-soft)', display: 'block', marginBottom: '4px' }}>Budget</span>
                        {isEditing ? (
                            <input type="number" value={editForm.budget} onChange={e => setEditForm({ ...editForm, budget: Number(e.target.value) || 0 })} style={{
                                fontWeight: 700,
                                color: 'var(--aeva-ink)',
                                fontSize: '14px',
                                background: 'var(--aeva-canvas)',
                                border: '1px solid var(--aeva-line)',
                                borderRadius: 'var(--r-lg)',
                                padding: '8px',
                                width: '100%',
                                boxSizing: 'border-box'
                            }} />
                        ) : (
                            <span style={{ fontWeight: 700, color: 'var(--aeva-ink)', fontSize: '14px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%', display: 'block' }}>{Number(evt.budget).toLocaleString()} EGP</span>
                        )}
                    </div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '32px'
                }} className="lg:grid-cols-3">
                    {/* Left: Planning Checklist */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px'
                    }} className="lg:col-span-2">
                        <section style={{
                            background: 'var(--aeva-canvas)',
                            padding: '32px',
                            borderRadius: 'var(--r-2xl)',
                            boxShadow: 'var(--shadow-sm)',
                            border: '1px solid var(--aeva-line)'
                        }}>
                            <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--aeva-ink)', marginBottom: '24px' }}>Planning Checklist</h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                {checklistData.map((section, sIndex) => (
                                    <div key={sIndex} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <h3 style={{ fontWeight: 700, fontSize: '18px', color: 'var(--aeva-ink)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {section.icon} {section.title}
                                        </h3>
                                        <div style={{
                                            background: 'var(--aeva-paper)',
                                            borderRadius: 'var(--r-2xl)',
                                            padding: '16px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '12px'
                                        }}>
                                            {section.tasks.map((task, tIndex) => {
                                                const taskId = `${sIndex}-${tIndex}`;
                                                const isCompleted = completedTasks.includes(taskId);
                                                return (
                                                    <label key={tIndex} style={{
                                                        display: 'flex',
                                                        alignItems: 'flex-start',
                                                        gap: '12px',
                                                        cursor: 'pointer'
                                                    }}>
                                                        <div style={{
                                                            position: 'relative',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            width: '20px',
                                                            height: '20px',
                                                            marginTop: '2px',
                                                            flexShrink: 0
                                                        }}>
                                                            <input
                                                                type="checkbox"
                                                                checked={isCompleted}
                                                                onChange={() => toggleTask(taskId)}
                                                                style={{
                                                                    appearance: 'none',
                                                                    width: '20px',
                                                                    height: '20px',
                                                                    borderRadius: 'var(--r-md)',
                                                                    border: '2px solid var(--aeva-line)',
                                                                    background: isCompleted ? 'var(--aeva-ink)' : 'transparent',
                                                                    cursor: 'pointer',
                                                                    transition: 'all 300ms'
                                                                }}
                                                            />
                                                            {isCompleted && <CheckCircle size={14} style={{
                                                                color: 'white',
                                                                position: 'absolute',
                                                                pointerEvents: 'none'
                                                            }} />}
                                                        </div>
                                                        <span style={{
                                                            transition: 'all 300ms',
                                                            color: isCompleted ? 'var(--aeva-ink-soft)' : 'var(--aeva-ink)',
                                                            textDecoration: isCompleted ? 'line-through' : 'none'
                                                        }}>
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
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px'
                    }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--aeva-ink)' }}>Event Modules</h3>

                        <Link to="/invitations" style={{
                            background: 'var(--aeva-canvas)',
                            border: '1px solid var(--aeva-line)',
                            padding: '24px',
                            borderRadius: 'var(--r-2xl)',
                            boxShadow: 'var(--shadow-sm)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 300ms',
                            textDecoration: 'none',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                            e.currentTarget.style.borderColor = 'var(--aeva-ink)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                            e.currentTarget.style.borderColor = 'var(--aeva-line)';
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: 700, color: 'var(--aeva-ink)', transition: 'color 300ms' }} onMouseEnter={(e) => e.target.style.color = 'var(--aeva-ink)'} onMouseLeave={(e) => e.target.style.color = 'var(--aeva-ink)'}>Manage Invitations</span>
                                <span style={{ fontSize: '14px', color: 'var(--aeva-ink-soft)', marginTop: '4px' }}>Draft & Send RSVPs, Track stats</span>
                            </div>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                background: 'var(--aeva-paper)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--aeva-ink)',
                                transition: 'all 300ms',
                                transform: 'scale(1)'
                            }} onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--aeva-ink)';
                                e.currentTarget.style.color = 'white';
                                e.currentTarget.style.transform = 'scale(1.1)';
                            }} onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'var(--aeva-paper)';
                                e.currentTarget.style.color = 'var(--aeva-ink)';
                                e.currentTarget.style.transform = 'scale(1)';
                            }}>
                                →
                            </div>
                        </Link>

                        <div style={{
                            background: 'var(--aeva-paper)',
                            border: '1px solid var(--aeva-line)',
                            padding: '24px',
                            borderRadius: 'var(--r-2xl)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            opacity: 0.6
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                <span style={{ fontWeight: 700, color: 'var(--aeva-ink)' }}>Vendor Management</span>
                                <span style={{ fontSize: '14px', color: 'var(--aeva-ink-soft)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> Coming soon</span>
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
