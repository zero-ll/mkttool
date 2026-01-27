import React, { useState, useMemo } from 'react';
import {
    Download,
    Search,
    Mail,
    MailX,
    Filter,
    Trash2,
    MoreHorizontal,
    CheckSquare,
    Square,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Send
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const Connections = () => {
    const { getConnectedInfluencers } = useApp();

    // State
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({
        search: '',
        hasEmail: 'all',
        sourceTask: 'all',
        addedBy: 'all'
    });

    // Mock Data (Extended for demo)
    const connectedInfluencers = useMemo(() => [
        {
            id: 'inf_001',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
            name: 'Beauty Guru Channel',
            handle: '@beautyguru',
            email: 'contact@beautyguru.com',
            estimatedPrice: '¥5,000-8,000',
            cpm: 8.5,
            qualityScore: 85,
            fromTasks: ['Q1 New Product Launch', 'Brand Awareness'],
            addedBy: 'Max User',
            addedAt: '2024-01-20'
        },
        {
            id: 'inf_002',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
            name: 'Tech Review Pro',
            handle: '@techreview',
            email: null,
            estimatedPrice: '¥12,000-18,000',
            cpm: 12.0,
            qualityScore: 72,
            fromTasks: ['Q1 New Product Launch'],
            addedBy: 'Max User',
            addedAt: '2024-01-22'
        },
        {
            id: 'inf_003',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
            name: 'Fashion Lifestyle',
            handle: '@fashionlife',
            email: 'hello@fashionlife.com',
            estimatedPrice: '¥25,000-35,000',
            cpm: 15.5,
            qualityScore: 55,
            fromTasks: ['Brand Awareness'],
            addedBy: 'Max User',
            addedAt: '2024-01-23'
        },
        {
            id: 'inf_004',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
            name: 'Gadget Zone',
            handle: '@gadgetzone',
            email: 'collab@gadgetzone.com',
            estimatedPrice: '¥8,000-12,000',
            cpm: 10.5,
            qualityScore: 78,
            fromTasks: ['Tech Review Campaign'],
            addedBy: 'Sarah Smith',
            addedAt: '2024-01-24'
        },
        {
            id: 'inf_005',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Annie',
            name: 'Cooking with Joy',
            handle: '@joycooks',
            email: null,
            estimatedPrice: '¥3,000-5,000',
            cpm: 6.2,
            qualityScore: 92,
            fromTasks: ['Kitchen Essentials'],
            addedBy: 'Max User',
            addedAt: '2024-01-25'
        }
    ], []);

    // Derived State
    const uniqueTasks = useMemo(() => [...new Set(connectedInfluencers.flatMap(inf => inf.fromTasks))], [connectedInfluencers]);
    const uniqueUsers = useMemo(() => [...new Set(connectedInfluencers.map(inf => inf.addedBy))], [connectedInfluencers]);

    const filteredData = useMemo(() => {
        return connectedInfluencers.filter(inf => {
            const matchesSearch = inf.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                inf.handle.toLowerCase().includes(filters.search.toLowerCase());
            const matchesEmail = filters.hasEmail === 'all' ? true :
                filters.hasEmail === 'yes' ? !!inf.email : !inf.email;
            const matchesTask = filters.sourceTask === 'all' ? true : inf.fromTasks.includes(filters.sourceTask);
            const matchesUser = filters.addedBy === 'all' ? true : inf.addedBy === filters.addedBy;

            return matchesSearch && matchesEmail && matchesTask && matchesUser;
        });
    }, [connectedInfluencers, filters]);

    // Export function
    const handleExport = () => {
        const csvContent = [
            ['Name', 'Handle', 'Email', 'Price', 'CPM', 'Quality Score', 'Source Tasks', 'Added By', 'Added At'].join(','),
            ...filteredData.map(inf => [
                inf.name,
                inf.handle,
                inf.email || 'N/A',
                inf.estimatedPrice,
                inf.cpm,
                inf.qualityScore,
                inf.fromTasks.join('; '),
                inf.addedBy,
                inf.addedAt
            ].join(','))
        ].join('\n');

        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `connections_export_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
        if (score >= 60) return 'text-orange-600 bg-orange-50 border-orange-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    return (
        <div className="min-h-screen bg-bg-secondary p-8 font-sans text-text-primary animate-fade-in">
            {/* Header */}
            <header className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-text-primary">红人建联</h1>
                        <p className="text-text-secondary mt-1">管理和跟踪您的红人关系</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleExport}
                            className="btn btn-secondary flex items-center gap-2 group"
                        >
                            <Download size={18} className="text-text-secondary group-hover:text-text-primary transition-colors" />
                            <span>导出全部</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Controls Bar */}
            <div className="bg-surface rounded-soft-xl shadow-soft p-4 mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between border border-border">
                {/* Search */}
                <div className="relative w-full lg:w-96 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="搜索红人..."
                        className="w-full pl-10 pr-4 py-2.5 bg-surface-secondary border-none rounded-soft text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-text-tertiary"
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
                    <div className="relative min-w-[140px]">
                        <select
                            className="w-full appearance-none bg-surface-secondary pl-3 pr-10 py-2.5 rounded-soft text-sm font-medium border-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                            value={filters.hasEmail}
                            onChange={(e) => setFilters(prev => ({ ...prev, hasEmail: e.target.value }))}
                        >
                            <option value="all">Email: 全部</option>
                            <option value="yes">有 Email</option>
                            <option value="no">无 Email</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" size={16} />
                    </div>

                    <div className="relative min-w-[140px]">
                        <select
                            className="w-full appearance-none bg-surface-secondary pl-3 pr-10 py-2.5 rounded-soft text-sm font-medium border-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                            value={filters.sourceTask}
                            onChange={(e) => setFilters(prev => ({ ...prev, sourceTask: e.target.value }))}
                        >
                            <option value="all">任务: 全部</option>
                            {uniqueTasks.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" size={16} />
                    </div>

                    <div className="relative min-w-[140px]">
                        <select
                            className="w-full appearance-none bg-surface-secondary pl-3 pr-10 py-2.5 rounded-soft text-sm font-medium border-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                            value={filters.addedBy}
                            onChange={(e) => setFilters(prev => ({ ...prev, addedBy: e.target.value }))}
                        >
                            <option value="all">创建人: 全部</option>
                            {uniqueUsers.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" size={16} />
                    </div>
                </div>
            </div>



            {/* Table Card */}
            <div className="bg-surface rounded-soft-xl shadow-soft border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-secondary border-b border-border text-xs uppercase tracking-wider text-text-tertiary font-bold">
                                <th className="p-4">红人</th>
                                <th className="p-4">联系方式</th>
                                <th className="p-4">价格 / CPM</th>
                                <th className="p-4">质量分</th>
                                <th className="p-4">来源</th>
                                <th className="p-4">创建人</th>
                                <th className="p-4 text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-12 text-center text-text-secondary">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 bg-surface-secondary rounded-full flex items-center justify-center text-text-tertiary mb-2">
                                                <Search size={24} />
                                            </div>
                                            <p className="font-medium">未找到符合条件的红人</p>
                                            <button
                                                onClick={() => setFilters({ search: '', hasEmail: 'all', sourceTask: 'all', addedBy: 'all' })}
                                                className="text-primary hover:underline text-sm"
                                            >
                                                清除所有筛选
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map(inf => {
                                    return (
                                        <tr
                                            key={inf.id}
                                            className="group transition-colors hover:bg-surface-secondary/50"
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={inf.avatar}
                                                        alt={inf.name}
                                                        className="w-10 h-10 rounded-full object-cover ring-2 ring-surface shadow-soft-xs"
                                                    />
                                                    <div>
                                                        <div className="font-bold text-text-primary">{inf.name}</div>
                                                        <div className="text-sm text-text-tertiary">{inf.handle}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {inf.email ? (
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <div className="p-1.5 rounded-full bg-green-100/50 text-green-600">
                                                            <Mail size={14} />
                                                        </div>
                                                        <span className="text-text-secondary select-all">{inf.email}</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-sm text-text-tertiary opacity-70">
                                                        <MailX size={16} />
                                                        <span>N/A</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <div className="text-sm font-medium text-text-primary">{inf.estimatedPrice}</div>
                                                <div className="text-xs text-text-tertiary">CPM: ${inf.cpm}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getScoreColor(inf.qualityScore)}`}>
                                                    {inf.qualityScore}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {inf.fromTasks.map((task, i) => (
                                                        <span key={i} className="px-2 py-0.5 rounded bg-surface-secondary text-text-secondary text-xs border border-border-subtle truncate max-w-[150px]">
                                                            {task}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-sm font-medium text-text-secondary">{inf.addedBy}</div>
                                                <div className="text-xs text-text-tertiary">{inf.addedAt}</div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button className="p-2 text-text-tertiary hover:text-primary hover:bg-primary/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                                    <MoreHorizontal size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-border bg-surface-secondary/30 flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Showing {filteredData.length} connections</span>
                    <div className="flex gap-2">
                        <button
                            className="p-2 border border-border rounded-lg bg-surface hover:bg-surface-secondary text-text-secondary disabled:opacity-50 transition-colors"
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            className="p-2 border border-border rounded-lg bg-surface hover:bg-surface-secondary text-text-secondary disabled:opacity-50 transition-colors"
                            disabled
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Connections;
