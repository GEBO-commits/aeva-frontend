import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Mail, Copy, Send, CheckCircle2, XCircle, HelpCircle, Users, Loader2, Pencil } from 'lucide-react';

const rsvpData = [
    { name: 'Attending', value: 85, color: '#10B981' }, // Green
    { name: 'Declined', value: 15, color: '#EF4444' }, // Red
    { name: 'Pending', value: 20, color: '#F59E0B' }   // Yellow
];

const dailyData = [
    { day: 'Mon', responses: 5 },
    { day: 'Tue', responses: 12 },
    { day: 'Wed', responses: 8 },
    { day: 'Thu', responses: 25 },
    { day: 'Fri', responses: 35 },
];

export default function Invitations() {
    const [inviteText, setInviteText] = useState('Join us for the most magical night of our lives as we celebrate our wedding!');
    const [themeColor, setThemeColor] = useState('#6B3FF3');

    // Bug 7: Copy
    const [isCopied, setIsCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText("https://aeva.app/rsvp/abc123xz");
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    // Bug 8: Mass Invite
    const [isSending, setIsSending] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const handleSend = () => {
        setIsSending(true);
        setIsSent(false);
        setTimeout(() => {
            setIsSending(false);
            setIsSent(true);
            setTimeout(() => setIsSent(false), 3000); // revert success msg
        }, 2000);
    };

    // Bug 9: Editable Title
    const [planTitle, setPlanTitle] = useState("Emma & James");
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [tempTitle, setTempTitle] = useState(planTitle);

    const saveTitle = () => {
        setPlanTitle(tempTitle || "Emma & James");
        setIsEditingTitle(false);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-display font-bold text-text-dark">Manage Invitations</h1>
                    <p className="text-text-muted mt-1">Design your invite and track live RSVPs for "Emma & James Wedding"</p>
                </div>
                <div className="flex items-center gap-3">
                    {isSent && <span className="text-sm font-bold text-green-600 animate-pulse hidden sm:block">✅ Mass invites sent successfully!</span>}
                    <button
                        onClick={handleSend}
                        disabled={isSending || isSent}
                        className={`text-white px-6 py-2 rounded-full font-bold shadow-md transition-all flex items-center gap-2 ${isSent ? 'bg-green-500' : 'bg-primary hover:bg-secondary'
                            } disabled:opacity-80`}
                    >
                        {isSending ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                        ) : isSent ? (
                            <><CheckCircle2 className="w-4 h-4" /> Sent</>
                        ) : (
                            <><Send className="w-4 h-4" /> Send Mass Invite</>
                        )}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left: Settings */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit space-y-6">
                    <h2 className="text-xl font-bold text-text-dark border-b pb-4">Invitation Settings</h2>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-text-muted">Personal Message</label>
                        <textarea
                            rows={4}
                            value={inviteText}
                            onChange={(e) => setInviteText(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-text-muted">Guest Limit</label>
                            <input type="number" defaultValue={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-text-muted">Theme Color</label>
                            <div className="flex gap-2 mt-1">
                                {['#6B3FF3', '#FF6B6B', '#10B981', '#F59E0B', '#1A1A2E'].map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setThemeColor(color)}
                                        className={`w-10 h-10 rounded-full border-2 transition-transform ${themeColor === color ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t flex flex-col gap-3">
                        <label className="block text-sm font-medium text-text-dark">Share Link</label>
                        <div className="flex gap-2">
                            <input readOnly value="https://aeva.app/rsvp/abc123xz" className="flex-1 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 text-sm text-text-muted" />
                            <button
                                onClick={handleCopy}
                                className={`px-4 py-3 rounded-xl transition-colors font-medium flex items-center gap-2 ${isCopied ? 'bg-green-100 text-green-700' : 'bg-gray-100 hover:bg-gray-200 text-text-dark'}`}
                            >
                                {isCopied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {isCopied ? 'Copied! ✅' : 'Copy'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Preview */}
                <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 flex items-center justify-center min-h-[500px] relative overflow-hidden">
                    {/* Subtle background element tied to theme */}
                    <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 transform translate-x-1/3 -translate-y-1/3" style={{ backgroundColor: themeColor }}></div>

                    <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden relative z-10">
                        <div className="h-32 p-6 flex items-end justify-center relative group" style={{ backgroundColor: themeColor }}>
                            <div className="absolute inset-0 bg-black/10"></div>
                            {isEditingTitle ? (
                                <input
                                    autoFocus
                                    value={tempTitle}
                                    onChange={(e) => setTempTitle(e.target.value)}
                                    onBlur={saveTitle}
                                    onKeyDown={(e) => e.key === 'Enter' && saveTitle()}
                                    className="text-3xl font-display font-bold text-center bg-white/20 text-white placeholder-white/70 outline-none border-b-2 border-white/50 focus:border-white relative z-10 w-3/4 px-2"
                                />
                            ) : (
                                <h3
                                    onClick={() => { setIsEditingTitle(true); setTempTitle(planTitle); }}
                                    className="text-3xl font-display font-bold text-white relative z-10 cursor-pointer flex items-center justify-center gap-2 w-full mt-auto"
                                >
                                    {planTitle}
                                    <Pencil className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                </h3>
                            )}
                        </div>
                        <div className="p-8 text-center bg-[#fafafa]">
                            <p className="text-text-dark font-medium italic mb-6 leading-relaxed">
                                "{inviteText}"
                            </p>
                            <div className="space-y-4 mb-8">
                                <div className="bg-white p-3 rounded-xl shadow-sm text-sm"><span className="text-text-muted font-medium">When:</span> Jan 20, 2026 @ 6:00 PM</div>
                                <div className="bg-white p-3 rounded-xl shadow-sm text-sm"><span className="text-text-muted font-medium">Where:</span> Kempinski Hotel, Cairo</div>
                            </div>
                            <button className="w-full text-white py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all" style={{ backgroundColor: themeColor }}>
                                RSVP Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Analytics Section */}
            <div className="mt-12 pt-8 border-t border-gray-100">
                <h2 className="text-2xl font-display font-bold mb-6 text-text-dark text-center md:text-left">RSVP Analytics</h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <StatBox icon={<Users />} label="Total Invited" value="120" />
                    <StatBox icon={<CheckCircle2 className="text-green-500" />} label="Attending" value="85" />
                    <StatBox icon={<XCircle className="text-red-500" />} label="Declined" value="15" />
                    <StatBox icon={<HelpCircle className="text-yellow-500" />} label="Pending" value="20" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold mb-4">Response Breakdown</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={rsvpData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {rsvpData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-6 mt-4">
                            {rsvpData.map(item => (
                                <div key={item.name} className="flex items-center gap-2 text-sm">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-text-muted">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold mb-4">Daily Responses (Last 5 Days)</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dailyData}>
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                    <YAxis hide />
                                    <Tooltip cursor={{ fill: '#F3F4F6' }} />
                                    <Bar dataKey="responses" fill="#6B3FF3" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function StatBox({ icon, label, value }) {
    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-gray-50 p-3 rounded-xl text-gray-400">
                {icon}
            </div>
            <div>
                <p className="text-sm text-text-muted">{label}</p>
                <p className="text-2xl font-bold text-text-dark">{value}</p>
            </div>
        </div>
    );
}
