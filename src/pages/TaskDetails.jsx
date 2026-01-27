import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Settings2, Heart, Star, TrendingUp, Eye, Filter, MonitorPlay, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import FilterModal from '../components/FilterModal';
import InfluencerDetailModal from '../components/InfluencerDetailModal';
import InfluencerBatchViewModal from '../components/InfluencerBatchViewModal';

const columnLabels = {
    influencer: '红人',
    fanLevel: '粉丝级别',
    country: '国家',
    type: '类型',
    qualityScore: '质量分',
    matchScore: '匹配度',
    avgViews: '平均观看',
    engagementRate: '互动率',
    sponsoredCount: '商单数',
    estimatedCPM: 'CPM',
    suggestedPrice: '建议报价',
    isCollaborated: '合作状态',
    vidsLast3Months: '近3个月视频数',
    medianViewsLast10: '中位观看',
    shortsLast10: '短视频数',
    longVidsLast10: '长视频数',
    sponsoredAvgViews: '商单均播',
    sponsoredMedianViews: '商单中位',
    sponsoredMaxViews: '商单最高观看',
    sponsoredMaxEngagement: '商单最高互动',
    sponsoredAvgRatio: '商单表现比',
    sponsoredLinks: '商单链接'
};

const TaskDetails = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const { tasks, toggleConnection } = useApp();
    const task = tasks.find(t => t.id === taskId);

    // Column Visibility State
    const [visibleColumns, setVisibleColumns] = useState({
        influencer: true,
        fanLevel: true,
        country: true,
        type: true,
        qualityScore: true,
        matchScore: true,
        avgViews: true,
        engagementRate: true,
        sponsoredCount: true,
        estimatedCPM: true,
        suggestedPrice: true,
        isCollaborated: true,
        vidsLast3Months: false,
        medianViewsLast10: false,
        shortsLast10: false,
        longVidsLast10: false,
        sponsoredAvgViews: false,
        sponsoredMedianViews: false,
        sponsoredMaxViews: false,
        sponsoredMaxEngagement: false,
        sponsoredAvgRatio: false,
        sponsoredLinks: false,
    });

    const [showColumnSettings, setShowColumnSettings] = useState(false);
    const [connectedInfluencers, setConnectedInfluencers] = useState(new Set());
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Modal States
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [selectedInfluencer, setSelectedInfluencer] = useState(null);
    const [isBatchViewOpen, setIsBatchViewOpen] = useState(false);
    const [batchViewIndex, setBatchViewIndex] = useState(0);

    // Filter State
    // Filter State
    const [filters, setFilters] = useState({
        search: '',
        tier: [],
        country: [],
        type: [],
        qualityScore: [0, 100],
        businessMatch: [0, 100],
        avgViews: [0, 10000000],
        estimatedCPM: [0, 1000],
        engagementRate: [0, 100],
    });

    // Mock Data
    const influencers = [
        {
            id: 'inf_001',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
            name: 'Lia Beauty',
            handle: '@liabeauty_official',
            youtubeHandle: '@pestandlawnginja',
            fanLevel: '100K-500K',
            country: 'United States',
            type: 'Beauty',
            qualityScore: 92,
            matchScore: 88,
            avgViews: 120000,
            engagementRate: 4.5,
            sponsoredCount: 12,
            estimatedCPM: 8.5,
            suggestedPrice: '¥5,000-8,000',
            hasEmail: true,
            email: 'contact@liabeauty.com',
            // 深度指标
            vidsLast3Months: 24,
            medianViewsLast10: 105000,
            shortsLast10: 4,
            longVidsLast10: 6,
            sponsoredAvgViews: 98000,
            sponsoredMedianViews: 85000,
            sponsoredMaxViews: 250000,
            sponsoredMaxEngagement: 5.8,
            sponsoredAvgRatio: 82,
            sponsoredLinks: 'View All',
            isCollaborated: true,
            collaboratedProjects: ['lymow 项目', 'yarbo 项目']
        },
        {
            id: 'inf_002',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
            name: 'Tech Wiz',
            handle: '@techwiz_reviews',
            youtubeHandle: '@mkbhd',
            fanLevel: '500K+',
            country: 'Germany',
            type: 'Tech',
            qualityScore: 78,
            matchScore: 95,
            avgViews: 850000,
            engagementRate: 3.2,
            sponsoredCount: 8,
            estimatedCPM: 12.0,
            suggestedPrice: '¥12,000-18,000',
            hasEmail: false,
            email: null,
            // 深度指标
            vidsLast3Months: 18,
            medianViewsLast10: 720000,
            shortsLast10: 2,
            longVidsLast10: 8,
            sponsoredAvgViews: 650000,
            sponsoredMedianViews: 580000,
            sponsoredMaxViews: 1200000,
            sponsoredMaxEngagement: 4.1,
            sponsoredAvgRatio: 76,
            sponsoredLinks: 'View All',
            isCollaborated: false,
            collaboratedProjects: []
        },
        {
            id: 'inf_003',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
            name: 'Healthy Living',
            handle: '@healthy_living',
            youtubeHandle: '@jennajulien',
            fanLevel: '10K-100K',
            country: 'United Kingdom',
            type: 'Lifestyle',
            qualityScore: 55,
            matchScore: 62,
            avgViews: 45000,
            engagementRate: 8.1,
            sponsoredCount: 5,
            estimatedCPM: 15.5,
            suggestedPrice: '¥25,000-35,000',
            hasEmail: true,
            email: 'hello@healthyliving.com',
            // 深度指标
            vidsLast3Months: 35,
            medianViewsLast10: 38000,
            shortsLast10: 12,
            longVidsLast10: 3,
            sponsoredAvgViews: 42000,
            sponsoredMedianViews: 40000,
            sponsoredMaxViews: 85000,
            sponsoredMaxEngagement: 12.5,
            sponsoredAvgRatio: 93,
            sponsoredLinks: 'View All',
            isCollaborated: true,
            collaboratedProjects: ['lymow 项目']
        }
    ];

    const displayData = filteredData.length > 0 ? filteredData : influencers;
    const totalPages = Math.ceil(displayData.length / itemsPerPage);
    const paginatedData = displayData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleConnect = (influencer) => {
        const influencerId = typeof influencer === 'string' ? influencer : influencer.id;
        const newConnected = new Set(connectedInfluencers);
        if (newConnected.has(influencerId)) {
            newConnected.delete(influencerId);
        } else {
            newConnected.add(influencerId);
        }
        setConnectedInfluencers(newConnected);
        toggleConnection?.(influencerId);
    };

    const handleApplyFilters = (newFilters) => {
        setFilters(newFilters);
        // Simple filtering logic
        const filtered = influencers.filter(inf => {
            if (newFilters.search && !inf.name.toLowerCase().includes(newFilters.search.toLowerCase())) return false;
            if (newFilters.tier.length > 0 && !newFilters.tier.includes(inf.fanLevel)) return false;
            if (newFilters.country.length > 0 && !newFilters.country.includes(inf.country)) return false;
            if (newFilters.type.length > 0 && !newFilters.type.includes(inf.type)) return false;
            if (inf.qualityScore < newFilters.qualityScore[0] || inf.qualityScore > newFilters.qualityScore[1]) return false;
            if (inf.matchScore < newFilters.businessMatch[0] || inf.matchScore > newFilters.businessMatch[1]) return false;
            if (newFilters.hasEmail === 'yes' && !inf.hasEmail) return false;
            if (newFilters.hasEmail === 'no' && inf.hasEmail) return false;
            return true;
        });
        setFilteredData(filtered);
    };

    const handleResetFilters = () => {
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
        setFilteredData([]);
    };

    const getScoreColor = (score) => {
        if (score < 60) return 'bg-error/10 text-error border-error/20';
        if (score < 80) return 'bg-warning/10 text-warning border-warning/20';
        return 'bg-success/10 text-success border-success/20';
    };

    if (!task) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-heading font-bold text-text-primary mb-2">Task Not Found</h2>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-soft-lg font-bold shadow-soft-md hover:shadow-glow-orange transition-all"
                    >
                        Back to Tasks
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen relative overflow-hidden bg-bg-secondary">
            {/* Main Content (Full Width) */}
            < main className="flex-1 flex flex-col overflow-hidden" >
                {/* Header */}
                <header className="glass-panel border-b border-white/20 px-8 py-6 backdrop-blur-strong">
                    <div className="flex flex-col gap-6">
                        {/* Top Row: Back + Title */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/')}
                                className="p-2 -ml-2 hover:bg-surface-secondary text-text-secondary hover:text-text-primary rounded-full transition-colors group"
                            >
                                <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-heading font-bold text-text-primary flex items-center gap-3">
                                    {task.name}
                                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-surface-secondary text-text-tertiary border border-border">
                                        {task.searchMethod || 'Keyword Search'}
                                    </span>
                                </h1>
                                <p className="text-xs text-text-tertiary font-bold mt-1 ml-1">
                                    {displayData.length} Influencers Found
                                </p>
                            </div>
                        </div>

                        {/* Row 2: Target Profiles & Actions */}
                        <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                            {/* Target Profiles - Compact Version */}
                            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 bg-surface/30 rounded-xl px-5 py-3 border border-white/10 max-w-3xl">
                                {/* P0 */}
                                <div className="flex items-center gap-2">
                                    <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-black bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">P0</span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {((task.details || task.params)?.p0Types || []).length > 0 ? ((task.details || task.params)?.p0Types || []).map(t => (
                                            <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-white/10 text-text-secondary font-bold shadow-sm">{t}</span>
                                        )) : <span className="text-xs text-text-tertiary">-</span>}
                                    </div>
                                </div>
                                {/* P1 */}
                                {((task.details || task.params)?.p1Types || []).length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-black bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wider">P1</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {((task.details || task.params)?.p1Types || []).map(t => (
                                                <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-white/10 text-text-secondary font-bold shadow-sm">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {/* P2 */}
                                {((task.details || task.params)?.p2Types || []).length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-black bg-gray-50 text-gray-500 border border-gray-200 uppercase tracking-wider">P2</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {((task.details || task.params)?.p2Types || []).map(t => (
                                                <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-white/10 text-text-secondary font-bold shadow-sm">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Actions - Vertical alignment fix */}
                            <div className="flex items-center gap-3 flex-wrap lg:pt-1">
                                <button
                                    onClick={() => setIsFilterModalOpen(true)}
                                    className="neu-btn-secondary flex items-center gap-2"
                                >
                                    <Filter size={18} />
                                    筛选
                                </button>

                                <button
                                    onClick={() => {
                                        setBatchViewIndex(0);
                                        setIsBatchViewOpen(true);
                                    }}
                                    className="neu-btn-secondary flex items-center gap-2"
                                    disabled={displayData.length === 0}
                                >
                                    <MonitorPlay size={18} />
                                    <span className="hidden sm:inline">详情视图</span>
                                </button>

                                <button
                                    onClick={() => setShowColumnSettings(!showColumnSettings)}
                                    className="hidden md:flex neu-btn-secondary items-center gap-2"
                                >
                                    <Settings2 size={18} />
                                    列设置
                                </button>
                                <button className="neu-btn-primary flex items-center gap-2">
                                    <Download size={18} />
                                    <span className="hidden sm:inline">Export</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Table Container */}
                < div className="flex-1 overflow-auto p-8" >
                    <div className="neu-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="glass-panel border-b border-white/30 sticky top-0 z-10 backdrop-blur-soft">
                                    <tr>
                                        {visibleColumns.influencer && (
                                            <th className="text-left px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">
                                                Influencer
                                            </th>
                                        )}
                                        {visibleColumns.fanLevel && (
                                            <th className="text-left px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider whitespace-nowrap">
                                                Tier
                                            </th>
                                        )}
                                        {visibleColumns.country && (
                                            <th className="text-left px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">
                                                Country
                                            </th>
                                        )}
                                        {visibleColumns.type && (
                                            <th className="text-left px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">
                                                Type
                                            </th>
                                        )}
                                        {visibleColumns.qualityScore && (
                                            <th className="text-left px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">
                                                Quality
                                            </th>
                                        )}
                                        {visibleColumns.matchScore && (
                                            <th className="text-left px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">
                                                Match
                                            </th>
                                        )}
                                        {visibleColumns.avgViews && (
                                            <th className="text-left px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider whitespace-nowrap">
                                                Avg Views
                                            </th>
                                        )}
                                        {visibleColumns.estimatedCPM && (
                                            <th className="text-left px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">
                                                CPM
                                            </th>
                                        )}
                                        {visibleColumns.suggestedPrice && (
                                            <th className="text-left px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">
                                                建议报价
                                            </th>
                                        )}
                                        {visibleColumns.isCollaborated && (
                                            <th className="text-left px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">
                                                合作状态
                                            </th>
                                        )}
                                        {visibleColumns.vidsLast3Months && (
                                            <th className="text-left px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">
                                                近3月发片
                                            </th>
                                        )}
                                        {visibleColumns.medianViewsLast10 && (
                                            <th className="text-left px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">
                                                中位播放
                                            </th>
                                        )}
                                        {visibleColumns.sponsoredAvgViews && (
                                            <th className="text-left px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">
                                                商单均播
                                            </th>
                                        )}
                                        <th className="text-right px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">
                                            操作
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {displayData.length === 0 ? (
                                        <tr>
                                            <td colSpan="20" className="px-6 py-16 text-center text-text-tertiary">
                                                未找到匹配红人
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedData.map((inf) => (
                                            <tr key={inf.id} className="hover:bg-gradient-to-r hover:from-orange-50/30 hover:to-transparent transition-all duration-300 group border-b border-[var(--border-light)] relative">
                                                {/* Influencer */}
                                                {visibleColumns.influencer && (
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4 min-w-[200px]">
                                                            <div className="relative">
                                                                <img
                                                                    src={inf.avatar}
                                                                    alt={inf.name}
                                                                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-soft-sm"
                                                                />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
                                                                    {inf.name}
                                                                </p>
                                                                <p className="text-xs text-text-tertiary font-medium">{inf.handle}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                )}

                                                {/* Fan Level */}
                                                {visibleColumns.fanLevel && (
                                                    <td className="px-6 py-4 text-sm text-text-secondary font-medium whitespace-nowrap">
                                                        {inf.fanLevel}
                                                    </td>
                                                )}

                                                {/* Country */}
                                                {visibleColumns.country && (
                                                    <td className="px-6 py-4 text-sm text-text-secondary font-medium">
                                                        {inf.country}
                                                    </td>
                                                )}

                                                {/* Type */}
                                                {visibleColumns.type && (
                                                    <td className="px-6 py-4">
                                                        <span className="neu-tag bg-gradient-to-r from-orange-50 to-orange-100 text-orange-600 border border-orange-200">
                                                            {inf.type}
                                                        </span>
                                                    </td>
                                                )}

                                                {/* Quality Score */}
                                                {visibleColumns.qualityScore && (
                                                    <td className="px-6 py-4">
                                                        <div className={`neu-tag ${getScoreColor(inf.qualityScore)}`} style={{ boxShadow: 'var(--shadow-neu-sm)' }}>
                                                            <Star size={12} className="fill-current" />
                                                            {inf.qualityScore}
                                                        </div>
                                                    </td>
                                                )}

                                                {/* Match Score */}
                                                {visibleColumns.matchScore && (
                                                    <td className="px-6 py-4">
                                                        <div className={`neu-tag ${getScoreColor(inf.matchScore)}`} style={{ boxShadow: 'var(--shadow-neu-sm)' }}>
                                                            <TrendingUp size={12} />
                                                            {inf.matchScore}
                                                        </div>
                                                    </td>
                                                )}

                                                {/* Avg Views */}
                                                {visibleColumns.avgViews && (
                                                    <td className="px-6 py-4 text-sm text-text-secondary font-medium whitespace-nowrap">
                                                        {inf.avgViews.toLocaleString()}
                                                    </td>
                                                )}

                                                {/* CPM */}
                                                {visibleColumns.estimatedCPM && (
                                                    <td className="px-6 py-4 text-sm text-text-secondary font-medium">
                                                        ${inf.estimatedCPM}
                                                    </td>
                                                )}

                                                {/* Price */}
                                                {visibleColumns.suggestedPrice && (
                                                    <td className="px-6 py-4 text-sm text-text-secondary font-medium whitespace-nowrap">
                                                        {inf.suggestedPrice}
                                                    </td>
                                                )}
                                                {visibleColumns.isCollaborated && (
                                                    <td className="px-6 py-4">
                                                        {inf.isCollaborated ? (
                                                            <span
                                                                className="neu-tag bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-600 border border-emerald-200 cursor-help"
                                                                title={inf.collaboratedProjects?.join('; ')}
                                                            >
                                                                合作过
                                                            </span>
                                                        ) : (
                                                            <span className="neu-tag bg-gray-50 text-gray-500 border border-gray-200">
                                                                未合作过
                                                            </span>
                                                        )}
                                                    </td>
                                                )}
                                                {visibleColumns.vidsLast3Months && (
                                                    <td className="px-6 py-4 text-sm text-text-secondary font-medium">
                                                        {inf.vidsLast3Months}
                                                    </td>
                                                )}
                                                {visibleColumns.medianViewsLast10 && (
                                                    <td className="px-6 py-4 text-sm text-text-secondary font-medium">
                                                        {inf.medianViewsLast10?.toLocaleString()}
                                                    </td>
                                                )}
                                                {visibleColumns.sponsoredAvgViews && (
                                                    <td className="px-6 py-4 text-sm text-text-secondary font-medium">
                                                        {inf.sponsoredAvgViews?.toLocaleString()}
                                                    </td>
                                                )}

                                                {/* Actions */}
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {/* 详情按钮 */}
                                                        <button
                                                            onClick={() => setSelectedInfluencer(inf)}
                                                            className="px-3 py-2 neu-btn-secondary text-xs flex items-center gap-1.5 group/btn"
                                                            title="查看详情"
                                                        >
                                                            <Eye size={14} className="group-hover/btn:scale-110 transition-transform" />
                                                            <span className="hidden lg:inline">详情</span>
                                                        </button>

                                                        {/* 收藏按钮 */}
                                                        <button
                                                            onClick={() => handleConnect(inf)}
                                                            className={`px-3 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${connectedInfluencers.has(inf.id)
                                                                ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-600 border border-emerald-200 shadow-sm'
                                                                : 'neu-btn-secondary hover:border-orange-200'
                                                                }`}
                                                            title={connectedInfluencers.has(inf.id) ? '已收藏' : '收藏'}
                                                        >
                                                            <Heart
                                                                size={14}
                                                                className={connectedInfluencers.has(inf.id) ? 'fill-current' : ''}
                                                            />
                                                            <span className="hidden lg:inline">
                                                                {connectedInfluencers.has(inf.id) ? '已收藏' : '收藏'}
                                                            </span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {/* Pagination */}
                    {displayData.length > 0 && (
                        <div className="flex items-center justify-between mt-6 px-4 py-4 border-t border-border">
                            <p className="text-sm text-text-secondary font-medium">
                                Showing <span className="font-bold text-text-primary">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-text-primary">{Math.min(currentPage * itemsPerPage, displayData.length)}</span> of <span className="font-bold text-text-primary">{displayData.length}</span> results
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                    className="p-2 border border-border rounded-lg bg-surface hover:bg-surface-secondary text-text-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    title="First Page"
                                >
                                    <ChevronsLeft size={18} />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 border border-border rounded-lg bg-surface hover:bg-surface-secondary text-text-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    title="Previous Page"
                                >
                                    <ChevronLeft size={18} />
                                </button>

                                <div className="flex items-center gap-1 mx-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter(p => p === 1 || p === totalPages || Math.abs(currentPage - p) <= 1)
                                        .map((page, index, array) => (
                                            <React.Fragment key={page}>
                                                {index > 0 && array[index - 1] !== page - 1 && <span className="px-2 text-text-tertiary">...</span>}
                                                <button
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`min-w-[32px] h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${currentPage === page ? 'bg-primary text-white shadow-soft-md' : 'bg-surface border border-border text-text-secondary hover:border-primary/30 hover:text-primary'}`}
                                                >
                                                    {page}
                                                </button>
                                            </React.Fragment>
                                        ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 border border-border rounded-lg bg-surface hover:bg-surface-secondary text-text-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    title="Next Page"
                                >
                                    <ChevronRight size={18} />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className="p-2 border border-border rounded-lg bg-surface hover:bg-surface-secondary text-text-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    title="Last Page"
                                >
                                    <ChevronsRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div >
            </main >

            {/* Column Settings Panel */}
            {
                showColumnSettings && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowColumnSettings(false)}>
                        <div className="neu-card p-8 w-[480px] max-h-[600px] flex flex-col" onClick={(e) => e.stopPropagation()} style={{ borderRadius: 'var(--radius-xl)' }}>
                            <h3 className="text-xl font-heading font-bold text-text-primary mb-6 flex items-center gap-2">
                                <Settings2 size={24} className="text-primary" />
                                列设置
                            </h3>
                            <div className="space-y-2 max-h-96 overflow-y-auto pr-2 flex-1">
                                {Object.keys(visibleColumns).map((col) => (
                                    <label key={col} className="flex items-center gap-4 p-4 hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-transparent rounded-xl cursor-pointer transition-all duration-200 group">
                                        <input
                                            type="checkbox"
                                            checked={visibleColumns[col]}
                                            onChange={(e) => setVisibleColumns({ ...visibleColumns, [col]: e.target.checked })}
                                            className="w-5 h-5 text-primary rounded-lg focus:ring-2 focus:ring-primary/20 cursor-pointer"
                                            disabled={col === 'influencer'}
                                            style={{ accentColor: 'var(--accent-primary)' }}
                                        />
                                        <span className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
                                            {columnLabels[col] || col.replace(/([A-Z])/g, ' $1').trim()}
                                        </span>
                                    </label>
                                ))}
                            </div>
                            <button
                                onClick={() => setShowColumnSettings(false)}
                                className="w-full mt-6 neu-btn-primary"
                            >
                                完成
                            </button>
                        </div>
                    </div>
                )
            }

            {/* 筛选弹窗 */}
            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                filters={filters}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
            />

            {/* 单个红人详情弹窗 */}
            <InfluencerDetailModal
                isOpen={!!selectedInfluencer}
                onClose={() => setSelectedInfluencer(null)}
                influencer={selectedInfluencer}
                onConnect={handleConnect}
                isConnected={selectedInfluencer ? connectedInfluencers.has(selectedInfluencer.id) : false}
            />

            {/* 批量红人详情视图 */}
            <InfluencerBatchViewModal
                isOpen={isBatchViewOpen}
                onClose={() => setIsBatchViewOpen(false)}
                influencers={displayData}
                selectedIndex={batchViewIndex}
                onSelect={setBatchViewIndex}
                onConnect={handleConnect}
                connectedIds={connectedInfluencers}
            />
        </div >
    );
};

export default TaskDetails;
