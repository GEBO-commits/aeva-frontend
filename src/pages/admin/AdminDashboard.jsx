import React from 'react';
import { Link } from 'react-router-dom';
import { Users, MapPin, Calendar, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex justify-between items-center bg-gray-900 text-white p-8 rounded-3xl shadow-xl">
                <div>
                    <h1 className="text-3xl font-display font-bold">Admin Portal</h1>
                    <p className="text-gray-400 mt-2">Manage platform data, venues, and analyze system usage.</p>
                </div>
                <div className="hidden md:block">
                    <TrendingUp className="w-16 h-16 text-primary/50" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AdminCard title="Manage Venues" icon={<MapPin className="text-primary" />} val="24 Active" link="/admin/venues" />
                <AdminCard title="Analytics" icon={<TrendingUp className="text-secondary" />} val="View Stats" link="/admin/analytics" />
                <AdminCard title="User Events" icon={<Calendar className="text-accent" />} val="142 Total" link="#" />
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold font-display text-text-dark mb-6">Recent Platform Activity</h2>
                <div className="space-y-4">
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
    return (
        <Link to={link} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group block">
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="font-bold text-lg text-text-dark">{title}</h3>
            <p className="text-text-muted mt-1">{val}</p>
        </Link>
    );
}

function ActivityRow({ action, user, time }) {
    return (
        <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
            <div>
                <span className="font-medium text-text-dark block">{action}</span>
                <span className="text-sm text-text-muted">{user}</span>
            </div>
            <span className="text-sm text-gray-400">{time}</span>
        </div>
    );
}
