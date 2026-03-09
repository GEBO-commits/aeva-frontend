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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div>
                <h1 className="text-3xl font-display font-bold text-text-dark">Platform Analytics</h1>
                <p className="text-text-muted mt-2">Insights on bookings and user trends.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bar Chart */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold font-display text-text-dark mb-6">Monthly Bookings</h2>
                    <div className="h-72">
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
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold font-display text-text-dark mb-6">Event Types Distribution</h2>
                    <div className="h-72">
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
                    <div className="flex justify-center gap-6 mt-4">
                        {eventTypesData.map(item => (
                            <div key={item.name} className="flex items-center gap-2 text-sm">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                <span className="text-text-dark font-medium">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
