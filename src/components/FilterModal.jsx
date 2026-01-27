import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import MultiSelect from './MultiSelect';

const FilterModal = ({ isOpen, onClose, filters: initialFilters, onApply, onReset }) => {
    const [filters, setFilters] = useState(initialFilters);

    useEffect(() => {
        if (isOpen) {
            setFilters(initialFilters);
        }
    }, [isOpen, initialFilters]);

    if (!isOpen) return null;

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
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleApply = () => {
        onApply?.(filters);
        onClose();
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
            engagementRate: [0, 100]
        };
        setFilters(resetFilters);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div
                className="bg-surface w-full max-w-2xl rounded-soft-2xl shadow-soft-xl overflow-hidden flex flex-col max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-border flex items-center justify-between bg-surface">
                    <h2 className="text-xl font-heading font-bold text-text-primary">筛选红人</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-surface-secondary rounded-full text-text-tertiary hover:text-text-primary transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                        <input
                            type="text"
                            placeholder="搜索红人名称、用户名或关键词..."
                            value={filters.search}
                            onChange={(e) => handleChange('search', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-surface-secondary border border-border rounded-soft-lg text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Tier */}
                        <div>
                            <label className="block text-sm font-bold text-text-primary mb-2">粉丝等级</label>
                            <MultiSelect
                                options={tierOptions}
                                value={filters.tier}
                                onChange={(value) => handleChange('tier', value)}
                                placeholder="选择等级..."
                            />
                        </div>

                        {/* Country */}
                        <div>
                            <label className="block text-sm font-bold text-text-primary mb-2">国家</label>
                            <MultiSelect
                                options={countryOptions}
                                value={filters.country}
                                onChange={(value) => handleChange('country', value)}
                                placeholder="选择国家..."
                            />
                        </div>

                        {/* Type */}
                        <div>
                            <label className="block text-sm font-bold text-text-primary mb-2">红人类型</label>
                            <MultiSelect
                                options={typeOptions}
                                value={filters.type}
                                onChange={(value) => handleChange('type', value)}
                                placeholder="选择类型..."
                            />
                        </div>


                    </div>

                    {/* Ranges Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-border-subtle">
                        {/* Quality Score Range */}
                        <div>
                            <label className="block text-sm font-bold text-text-primary mb-2">
                                质量分数: {filters.qualityScore[0]} - {filters.qualityScore[1]}
                            </label>
                            <div className="flex gap-3 items-center">
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={filters.qualityScore[0]}
                                    onChange={(e) => handleChange('qualityScore', [parseInt(e.target.value) || 0, filters.qualityScore[1]])}
                                    className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-soft text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                                <span className="text-text-tertiary font-medium">-</span>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={filters.qualityScore[1]}
                                    onChange={(e) => handleChange('qualityScore', [filters.qualityScore[0], parseInt(e.target.value) || 100])}
                                    className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-soft text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                        </div>

                        {/* Business Match Range */}
                        <div>
                            <label className="block text-sm font-bold text-text-primary mb-2">
                                业务匹配: {filters.businessMatch[0]} - {filters.businessMatch[1]}
                            </label>
                            <div className="flex gap-3 items-center">
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={filters.businessMatch[0]}
                                    onChange={(e) => handleChange('businessMatch', [parseInt(e.target.value) || 0, filters.businessMatch[1]])}
                                    className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-soft text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                                <span className="text-text-tertiary font-medium">-</span>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={filters.businessMatch[1]}
                                    onChange={(e) => handleChange('businessMatch', [filters.businessMatch[0], parseInt(e.target.value) || 100])}
                                    className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-soft text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                        </div>
                    </div>
                    {/* Metrics Ranges Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-border-subtle">
                        {/* Avg Views Range */}
                        <div>
                            <label className="block text-sm font-bold text-text-primary mb-2">
                                平均观看: {(filters.avgViews[0] / 1000).toFixed(0)}K - {(filters.avgViews[1] / 1000).toFixed(0)}K
                            </label>
                            <div className="flex gap-3 items-center">
                                <input
                                    type="number"
                                    min="0"
                                    value={filters.avgViews[0]}
                                    onChange={(e) => handleChange('avgViews', [parseInt(e.target.value) || 0, filters.avgViews[1]])}
                                    className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-soft text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                                <span className="text-text-tertiary font-medium">-</span>
                                <input
                                    type="number"
                                    min="0"
                                    value={filters.avgViews[1]}
                                    onChange={(e) => handleChange('avgViews', [filters.avgViews[0], parseInt(e.target.value) || 10000000])}
                                    className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-soft text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                        </div>

                        {/* Estimated CPM Range */}
                        <div>
                            <label className="block text-sm font-bold text-text-primary mb-2">
                                预估 CPM ($): {filters.estimatedCPM[0]} - {filters.estimatedCPM[1]}
                            </label>
                            <div className="flex gap-3 items-center">
                                <input
                                    type="number"
                                    min="0"
                                    value={filters.estimatedCPM[0]}
                                    onChange={(e) => handleChange('estimatedCPM', [parseInt(e.target.value) || 0, filters.estimatedCPM[1]])}
                                    className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-soft text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                                <span className="text-text-tertiary font-medium">-</span>
                                <input
                                    type="number"
                                    min="0"
                                    value={filters.estimatedCPM[1]}
                                    onChange={(e) => handleChange('estimatedCPM', [filters.estimatedCPM[0], parseInt(e.target.value) || 1000])}
                                    className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-soft text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                        </div>

                        {/* Engagement Rate Range */}
                        <div>
                            <label className="block text-sm font-bold text-text-primary mb-2">
                                互动率 (%): {filters.engagementRate[0]}% - {filters.engagementRate[1]}%
                            </label>
                            <div className="flex gap-3 items-center">
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={filters.engagementRate[0]}
                                    onChange={(e) => handleChange('engagementRate', [parseInt(e.target.value) || 0, filters.engagementRate[1]])}
                                    className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-soft text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                                <span className="text-text-tertiary font-medium">-</span>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={filters.engagementRate[1]}
                                    onChange={(e) => handleChange('engagementRate', [filters.engagementRate[0], parseInt(e.target.value) || 100])}
                                    className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-soft text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-border bg-surface-secondary flex items-center justify-end gap-3">
                        <button
                            onClick={handleReset}
                            className="px-6 py-2.5 bg-surface border border-border hover:bg-white text-text-secondary hover:text-text-primary rounded-soft-lg font-bold text-sm transition-all shadow-sm"
                        >
                            重置
                        </button>
                        <button
                            onClick={handleApply}
                            className="px-8 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-soft-lg font-bold text-sm shadow-soft-md hover:shadow-glow-orange transition-all transform hover:-translate-y-0.5"
                        >
                            应用筛选
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterModal;
