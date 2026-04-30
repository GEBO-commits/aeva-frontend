import React from 'react';
import { motion } from 'framer-motion';
import { mockVenues } from '../../api/mock/venues.mock';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function ManageVenues() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'var(--aeva-ink)' }}>Manage Venues</h1>
                <button style={{
                    background: 'var(--aeva-ink)',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: 'var(--r-full)',
                    fontWeight: 700,
                    boxShadow: 'var(--shadow-md)',
                    transition: 'opacity 300ms',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                    <Plus size={16} /> Add Venue
                </button>
            </div>

            <div style={{
                background: 'var(--aeva-canvas)',
                borderRadius: 'var(--r-3xl)',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--aeva-line)',
                overflow: 'hidden'
            }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{
                                background: 'var(--aeva-paper)',
                                color: 'var(--aeva-ink-soft)',
                                fontSize: '14px',
                                borderBottom: '1px solid var(--aeva-line)'
                            }}>
                                <th style={{ padding: '16px', fontWeight: 600 }}>Venue Name</th>
                                <th style={{ padding: '16px', fontWeight: 600 }}>Location</th>
                                <th style={{ padding: '16px', fontWeight: 600 }}>Type</th>
                                <th style={{ padding: '16px', fontWeight: 600 }}>Price (EGP)</th>
                                <th style={{ padding: '16px', fontWeight: 600 }}>Capacity</th>
                                <th style={{ padding: '16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockVenues.map((v) => (
                                <tr key={v.id} style={{
                                    borderBottom: '1px solid var(--aeva-line)',
                                    transition: 'background-color 300ms'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--aeva-paper)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontWeight: 700, color: 'var(--aeva-ink)' }}>{v.name}</div>
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '14px', color: 'var(--aeva-ink-soft)' }}>{v.location}</td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{
                                            background: 'var(--aeva-paper-warm)',
                                            color: 'var(--aeva-ink)',
                                            padding: '4px 8px',
                                            borderRadius: 'var(--r-md)',
                                            fontSize: '12px',
                                            fontWeight: 700,
                                            textTransform: 'uppercase'
                                        }}>{v.type}</span>
                                    </td>
                                    <td style={{ padding: '16px', fontWeight: 500, color: 'var(--aeva-ink)' }}>{v.startingPrice.toLocaleString()}</td>
                                    <td style={{ padding: '16px', fontSize: '14px', color: 'var(--aeva-ink-soft)' }}>{v.minGuests} - {v.maxGuests}</td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <button style={{
                                            padding: '8px',
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'var(--aeva-ink-soft)',
                                            cursor: 'pointer',
                                            transition: 'color 300ms'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--aeva-ink)'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--aeva-ink-soft)'}><Edit2 size={16} /></button>
                                        <button style={{
                                            padding: '8px',
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'var(--aeva-ink-soft)',
                                            cursor: 'pointer',
                                            transition: 'color 300ms'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--aeva-ink-soft)'}><Trash2 size={16} /></button>
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
