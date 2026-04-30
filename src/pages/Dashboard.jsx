import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Activity, MapPin, Users, Calendar, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/auth.store';
import { CardSkeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -10 }
};

export default function Dashboard() {
    const user = useAuthStore(state => state.user);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* Welcome Banner */}
            <div style={{
                background: 'linear-gradient(135deg, var(--aeva-ink), var(--aeva-ink-strong))',
                borderRadius: 'var(--r-2xl)',
                padding: '32px',
                color: 'white',
                boxShadow: 'var(--shadow-lg)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '256px',
                    height: '256px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    filter: 'blur(48px)',
                    transform: 'translateX(50%) translateY(-50%)'
                }}></div>
                <div style={{ position: 'relative', zIndex: 10 }}>
                    <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Welcome back, {user?.display_name || 'User'}! 👋</h1>
                    <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '672px' }}>
                        You have 1 active event coming up. Ready to continue planning?
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '24px'
            }}>
                <QuickActionCard
                    to="/survey"
                    icon={<Sparkles style={{ color: 'var(--aeva-ink)' }} size={24} />}
                    title="Start with AI"
                    desc="Chat with AI or take our survey."
                />
                <QuickActionCard
                    to="/plan/build"
                    icon={<Activity style={{ color: 'var(--aeva-ink)' }} size={24} />}
                    title="Build My Plan"
                    desc="Choose every detail yourself."
                />
                <QuickActionCard
                    to="/recommendations"
                    icon={<MapPin style={{ color: 'var(--aeva-ink)' }} size={24} />}
                    title="Explore Venues"
                    desc="Browse top-rated locations."
                />
                <QuickActionCard
                    to="/my-events"
                    icon={<Calendar style={{ color: 'var(--aeva-ink)' }} size={24} />}
                    title="My Events"
                    desc="Manage your celebrations."
                />
            </div>

            {/* Stats Row */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '16px'
            }}>
                {isLoading ? (
                    <>
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                    </>
                ) : (
                    <>
                        <StatCard title="Total Events" value="3" />
                        <StatCard title="Active Events" value="1" />
                        <StatCard title="Invitations Sent" value="120" />
                        <StatCard title="RSVP Responses" value="85" />
                    </>
                )}
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '32px'
            }} className="lg:grid-cols-3">

                {/* Left Col (Main content) */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '32px'
                }} className="lg:col-span-2">
                    {/* Active Events */}
                    <section>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '16px'
                        }}>
                            <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--aeva-ink)' }}>Your Active Events</h2>
                            <Link to="/my-events" style={{
                                color: 'var(--aeva-ink)',
                                fontSize: '14px',
                                fontWeight: 600,
                                textDecoration: 'none',
                                transition: 'opacity 200ms'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                                View All
                            </Link>
                        </div>
                        <div style={{
                            background: 'var(--aeva-canvas)',
                            border: '1px solid var(--aeva-line)',
                            padding: '24px',
                            borderRadius: 'var(--r-xl)',
                            boxShadow: 'var(--shadow-sm)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'box-shadow 200ms'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                        onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    background: 'var(--aeva-paper-warm)',
                                    borderRadius: 'var(--r-lg)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Calendar style={{ color: 'var(--aeva-ink-soft)' }} />
                                </div>
                                <div>
                                    <h3 style={{ fontWeight: 700, fontSize: '18px', color: 'var(--aeva-ink)' }}>Emma & James Wedding</h3>
                                    <p style={{ fontSize: '14px', color: 'var(--aeva-ink-soft)' }}>Jan 20, 2026 • 60 Guests</p>
                                </div>
                            </div>
                            <span style={{
                                padding: '4px 12px',
                                background: 'var(--aeva-sage)',
                                color: 'var(--aeva-paper)',
                                borderRadius: 'var(--r-full)',
                                fontSize: '12px',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}>
                                Confirmed
                            </span>
                        </div>
                    </section>

                    {/* AI Banner */}
                    <section style={{
                        background: 'linear-gradient(135deg, var(--aeva-paper-warm), var(--aeva-paper-warm))',
                        border: '1px solid var(--aeva-line)',
                        padding: '24px',
                        borderRadius: 'var(--r-xl)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px'
                    }}>
                        <div>
                            <h3 style={{ fontWeight: 700, fontSize: '18px', color: 'var(--aeva-ink)', marginBottom: '4px' }}>Need help planning?</h3>
                            <p style={{ fontSize: '14px', color: 'var(--aeva-ink-soft)', maxWidth: '400px' }}>Our AI assistant can suggest vendors, organize schedules, and track your budget.</p>
                        </div>
                        <Button variant="primary" onClick={() => navigate('/dashboard', { state: { openChat: true } })} style={{ whiteSpace: 'nowrap' }}>
                            Open AI Chat
                        </Button>
                    </section>
                </div>

                {/* Right Col */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '32px'
                }}>
                    {/* Recent Activity */}
                    <section style={{
                        background: 'var(--aeva-canvas)',
                        border: '1px solid var(--aeva-line)',
                        padding: '24px',
                        borderRadius: 'var(--r-xl)',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--aeva-ink)', marginBottom: '24px' }}>Recent Activity</h2>
                        <div style={{
                            position: 'relative',
                            borderLeft: '2px solid var(--aeva-line)',
                            marginLeft: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '24px'
                        }}>
                            <ActivityItem icon={<CheckCircle2 className="w-4 h-4" style={{ color: 'var(--aeva-sage)' }} />} title="Venue Confirmed" time="2 days ago" desc="Kempinski Hotel booked" />
                            <ActivityItem icon={<Users className="w-4 h-4" style={{ color: 'var(--aeva-ink)' }} />} title="RSVP Received" time="4 days ago" desc="10 new responses added" />
                            <ActivityItem icon={<Calendar className="w-4 h-4" style={{ color: 'var(--aeva-ink)' }} />} title="Event Created" time="1 week ago" desc="Draft for Corporate Gala" />
                        </div>
                    </section>
                </div>
            </div>
        </motion.div>
    );
}

function QuickActionCard({ to, icon, title, desc }) {
    const [isHovering, setIsHovering] = React.useState(false);
    return (
        <Link to={to} style={{
            background: 'var(--aeva-canvas)',
            border: '1px solid var(--aeva-line)',
            padding: '24px',
            borderRadius: 'var(--r-2xl)',
            boxShadow: isHovering ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
            transition: 'all 300ms',
            transform: isHovering ? 'translateY(-4px)' : 'translateY(0)',
            display: 'block',
            textDecoration: 'none'
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}>
            <div style={{
                width: '48px',
                height: '48px',
                background: 'var(--aeva-paper)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                transform: isHovering ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 300ms'
            }}>
                {icon}
            </div>
            <h3 style={{ fontWeight: 700, fontSize: '18px', color: 'var(--aeva-ink)', marginBottom: '4px' }}>{title}</h3>
            <p style={{ fontSize: '14px', color: 'var(--aeva-ink-soft)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {desc} <ArrowRight size={12} style={{ opacity: isHovering ? 1 : 0, transition: 'opacity 300ms, transform 300ms', transform: isHovering ? 'translateX(0)' : 'translateX(-8px)' }} />
            </p>
        </Link>
    );
}

function StatCard({ title, value }) {
    return (
        <div style={{
            background: 'var(--aeva-canvas)',
            border: '1px solid var(--aeva-line)',
            padding: '20px',
            borderRadius: 'var(--r-2xl)',
            boxShadow: 'var(--shadow-sm)',
            transition: 'border-color 300ms'
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--aeva-ink)'}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--aeva-line)'}>
            <p style={{ fontSize: '14px', color: 'var(--aeva-ink-soft)', marginBottom: '4px' }}>{title}</p>
            <p style={{ fontSize: '32px', fontWeight: 700, color: 'var(--aeva-ink)' }}>{value}</p>
        </div>
    );
}

function StatCardSkeleton() {
    return (
        <div style={{
            background: 'var(--aeva-canvas)',
            border: '1px solid var(--aeva-line)',
            padding: '20px',
            borderRadius: 'var(--r-2xl)',
            boxShadow: 'var(--shadow-sm)'
        }}>
            <div style={{
                width: '96px',
                height: '16px',
                background: 'var(--aeva-paper)',
                borderRadius: 'var(--r-lg)',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                marginBottom: '8px'
            }}></div>
            <div style={{
                width: '64px',
                height: '32px',
                background: 'var(--aeva-paper)',
                borderRadius: 'var(--r-lg)',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}></div>
        </div>
    );
}

function ActivityItem({ icon, title, time, desc }) {
    return (
        <div style={{ position: 'relative', paddingLeft: '24px' }}>
            <span style={{
                position: 'absolute',
                left: '-11px',
                top: '4px',
                background: 'var(--aeva-canvas)',
                border: '1px solid var(--aeva-line)',
                padding: '4px',
                borderRadius: '50%',
                boxShadow: 'var(--shadow-sm)',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {icon}
            </span>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '4px'
            }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--aeva-ink)' }}>{title}</h4>
                <span style={{ fontSize: '12px', color: 'var(--aeva-ink-soft)' }}>{time}</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--aeva-ink-soft)' }}>{desc}</p>
        </div>
    );
}
