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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '32px'
            }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'var(--aeva-ink)', marginBottom: '4px' }}>My Events</h1>
                    <p style={{ color: 'var(--aeva-ink-soft)' }}>Manage your upcoming and past events.</p>
                </div>
                <Link to="/survey" style={{
                    background: 'var(--aeva-ink)',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: 'var(--r-full)',
                    fontWeight: 700,
                    boxShadow: 'var(--shadow-md)',
                    transition: 'opacity 300ms',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                    <Plus size={16} /> New Event
                </Link>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '24px'
            }} className="md:grid-cols-2">
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
                            style={{
                                background: 'var(--aeva-canvas)',
                                padding: '24px',
                                borderRadius: 'var(--r-3xl)',
                                border: '1px solid var(--aeva-line)',
                                boxShadow: 'var(--shadow-sm)',
                                transition: 'box-shadow 300ms',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-xl)'}
                            onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
                        >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: '24px'
                            }}>
                                <div>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '4px 12px',
                                        borderRadius: 'var(--r-full)',
                                        fontSize: '12px',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        marginBottom: '8px',
                                        background: evt.status === 'confirmed' ? 'var(--aeva-sage)' : 'var(--aeva-paper-warm)',
                                        color: evt.status === 'confirmed' ? 'var(--aeva-paper)' : 'var(--aeva-ink)'
                                    }}>
                                        {evt.status}
                                    </span>
                                    <h3 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--aeva-ink)' }}>{evt.title}</h3>
                                </div>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    background: 'var(--aeva-paper)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'background-color 300ms, color 300ms'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--aeva-ink)';
                                    e.currentTarget.style.color = 'white';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'var(--aeva-paper)';
                                    e.currentTarget.style.color = 'inherit';
                                }}>
                                    <ChevronRight size={20} />
                                </div>
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '16px'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: 'var(--aeva-ink-soft)',
                                    fontSize: '14px'
                                }}>
                                    <Calendar size={16} style={{ color: 'var(--aeva-ink)' }} />
                                    {new Date(evt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: 'var(--aeva-ink-soft)',
                                    fontSize: '14px'
                                }}>
                                    <MapPin size={16} style={{ color: 'var(--aeva-ink)' }} />
                                    {evt.venueName}
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: 'var(--aeva-ink-soft)',
                                    fontSize: '14px',
                                    gridColumn: '1 / -1',
                                    borderTop: '1px solid var(--aeva-line)',
                                    paddingTop: '12px',
                                    marginTop: '4px'
                                }}>
                                    <Users size={16} style={{ color: 'var(--aeva-ink)' }} />
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
