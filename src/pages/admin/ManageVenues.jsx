import React from 'react';
import { motion } from 'framer-motion';
import { mockVenues } from '../../api/mock/venues.mock';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function ManageVenues() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-display font-bold text-text-dark">Manage Venues</h1>
                <button className="bg-primary hover:bg-secondary text-white px-5 py-2.5 rounded-full font-bold shadow-md transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Venue
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-text-muted text-sm border-b border-gray-200">
                                <th className="p-4 font-semibold">Venue Name</th>
                                <th className="p-4 font-semibold">Location</th>
                                <th className="p-4 font-semibold">Type</th>
                                <th className="p-4 font-semibold">Price (EGP)</th>
                                <th className="p-4 font-semibold">Capacity</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockVenues.map((v) => (
                                <tr key={v.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-text-dark">{v.name}</div>
                                    </td>
                                    <td className="p-4 text-sm text-text-muted">{v.location}</td>
                                    <td className="p-4">
                                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs uppercase font-bold">{v.type}</span>
                                    </td>
                                    <td className="p-4 font-medium text-text-dark">{v.startingPrice.toLocaleString()}</td>
                                    <td className="p-4 text-sm text-text-muted">{v.minGuests} - {v.maxGuests}</td>
                                    <td className="p-4 text-right">
                                        <button className="p-2 text-gray-400 hover:text-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                                        <button className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}
