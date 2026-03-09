import React from 'react';

export default function VenueFilter({ filters, setFilters }) {

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6 sticky top-24">
            <div>
                <h3 className="font-bold text-lg mb-4 text-text-dark">Filter Venues</h3>

                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">Venue Type</label>
                        <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-2 cursor-pointer text-sm">
                                <input type="radio" name="type" value="all" checked={filters.type === 'all'} onChange={handleChange} className="accent-primary w-4 h-4" /> All
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer text-sm">
                                <input type="radio" name="type" value="indoor" checked={filters.type === 'indoor'} onChange={handleChange} className="accent-primary w-4 h-4" /> Indoor
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer text-sm">
                                <input type="radio" name="type" value="outdoor" checked={filters.type === 'outdoor'} onChange={handleChange} className="accent-primary w-4 h-4" /> Outdoor
                            </label>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <label className="block text-sm font-medium text-text-muted mb-2">Max Price (EGP)</label>
                        <input
                            type="range"
                            name="maxPrice"
                            min="10000"
                            max="300000"
                            step="10000"
                            value={filters.maxPrice}
                            onChange={handleChange}
                            className="w-full accent-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="text-right text-sm font-bold text-text-dark mt-2">Up to {parseInt(filters.maxPrice).toLocaleString()} EGP</div>
                    </div>

                    <div className="border-t pt-4">
                        <label className="block text-sm font-medium text-text-muted mb-2">Guest Capacity</label>
                        <select name="guests" value={filters.guests} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary text-sm">
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
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-colors font-medium text-sm mt-auto"
            >
                Reset Filters
            </button>
        </div>
    );
}
