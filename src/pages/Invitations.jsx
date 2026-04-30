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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
            }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'var(--aeva-ink)' }}>Manage Invitations</h1>
                    <p style={{ color: 'var(--aeva-ink-soft)', marginTop: '4px' }}>Design your invite and track live RSVPs for "Emma & James Wedding"</p>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    {isSent && <span style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: 'var(--aeva-sage)',
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        display: 'none'
                    }} className="sm:block">✅ Mass invites sent successfully!</span>}
                    <button
                        onClick={handleSend}
                        disabled={isSending || isSent}
                        style={{
                            color: 'white',
                            padding: '8px 24px',
                            borderRadius: 'var(--r-full)',
                            fontWeight: 700,
                            boxShadow: 'var(--shadow-md)',
                            transition: 'all 300ms',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            border: 'none',
                            cursor: isSending || isSent ? 'not-allowed' : 'pointer',
                            background: isSent ? 'var(--aeva-sage)' : 'var(--aeva-ink)',
                            opacity: (isSending || isSent) ? 0.8 : 1
                        }}
                    >
                        {isSending ? (
                            <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Sending...</>
                        ) : isSent ? (
                            <><CheckCircle2 size={16} /> Sent</>
                        ) : (
                            <><Send size={16} /> Send Mass Invite</>
                        )}
                    </button>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '32px'
            }} className="lg:grid-cols-2">

                {/* Left: Settings */}
                <div style={{
                    background: 'var(--aeva-canvas)',
                    padding: '32px',
                    borderRadius: 'var(--r-3xl)',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--aeva-line)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px'
                }}>
                    <h2 style={{
                        fontSize: '20px',
                        fontWeight: 700,
                        color: 'var(--aeva-ink)',
                        borderBottom: '1px solid var(--aeva-line)',
                        paddingBottom: '16px'
                    }}>Invitation Settings</h2>

                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: 500,
                            marginBottom: '8px',
                            color: 'var(--aeva-ink-soft)'
                        }}>Personal Message</label>
                        <textarea
                            rows={4}
                            value={inviteText}
                            onChange={(e) => setInviteText(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: 'var(--r-xl)',
                                border: '1px solid var(--aeva-line)',
                                outline: 'none',
                                fontFamily: 'inherit',
                                color: 'var(--aeva-ink)',
                                resize: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '16px'
                    }}>
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: 500,
                                marginBottom: '8px',
                                color: 'var(--aeva-ink-soft)'
                            }}>Guest Limit</label>
                            <input type="number" defaultValue={2} style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: 'var(--r-xl)',
                                border: '1px solid var(--aeva-line)',
                                outline: 'none',
                                color: 'var(--aeva-ink)',
                                boxSizing: 'border-box'
                            }} />
                        </div>
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: 500,
                                marginBottom: '8px',
                                color: 'var(--aeva-ink-soft)'
                            }}>Theme Color</label>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                {['#6B3FF3', '#FF6B6B', '#10B981', '#F59E0B', '#1A1A2E'].map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setThemeColor(color)}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            border: themeColor === color ? '2px solid var(--aeva-ink)' : '2px solid transparent',
                                            backgroundColor: color,
                                            cursor: 'pointer',
                                            transition: 'transform 300ms',
                                            transform: themeColor === color ? 'scale(1.1)' : 'scale(1)'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={{
                        paddingTop: '16px',
                        borderTop: '1px solid var(--aeva-line)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                    }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: 'var(--aeva-ink)'
                        }}>Share Link</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input readOnly value="https://aeva.app/rsvp/abc123xz" style={{
                                flex: 1,
                                background: 'var(--aeva-paper)',
                                padding: '12px',
                                borderRadius: 'var(--r-xl)',
                                border: '1px solid var(--aeva-line)',
                                fontSize: '14px',
                                color: 'var(--aeva-ink-soft)',
                                boxSizing: 'border-box'
                            }} />
                            <button
                                onClick={handleCopy}
                                style={{
                                    padding: '12px',
                                    borderRadius: 'var(--r-xl)',
                                    transition: 'all 300ms',
                                    fontWeight: 500,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    background: isCopied ? 'var(--aeva-sage)' : 'var(--aeva-paper)',
                                    color: isCopied ? 'var(--aeva-paper)' : 'var(--aeva-ink)'
                                }}
                            >
                                {isCopied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                                {isCopied ? 'Copied! ✅' : 'Copy'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Preview */}
                <div style={{
                    background: 'var(--aeva-paper)',
                    padding: '32px',
                    borderRadius: 'var(--r-3xl)',
                    border: '1px solid var(--aeva-line)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '500px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Subtle background element tied to theme */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '256px',
                        height: '256px',
                        borderRadius: '50%',
                        filter: 'blur(48px)',
                        opacity: 0.2,
                        transform: 'translateX(33%) translateY(-33%)',
                        backgroundColor: themeColor
                    }}></div>

                    <div style={{
                        background: 'var(--aeva-canvas)',
                        width: '100%',
                        maxWidth: '448px',
                        borderRadius: 'var(--r-2xl)',
                        boxShadow: 'var(--shadow-2xl)',
                        overflow: 'hidden',
                        position: 'relative',
                        zIndex: 10
                    }}>
                        <div style={{
                            height: '128px',
                            padding: '24px',
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            position: 'relative',
                            backgroundColor: themeColor
                        }}>
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'rgba(0,0,0,0.1)'
                            }}></div>
                            {isEditingTitle ? (
                                <input
                                    autoFocus
                                    value={tempTitle}
                                    onChange={(e) => setTempTitle(e.target.value)}
                                    onBlur={saveTitle}
                                    onKeyDown={(e) => e.key === 'Enter' && saveTitle()}
                                    style={{
                                        fontSize: '32px',
                                        fontWeight: 700,
                                        textAlign: 'center',
                                        background: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        outline: 'none',
                                        borderBottom: '2px solid rgba(255,255,255,0.5)',
                                        position: 'relative',
                                        zIndex: 10,
                                        width: '75%',
                                        padding: '8px',
                                        fontFamily: 'inherit'
                                    }}
                                />
                            ) : (
                                <h3
                                    onClick={() => { setIsEditingTitle(true); setTempTitle(planTitle); }}
                                    style={{
                                        fontSize: '32px',
                                        fontWeight: 700,
                                        color: 'white',
                                        position: 'relative',
                                        zIndex: 10,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        width: '100%',
                                        marginTop: 'auto'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.querySelector('svg')?.style?.setProperty('opacity', '1')}
                                    onMouseLeave={(e) => e.currentTarget.querySelector('svg')?.style?.setProperty('opacity', '0')}
                                >
                                    {planTitle}
                                    <Pencil size={20} style={{ opacity: 0, transition: 'opacity 300ms', flexShrink: 0 }} />
                                </h3>
                            )}
                        </div>
                        <div style={{
                            padding: '32px',
                            textAlign: 'center',
                            background: '#fafafa'
                        }}>
                            <p style={{
                                color: 'var(--aeva-ink)',
                                fontWeight: 500,
                                fontStyle: 'italic',
                                marginBottom: '24px',
                                lineHeight: 1.6
                            }}>
                                "{inviteText}"
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                                <div style={{
                                    background: 'var(--aeva-canvas)',
                                    padding: '12px',
                                    borderRadius: 'var(--r-xl)',
                                    boxShadow: 'var(--shadow-sm)',
                                    fontSize: '14px'
                                }}><span style={{ color: 'var(--aeva-ink-soft)', fontWeight: 500 }}>When:</span> Jan 20, 2026 @ 6:00 PM</div>
                                <div style={{
                                    background: 'var(--aeva-canvas)',
                                    padding: '12px',
                                    borderRadius: 'var(--r-xl)',
                                    boxShadow: 'var(--shadow-sm)',
                                    fontSize: '14px'
                                }}><span style={{ color: 'var(--aeva-ink-soft)', fontWeight: 500 }}>Where:</span> Kempinski Hotel, Cairo</div>
                            </div>
                            <button style={{
                                width: '100%',
                                color: 'white',
                                padding: '14px',
                                borderRadius: 'var(--r-xl)',
                                fontWeight: 700,
                                boxShadow: 'var(--shadow-md)',
                                border: 'none',
                                cursor: 'pointer',
                                backgroundColor: themeColor,
                                transition: 'box-shadow 300ms'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-lg)'}
                            onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}>
                                RSVP Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Analytics Section */}
            <div style={{
                marginTop: '48px',
                paddingTop: '32px',
                borderTop: '1px solid var(--aeva-line)'
            }}>
                <h2 style={{
                    fontSize: '24px',
                    fontWeight: 700,
                    marginBottom: '24px',
                    color: 'var(--aeva-ink)',
                    textAlign: 'center'
                }} className="md:text-left">RSVP Analytics</h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '16px',
                    marginBottom: '32px'
                }} className="md:grid-cols-4">
                    <StatBox icon={<Users />} label="Total Invited" value="120" />
                    <StatBox icon={<CheckCircle2 style={{ color: '#10B981' }} />} label="Attending" value="85" />
                    <StatBox icon={<XCircle style={{ color: '#EF4444' }} />} label="Declined" value="15" />
                    <StatBox icon={<HelpCircle style={{ color: '#F59E0B' }} />} label="Pending" value="20" />
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '32px'
                }} className="lg:grid-cols-2">
                    <div style={{
                        background: 'var(--aeva-canvas)',
                        padding: '24px',
                        borderRadius: 'var(--r-3xl)',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid var(--aeva-line)'
                    }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: 'var(--aeva-ink)' }}>Response Breakdown</h3>
                        <div style={{ height: '256px' }}>
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
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '24px',
                            marginTop: '16px'
                        }}>
                            {rsvpData.map(item => (
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
                                    <span style={{ color: 'var(--aeva-ink-soft)' }}>{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{
                        background: 'var(--aeva-canvas)',
                        padding: '24px',
                        borderRadius: 'var(--r-3xl)',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid var(--aeva-line)'
                    }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: 'var(--aeva-ink)' }}>Daily Responses (Last 5 Days)</h3>
                        <div style={{ height: '256px' }}>
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
        <div style={{
            background: 'var(--aeva-canvas)',
            padding: '20px',
            borderRadius: 'var(--r-2xl)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--aeva-line)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
        }}>
            <div style={{
                background: 'var(--aeva-paper)',
                padding: '12px',
                borderRadius: 'var(--r-xl)',
                color: 'var(--aeva-ink-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {icon}
            </div>
            <div>
                <p style={{ fontSize: '14px', color: 'var(--aeva-ink-soft)', marginBottom: '2px' }}>{label}</p>
                <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--aeva-ink)' }}>{value}</p>
            </div>
        </div>
    );
}
