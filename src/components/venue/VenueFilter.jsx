import React from 'react';

export default function VenueFilter({ filters, setFilters }) {

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div style={{
            background: 'var(--aeva-canvas)',
            padding: '24px',
            borderRadius: 'var(--r-2xl)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--aeva-line)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            position: 'sticky',
            top: '96px'
        }}>
            <div>
                <h3 style={{ fontWeight: 700, fontSize: '18px', marginBottom: '16px', color: 'var(--aeva-ink)' }}>Filter Venues</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--aeva-ink-soft)', marginBottom: '8px' }}>Venue Type</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: 'var(--aeva-ink)' }}>
                                <input type="radio" name="type" value="all" checked={filters.type === 'all'} onChange={handleChange} style={{ accentColor: 'var(--aeva-ink)', width: '16px', height: '16px', cursor: 'pointer' }} /> All
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: 'var(--aeva-ink)' }}>
                                <input type="radio" name="type" value="indoor" checked={filters.type === 'indoor'} onChange={handleChange} style={{ accentColor: 'var(--aeva-ink)', width: '16px', height: '16px', cursor: 'pointer' }} /> Indoor
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: 'var(--aeva-ink)' }}>
                                <input type="radio" name="type" value="outdoor" checked={filters.type === 'outdoor'} onChange={handleChange} style={{ accentColor: 'var(--aeva-ink)', width: '16px', height: '16px', cursor: 'pointer' }} /> Outdoor
                            </label>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--aeva-line)', paddingTop: '16px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--aeva-ink-soft)', marginBottom: '8px' }}>Max Price (EGP)</label>
                        <input
                            type="range"
                            name="maxPrice"
                            min="10000"
                            max="300000"
                            step="10000"
                            value={filters.maxPrice}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                accentColor: 'var(--aeva-ink)',
                                height: '8px',
                                background: 'var(--aeva-paper-warm)',
                                borderRadius: 'var(--r-lg)',
                                cursor: 'pointer'
                            }}
                        />
                        <div style={{ textAlign: 'right', fontSize: '14px', fontWeight: 700, color: 'var(--aeva-ink)', marginTop: '8px' }}>Up to {parseInt(filters.maxPrice).toLocaleString()} EGP</div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--aeva-line)', paddingTop: '16px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--aeva-ink-soft)', marginBottom: '8px' }}>Guest Capacity</label>
                        <select name="guests" value={filters.guests} onChange={handleChange} style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: 'var(--r-lg)',
                            border: '1px solid var(--aeva-line)',
                            outline: 'none',
                            fontSize: '14px',
                            color: 'var(--aeva-ink)',
                            background: 'var(--aeva-paper-warm)',
                            cursor: 'pointer',
                            transition: 'all 200ms'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = 'var(--aeva-ink)'}
                        onBlur={(e) => e.currentTarget.style.borderColor = 'var(--aeva-line)'}
                        >
                            <option value="any">Any Capacity</option>
                            <option value="100">Up to 100 Guests</option>
                            <option value="300">Up to 300 Guests</option>
                            <option value="500">Up to 500 Guests</option>
                        </select>
                    </div>
                </div>
            </div>

            <button
                onClick={() => setFilters({ type: 'all', maxPrice: '300000', guests: 'any' })}
                style={{
                    width: '100%',
                    padding: '8px',
                    background: 'var(--aeva-paper-warm)',
                    color: 'var(--aeva-ink-soft)',
                    borderRadius: 'var(--r-lg)',
                    transition: 'all 200ms',
                    fontWeight: 600,
                    fontSize: '14px',
                    border: '1px solid var(--aeva-line)',
                    cursor: 'pointer',
                    marginTop: 'auto'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--aeva-line)';
                    e.currentTarget.style.color = 'var(--aeva-ink)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--aeva-paper-warm)';
                    e.currentTarget.style.color = 'var(--aeva-ink-soft)';
                }}
            >
                Reset Filters
            </button>
        </div>
    );
}
