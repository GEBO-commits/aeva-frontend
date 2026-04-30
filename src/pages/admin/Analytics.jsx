import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const bookingsData = [
    { month: 'Jan', bookings: 40 },
    { month: 'Feb', bookings: 30 },
    { month: 'Mar', bookings: 55 },
    { month: 'Apr', bookings: 45 },
    { month: 'May', bookings: 70 },
    { month: 'Jun', bookings: 65 },
];

const eventTypesData = [
    { name: 'Weddings', value: 45, color: '#6B3FF3' },
    { name: 'Corporate', value: 30, color: '#9B6CF7' },
    { name: 'Birthdays', value: 25, color: '#FF6B6B' },
];

export default function Analytics() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
                <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'var(--aeva-ink)', marginBottom: '8px' }}>Platform Analytics</h1>
                <p style={{ color: 'var(--aeva-ink-soft)' }}>Insights on bookings and user trends.</p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '32px'
            }} className="lg:grid-cols-2">
                {/* Bar Chart */}
                <div style={{
                    background: 'var(--aeva-canvas)',
                    padding: '32px',
                    borderRadius: 'var(--r-3xl)',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--aeva-line)'
                }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--aeva-ink)', marginBottom: '24px' }}>Monthly Bookings</h2>
                    <div style={{ height: '288px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={bookingsData}>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: '#f3f4f6' }} />
                                <Bar dataKey="bookings" fill="#6B3FF3" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart */}
                <div style={{
                    background: 'var(--aeva-canvas)',
                    padding: '32px',
                    borderRadius: 'var(--r-3xl)',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--aeva-line)'
                }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--aeva-ink)', marginBottom: '24px' }}>Event Types Distribution</h2>
                    <div style={{ height: '288px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={eventTypesData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    innerRadius={70}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {eventTypesData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '24px',
                        marginTop: '16px'
                    }}>
                        {eventTypesData.map(item => (
                            <div key={item.name} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '14px'
                            }}>
                                <div style={{
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    backgroundColor: item.color
                                }}></div>
                                <span style={{ color: 'var(--aeva-ink)', fontWeight: 500 }}>{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
