import React from 'react';
import { Link } from 'react-router-dom';
import { Users, MapPin, Calendar, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--aeva-ink)',
                color: 'white',
                padding: '32px',
                borderRadius: 'var(--r-3xl)',
                boxShadow: 'var(--shadow-xl)'
            }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Admin Portal</h1>
                    <p style={{ color: 'rgba(255,255,255,0.7)' }}>Manage platform data, venues, and analyze system usage.</p>
                </div>
                <div style={{ display: 'none' }} className="md:block">
                    <TrendingUp size={64} style={{ color: 'rgba(255,255,255,0.3)' }} />
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '24px'
            }} className="md:grid-cols-3">
                <AdminCard title="Manage Venues" icon={<MapPin className="text-primary" />} val="24 Active" link="/admin/venues" />
                <AdminCard title="Analytics" icon={<TrendingUp className="text-secondary" />} val="View Stats" link="/admin/analytics" />
                <AdminCard title="User Events" icon={<Calendar className="text-accent" />} val="142 Total" link="#" />
            </div>

            <div style={{
                background: 'var(--aeva-canvas)',
                padding: '32px',
                borderRadius: 'var(--r-3xl)',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--aeva-line)'
            }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--aeva-ink)', marginBottom: '24px' }}>Recent Platform Activity</h2>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <ActivityRow action="New user Registration" user="emma@example.com" time="2 mins ago" />
                    <ActivityRow action="Event Created" user="james@example.com" time="15 mins ago" />
                    <ActivityRow action="Venue Booked" user="sarah@corp.com" time="1 hour ago" />
                    <ActivityRow action="Venue Added" user="Admin" time="3 hours ago" />
                </div>
            </div>
        </motion.div>
    );
}

function AdminCard({ title, icon, val, link }) {
    const [isHovering, setIsHovering] = React.useState(false);
    return (
        <Link to={link} style={{
            background: 'var(--aeva-canvas)',
            padding: '24px',
            borderRadius: 'var(--r-3xl)',
            border: '1px solid var(--aeva-line)',
            boxShadow: isHovering ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
            transition: 'box-shadow 300ms, transform 300ms',
            display: 'block',
            textDecoration: 'none',
            transform: isHovering ? 'scale(1.02)' : 'scale(1)'
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}>
            <div style={{
                width: '48px',
                height: '48px',
                background: 'var(--aeva-paper)',
                borderRadius: 'var(--r-xl)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                transform: isHovering ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 300ms'
            }}>
                {icon}
            </div>
            <h3 style={{ fontWeight: 700, fontSize: '18px', color: 'var(--aeva-ink)' }}>{title}</h3>
            <p style={{ color: 'var(--aeva-ink-soft)', marginTop: '4px' }}>{val}</p>
        </Link>
    );
}

function ActivityRow({ action, user, time }) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0',
            borderBottom: '1px solid var(--aeva-line)'
        }}>
            <div>
                <span style={{ fontWeight: 500, color: 'var(--aeva-ink)', display: 'block' }}>{action}</span>
                <span style={{ fontSize: '14px', color: 'var(--aeva-ink-soft)' }}>{user}</span>
            </div>
            <span style={{ fontSize: '14px', color: 'var(--aeva-ink-soft)' }}>{time}</span>
        </div>
    );
}
