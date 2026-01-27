import React, { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import MultiSelect from './MultiSelect';

const FilterSidebar = ({ onFilterChange, onApply, onReset }) => {
    const [filters, setFilters] = useState({
        search: '',
        tier: [],
        country: [],
        type: [],
        qualityScore: [0, 100],
        businessMatch: [0, 100],
        avgViews: [0, 10000000],
        estimatedCPM: [0, 1000],
        hasEmail: ''
    });

    const [isCollapsed, setIsCollapsed] = useState(false);

    const tierOptions = [
        { value: '1万以下', label: '< 10K' },
        { value: '1万-10万', label: '10K - 100K' },
        { value: '10万-50万', label: '100K - 500K' },
        { value: '50万+', label: '500K+' }
    ];

    const countryOptions = [
        { value: 'US', label: 'United States' },
        { value: 'UK', label: 'United Kingdom' },
        { value: 'CA', label: 'Canada' },
        { value: 'AU', label: 'Australia' },
        { value: 'DE', label: 'Germany' },
        { value: 'FR', label: 'France' }
    ];

    const typeOptions = [
        { value: 'Beauty', label: 'Beauty' },
        { value: 'Tech', label: 'Tech' },
        { value: 'Lifestyle', label: 'Lifestyle' },
        { value: 'Gaming', label: 'Gaming' },
        { value: 'Food', label: 'Food' }
    ];

    const handleChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange?.(newFilters);
    };

    const handleApply = () => {
        onApply?.(filters);
    };

    const handleReset = () => {
        const resetFilters = {
            search: '',
            tier: [],
            country: [],
            type: [],
            qualityScore: [0, 100],
            businessMatch: [0, 100],
            avgViews: [0, 10000000],
            estimatedCPM: [0, 1000],
            hasEmail: ''
        };
        setFilters(resetFilters);
        onReset?.(resetFilters);
    };

    if (isCollapsed) {
        return (
            <div className="w-16 bg-surface border-r border-border flex flex-col items-center py-6 gap-4">
                <button
                    onClick={() => setIsCollapsed(false)}
                    className="p-3 hover:bg-surface-secondary rounded-soft transition-colors"
                    title="Expand Filters"
                >
                    <SlidersHorizontal size={20} className="text-text-secondary" />
                </button>
            </div>
        );
    }

    return (
        <aside className="w-80 bg-surface border-r border-border flex flex-col h-full animate-slide-in">
            {/* Header */}
            <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <SlidersHorizontal size={20} className="text-primary" />
                        <h3 className="text-lg font-heading font-bold text-text-primary">Filters</h3>
                    </div>
                    <button
                        onClick={() => setIsCollapsed(true)}
                        className="p-2 hover:bg-surface-secondary rounded-lg transition-colors"
                        title="Collapse"
                    >
                        <X size={18} className="text-text-tertiary" />
                    </button>
                </div>

                {/* Search Input */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                    <input
                        type="text"
                        placeholder="Search influencers..."
                        value={filters.search}
                        onChange={(e) => handleChange('search', e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-surface-secondary border border-border rounded-soft text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>
            </div>

            {/* Filters Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Tier */}
                <div>
                    <label className="block text-sm font-bold text-text-primary mb-2">Follower Tier</label>
                    <MultiSelect
                        options={tierOptions}
                        value={filters.tier}
                        onChange={(value) => handleChange('tier', value)}
                        placeholder="Select tiers..."
                    />
                </div>

                {/* Country */}
                <div>
                    <label className="block text-sm font-bold text-text-primary mb-2">Country</label>
                    <MultiSelect
                        options={countryOptions}
                        value={filters.country}
                        onChange={(value) => handleChange('country', value)}
                        placeholder="Select countries..."
                    />
                </div>

                {/* Type */}
                <div>
                    <label className="block text-sm font-bold text-text-primary mb-2">Influencer Type</label>
                    <MultiSelect
                        options={typeOptions}
                        value={filters.type}
                        onChange={(value) => handleChange('type', value)}
                        placeholder="Select types..."
                    />
                </div>

                {/* Has Email */}
                <div>
                    <label className="block text-sm font-bold text-text-primary mb-2">Email Availability</label>
                    <select
                        value={filters.hasEmail}
                        onChange={(e) => handleChange('hasEmail', e.target.value)}
                        className="w-full px-4 py-2.5 bg-surface-secondary border border-border rounded-soft text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    >
                        <option value="">All</option>
                        <option value="yes">Has Email</option>
                        <option value="no">No Email</option>
                    </select>
                </div>

                {/* Quality Score Range */}
                <div>
                    <label className="block text-sm font-bold text-text-primary mb-2">
                        Quality Score: {filters.qualityScore[0]} - {filters.qualityScore[1]}
                    </label>
                    <div className="flex gap-3">
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={filters.qualityScore[0]}
                            onChange={(e) => handleChange('qualityScore', [parseInt(e.target.value), filters.qualityScore[1]])}
                            className="w-20 px-3 py-2 bg-surface-secondary border border-border rounded-soft text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                        <span className="text-text-tertiary">to</span>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={filters.qualityScore[1]}
                            onChange={(e) => handleChange('qualityScore', [filters.qualityScore[0], parseInt(e.target.value)])}
                            className="w-20 px-3 py-2 bg-surface-secondary border border-border rounded-soft text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>
                </div>

                {/* Business Match Range */}
                <div>
                    <label className="block text-sm font-bold text-text-primary mb-2">
                        Business Match: {filters.businessMatch[0]} - {filters.businessMatch[1]}
                    </label>
                    <div className="flex gap-3">
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={filters.businessMatch[0]}
                            onChange={(e) => handleChange('businessMatch', [parseInt(e.target.value), filters.businessMatch[1]])}
                            className="w-20 px-3 py-2 bg-surface-secondary border border-border rounded-soft text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                        <span className="text-text-tertiary">to</span>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={filters.businessMatch[1]}
                            onChange={(e) => handleChange('businessMatch', [filters.businessMatch[0], parseInt(e.target.value)])}
                            className="w-20 px-3 py-2 bg-surface-secondary border border-border rounded-soft text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-border bg-surface-secondary space-y-3">
                <button
                    onClick={handleApply}
                    className="w-full px-4 py-3 bg-primary hover:bg-primary-hover text-white rounded-soft-lg font-bold text-sm shadow-soft-md hover:shadow-glow-orange transition-all transform hover:-translate-y-0.5"
                >
                    Apply Filters
                </button>
                <button
                    onClick={handleReset}
                    className="w-full px-4 py-3 bg-surface border border-border hover:bg-surface-secondary text-text-secondary hover:text-text-primary rounded-soft-lg font-bold text-sm transition-all"
                >
                    Reset All
                </button>
            </div>
        </aside>
    );
};

export default FilterSidebar;
