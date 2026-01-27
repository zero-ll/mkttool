import React, { useEffect, useRef, useState } from 'react';
import { X, Heart, Star, TrendingUp, ChevronLeft, ChevronRight, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

const InfluencerBatchViewModal = ({
    isOpen,
    onClose,
    influencers,
    selectedIndex,
    onSelect,
    onConnect,
    connectedIds = new Set()
}) => {
    const listRef = useRef(null);
    const selectedRef = useRef(null);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        if (isOpen && selectedRef.current) {
            selectedRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [selectedIndex, isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowUp' && selectedIndex > 0) {
                onSelect(selectedIndex - 1);
                e.preventDefault();
            }
            if (e.key === 'ArrowDown' && selectedIndex < influencers.length - 1) {
                onSelect(selectedIndex + 1);
                e.preventDefault();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, selectedIndex, influencers.length, onSelect]);

    if (!isOpen || !influencers || influencers.length === 0) return null;

    const currentInfluencer = influencers[selectedIndex];
    const isConnected = connectedIds.has(currentInfluencer.id);

    const handlePrevious = () => { if (selectedIndex > 0) onSelect(selectedIndex - 1); };
    const handleNext = () => { if (selectedIndex < influencers.length - 1) onSelect(selectedIndex + 1); };

    const getScoreColor = (score) => {
        if (score < 60) return 'text-error';
        if (score < 80) return 'text-warning';
        return 'text-success';
    };

    const getScoreBg = (score) => {
        if (score < 60) return 'bg-error/10 border-error/20';
        if (score < 80) return 'bg-warning/10 border-warning/20';
        return 'bg-success/10 border-success/20';
    };

    const youtubeUrl = currentInfluencer.youtubeHandle
        ? `https://www.youtube.com/${currentInfluencer.youtubeHandle}/videos`
        : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md animate-fade-in">
            {/* 这里的尺寸从 98vw/vh 缩小到更标准的 7xl 和 85vh */}
            <div className="w-full h-full max-w-7xl max-h-[85vh] flex overflow-hidden neu-card animate-scale-in" style={{ borderRadius: 'var(--radius-xl)' }}>

                {/* Left Sidebar: List */}
                <div className="w-56 border-r border-white/10 glass-panel flex flex-col shrink-0 backdrop-blur-soft">
                    <div className="p-4 border-b border-border bg-surface-secondary shrink-0">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-heading font-black text-text-primary text-xs uppercase tracking-tight">红人列表 ({influencers.length})</h3>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handlePrevious} disabled={selectedIndex === 0}
                                className="flex-1 py-1.5 flex items-center justify-center bg-surface border border-border rounded-lg hover:bg-surface-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                <ChevronLeft size={16} />
                            </button>
                            <button onClick={handleNext} disabled={selectedIndex === influencers.length - 1}
                                className="flex-1 py-1.5 flex items-center justify-center bg-surface border border-border rounded-lg hover:bg-surface-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto" ref={listRef}>
                        {influencers.map((inf, index) => (
                            <button key={inf.id} ref={index === selectedIndex ? selectedRef : null}
                                onClick={() => { onSelect(index); setShowMore(false); }}
                                className={`w-full p-3 flex items-center gap-2 border-b border-border-subtle hover:bg-surface-secondary transition-colors text-left ${index === selectedIndex ? 'bg-primary/5 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}>
                                <img src={inf.avatar} alt={inf.name} className={`w-7 h-7 rounded-full object-cover ring-2 ${index === selectedIndex ? 'ring-primary' : 'ring-transparent'}`} />
                                <div className="min-w-0 flex-1">
                                    <p className={`text-[11px] font-black truncate ${index === selectedIndex ? 'text-primary' : 'text-text-primary'}`}>{inf.name}</p>
                                    <p className="text-[9px] text-text-tertiary truncate">{inf.handle}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Area: Vertically split */}
                <div className="flex-1 flex flex-col overflow-hidden" style={{ background: 'var(--bg-gradient)' }}>
                    {/* Top: Header & Data (1/3) */}
                    <div className="shrink-0 glass-panel border-b border-white/20 z-10 shadow-sm backdrop-blur-strong">
                        <div className="px-5 py-3 border-b border-border flex items-center justify-between bg-surface">
                            <div className="flex items-center gap-3">
                                <img src={currentInfluencer.avatar} alt={currentInfluencer.name} className="w-8 h-8 rounded-full" />
                                <div>
                                    <h2 className="text-sm font-black text-text-primary flex items-center gap-2">
                                        {currentInfluencer.name}
                                        {currentInfluencer.isCollaborated ? (
                                            <span
                                                className="neu-tag bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-600 border border-emerald-200 cursor-help text-[9px]"
                                                title={currentInfluencer.collaboratedProjects?.join('; ')}
                                            >
                                                合作过
                                            </span>
                                        ) : (
                                            <span className="neu-tag bg-gray-50 text-gray-500 border border-gray-200 text-[9px]">
                                                未合作
                                            </span>
                                        )}
                                        <span className="text-[9px] text-text-tertiary font-bold px-1.5 py-0.5 bg-surface-secondary rounded border border-border uppercase">
                                            {selectedIndex + 1} / {influencers.length}
                                        </span>
                                    </h2>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">


                                <button onClick={() => onConnect(currentInfluencer)}
                                    className={`px-5 py-2.5 rounded-full font-bold text-[11px] flex items-center gap-1.5 transition-all ${isConnected
                                        ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-600 border border-emerald-200 shadow-sm'
                                        : 'neu-btn-primary text-xs'
                                        }`}>
                                    <Heart size={14} className={isConnected ? "fill-current" : ""} />
                                    {isConnected ? '已收藏' : '收藏建联'}
                                </button>
                                <button onClick={onClose} className="p-1.5 hover:bg-surface-secondary rounded-full text-text-tertiary hover:text-text-primary transition-colors">
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Data Section */}
                        <div className="p-4 overflow-y-auto max-h-[35vh]">
                            <div className="grid grid-cols-4 lg:grid-cols-8 gap-2">
                                <MetricCard label="质量分" value={currentInfluencer.qualityScore} score icon={<Star size={10} className="fill-current" />} bg={getScoreBg(currentInfluencer.qualityScore)} color={getScoreColor(currentInfluencer.qualityScore)} />
                                <MetricCard label="匹配度" value={currentInfluencer.matchScore} score icon={<TrendingUp size={10} />} bg={getScoreBg(currentInfluencer.matchScore)} color={getScoreColor(currentInfluencer.matchScore)} />
                                <MetricCard label="粉丝量" value={currentInfluencer.fanLevel} />
                                <MetricCard label="均播" value={currentInfluencer.avgViews?.toLocaleString()} />
                                <MetricCard label="国家" value={currentInfluencer.country} />
                                <MetricCard label="类型" value={currentInfluencer.type} />
                                <MetricCard label="建议报价" value={currentInfluencer.suggestedPrice} />
                                <MetricCard label="CPM" value={`$${currentInfluencer.estimatedCPM}`} />
                            </div>

                            <div className="mt-3">
                                <button onClick={() => setShowMore(!showMore)} className="flex items-center gap-1 text-[10px] font-black text-primary hover:text-primary-hover">
                                    {showMore ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                    {showMore ? '精简显示' : '查看 11 项深度指标'}
                                </button>
                                {showMore && (
                                    <div className="mt-3 p-3 bg-surface rounded-lg border border-border grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-3 gap-x-6 animate-slide-down">
                                        <DetailItem label="互动率" value={`${currentInfluencer.engagementRate}%`} />
                                        <DetailItem label="近3个月发布数" value={currentInfluencer.vidsLast3Months} />
                                        <DetailItem label="近10条播放中位" value={currentInfluencer.medianViewsLast10?.toLocaleString()} />
                                        <DetailItem label="近10条短视频数" value={currentInfluencer.shortsLast10} />
                                        <DetailItem label="近10条长视频数" value={currentInfluencer.longVidsLast10} />
                                        <DetailItem label="商单均播" value={currentInfluencer.sponsoredAvgViews?.toLocaleString()} />
                                        <DetailItem label="商单播放中位" value={currentInfluencer.sponsoredMedianViews?.toLocaleString()} />
                                        <DetailItem label="商单最高观看" value={currentInfluencer.sponsoredMaxViews?.toLocaleString()} />
                                        <DetailItem label="商单最高互动" value={`${currentInfluencer.sponsoredMaxEngagement}%`} />
                                        <DetailItem label="商单均播占比" value={`${currentInfluencer.sponsoredAvgRatio}%`} />
                                        <DetailItem label="商单视频链接" value={currentInfluencer.sponsoredLinks} isLink />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bottom: YouTube iframe (2/3) */}
                    <div className="flex-1 bg-black relative">
                        <iframe key={currentInfluencer.id} src={youtubeUrl} className="w-full h-full border-0" allowFullScreen />
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ label, value, score, icon, bg, color }) => (
    <div className={`p-1.5 rounded-lg border flex flex-col items-center justify-center text-center ${score ? `${bg} ${color}` : 'bg-surface border-border text-text-primary'}`}>
        <p className={`text-[8px] font-black uppercase mb-0.5 ${score ? 'opacity-70' : 'text-text-tertiary'}`}>{label}</p>
        <p className="text-xs font-black flex items-center gap-0.5">{icon}{value}</p>
    </div>
);

const DetailItem = ({ label, value, isLink }) => (
    <div className="flex flex-col">
        <span className="text-[8px] font-black text-text-tertiary uppercase mb-0.5 tracking-tight">{label}</span>
        {isLink ? (
            <button className="text-[11px] font-black text-primary hover:underline flex items-center gap-0.5">{value} <ExternalLink size={10} /></button>
        ) : (
            <span className="text-xs font-black text-text-primary">{value || '-'}</span>
        )}
    </div>
);

export default InfluencerBatchViewModal;
