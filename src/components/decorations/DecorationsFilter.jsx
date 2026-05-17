import React from 'react';

export default function DecorationsFilter({ filters, setFilters }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6 sticky top-24">
            <div>
                <h3 className="font-bold text-lg mb-4 text-text-dark">Filter Decorations</h3>

                <div className="flex flex-col gap-4">
                    <div className="border-b pb-4">
                        <label className="block text-sm font-medium text-text-muted mb-2">Max Price (EGP)</label>
                        <input
                            type="range"
                            name="maxPrice"
                            min="5000"
                            max="100000"
                            step="5000"
                            value={filters.maxPrice}
                            onChange={handleChange}
                            className="w-full accent-pink-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="text-right text-sm font-bold text-text-dark mt-2">Up to {parseInt(filters.maxPrice).toLocaleString()} EGP</div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">Rating</label>
                        <select name="rating" value={filters.rating} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-pink-500 text-sm">
                            <option value="all">All Ratings</option>
                            <option value="4">4+ Stars</option>
                            <option value="4.5">4.5+ Stars</option>
                        </select>
                    </div>
                </div>
            </div>

            <button
                onClick={() => setFilters({ maxPrice: '100000', rating: 'all' })}
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-colors font-medium text-sm mt-auto"
            >
                Reset Filters
            </button>
        </div>
    );
}
