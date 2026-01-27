import React, { useState } from 'react';
import { X, Heart, Star, TrendingUp, Mail, MailX, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

const InfluencerDetailModal = ({ isOpen, onClose, influencer, onConnect, isConnected }) => {
    const [showMore, setShowMore] = useState(false);

    if (!isOpen || !influencer) return null;

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

    const youtubeUrl = influencer.youtubeHandle
        ? `https://www.youtube.com/${influencer.youtubeHandle}/videos`
        : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in">
            <div
                className="neu-card w-full max-w-6xl h-[95vh] overflow-hidden flex flex-col animate-scale-in"
                style={{ borderRadius: 'var(--radius-xl)' }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="glass-panel border-b border-white/20 p-6 flex items-center justify-between shrink-0 z-10 backdrop-blur-strong">
                    <div className="flex items-center gap-4">
                        <img
                            src={influencer.avatar}
                            alt={influencer.name}
                            className="w-12 h-12 rounded-full ring-4 ring-primary/20 shadow-lg"
                        />
                        <div>
                            <h2 className="text-lg font-heading font-bold text-text-primary flex items-center gap-2">
                                {influencer.name}
                                {influencer.isCollaborated ? (
                                    <span
                                        className="neu-tag bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-600 border border-emerald-200 cursor-help text-[10px]"
                                        title={influencer.collaboratedProjects?.join('; ')}
                                    >
                                        合作过
                                    </span>
                                ) : (
                                    <span className="neu-tag bg-gray-50 text-gray-500 border border-gray-200 text-[10px]">
                                        未合作
                                    </span>
                                )}
                            </h2>
                            <p className="text-xs text-text-tertiary font-medium">{influencer.handle}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">


                        <button
                            onClick={() => onConnect(influencer)}
                            className={`px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 transition-all ${isConnected
                                ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-600 border border-emerald-200 shadow-sm'
                                : 'neu-btn-primary'
                                }`}
                        >
                            <Heart size={16} className={isConnected ? "fill-current" : ""} />
                            {isConnected ? '已收藏' : '收藏建联'}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2.5 hover:bg-white/50 rounded-full text-text-tertiary hover:text-text-primary transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden flex flex-col" style={{ background: 'var(--bg-gradient)' }}>
                    {/* Top Section - Data (1/3) */}
                    <div className="shrink-0 overflow-y-auto max-h-[45%] p-6">
                        {/* Priority Metrics Grid (Focus 8) */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 stagger-item">
                            <div className={`neu-card p-3 ${getScoreBg(influencer.qualityScore)} flex flex-col items-center justify-center hover:scale-105 transition-transform cursor-pointer group`} style={{ boxShadow: 'var(--shadow-neu-sm)' }}>
                                <p className="text-[9px] font-black uppercase opacity-70 mb-1 group-hover:opacity-100 transition-opacity">质量分数</p>
                                <div className={`text-lg font-heading font-black ${getScoreColor(influencer.qualityScore)} flex items-center gap-1`}>
                                    <Star size={16} className="fill-current" />
                                    {influencer.qualityScore}
                                </div>
                            </div>
                            <div className={`neu-card p-3 ${getScoreBg(influencer.matchScore)} flex flex-col items-center justify-center hover:scale-105 transition-transform cursor-pointer group`} style={{ boxShadow: 'var(--shadow-neu-sm)' }}>
                                <p className="text-[9px] font-black uppercase opacity-70 mb-1 group-hover:opacity-100 transition-opacity">业务匹配</p>
                                <div className={`text-lg font-heading font-black ${getScoreColor(influencer.matchScore)} flex items-center gap-1`}>
                                    <TrendingUp size={16} />
                                    {influencer.matchScore}
                                </div>
                            </div>
                            <div className="neu-card p-3 bg-gradient-to-br from-white to-gray-50 flex flex-col items-center justify-center hover:scale-105 transition-transform cursor-pointer" style={{ boxShadow: 'var(--shadow-neu-sm)' }}>
                                <p className="text-[9px] font-black uppercase text-text-tertiary mb-1">粉丝量</p>
                                <p className="text-sm font-black text-text-primary">{influencer.fanLevel}</p>
                            </div>
                            <div className="neu-card p-3 bg-gradient-to-br from-white to-gray-50 flex flex-col items-center justify-center hover:scale-105 transition-transform cursor-pointer" style={{ boxShadow: 'var(--shadow-neu-sm)' }}>
                                <p className="text-[9px] font-black uppercase text-text-tertiary mb-1">均播</p>
                                <p className="text-sm font-black text-text-primary">{influencer.avgViews?.toLocaleString()}</p>
                            </div>
                            <div className="neu-card p-3 bg-gradient-to-br from-white to-gray-50 flex flex-col items-center justify-center hover:scale-105 transition-transform cursor-pointer" style={{ boxShadow: 'var(--shadow-neu-sm)' }}>
                                <p className="text-[9px] font-black uppercase text-text-tertiary mb-1">国家</p>
                                <p className="text-sm font-black text-text-primary">{influencer.country}</p>
                            </div>
                            <div className="neu-card p-3 bg-gradient-to-br from-white to-gray-50 flex flex-col items-center justify-center hover:scale-105 transition-transform cursor-pointer" style={{ boxShadow: 'var(--shadow-neu-sm)' }}>
                                <p className="text-[9px] font-black uppercase text-text-tertiary mb-1">类型</p>
                                <p className="text-sm font-black text-text-primary">{influencer.type}</p>
                            </div>
                            <div className="neu-card p-3 bg-gradient-to-br from-white to-gray-50 flex flex-col items-center justify-center hover:scale-105 transition-transform cursor-pointer" style={{ boxShadow: 'var(--shadow-neu-sm)' }}>
                                <p className="text-[9px] font-black uppercase text-text-tertiary mb-1">建议报价</p>
                                <p className="text-sm font-black text-text-primary">{influencer.suggestedPrice}</p>
                            </div>
                            <div className="neu-card p-3 bg-gradient-to-br from-white to-gray-50 flex flex-col items-center justify-center hover:scale-105 transition-transform cursor-pointer" style={{ boxShadow: 'var(--shadow-neu-sm)' }}>
                                <p className="text-[9px] font-black uppercase text-text-tertiary mb-1">CPM</p>
                                <p className="text-sm font-black text-text-primary">${influencer.estimatedCPM}</p>
                            </div>
                        </div>

                        {/* Expandable Section - More Metrics List */}
                        <div className="mt-6 pt-4 border-t border-white/20">
                            <button
                                onClick={() => setShowMore(!showMore)}
                                className="neu-btn-secondary text-xs flex items-center gap-2"
                            >
                                {showMore ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                {showMore ? '隐藏深度指标' : '展开 11 项深度指标'}
                            </button>

                            {showMore && (
                                <div className="mt-4 neu-card p-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-5 gap-x-8 animate-slide-down" style={{ background: 'var(--surface-glass)', backdropFilter: 'blur(10px)' }}>
                                    <MetricItem label="互动率" value={`${influencer.engagementRate}%`} />
                                    <MetricItem label="近3个月发布视频数" value={influencer.vidsLast3Months || '-'} />
                                    <MetricItem label="近10条播放中位数" value={influencer.medianViewsLast10?.toLocaleString() || '-'} />
                                    <MetricItem label="近10条短视频数量" value={influencer.shortsLast10 || '0'} />
                                    <MetricItem label="近10条长视频数量" value={influencer.longVidsLast10 || '0'} />
                                    <MetricItem label="商单均播" value={influencer.sponsoredAvgViews?.toLocaleString() || '-'} />
                                    <MetricItem label="商单中位数" value={influencer.sponsoredMedianViews?.toLocaleString() || '-'} />
                                    <MetricItem label="商单最高观看量" value={influencer.sponsoredMaxViews?.toLocaleString() || '-'} />
                                    <MetricItem label="商单最高互动率" value={`${influencer.sponsoredMaxEngagement || '-'}%`} />
                                    <MetricItem label="商单均播占比" value={`${influencer.sponsoredAvgRatio || '-'}%`} />
                                    <MetricItem label="商单视频链接" value={influencer.sponsoredLinks} isLink />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Section - YouTube (2/3) */}
                <div className="flex-1 bg-black relative p-4">
                    <div className="w-full h-full rounded-2xl overflow-hidden" style={{ boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.3)' }}>
                        <iframe
                            src={youtubeUrl}
                            className="w-full h-full border-0"
                            title={`${influencer.name} YouTube`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetricItem = ({ label, value, isLink }) => (
    <div className="flex flex-col">
        <span className="text-[10px] font-bold text-text-tertiary uppercase mb-0.5">{label}</span>
        {isLink ? (
            <button className="text-xs font-black text-primary hover:underline text-left flex items-center gap-1">
                {value} <ExternalLink size={10} />
            </button>
        ) : (
            <span className="text-sm font-black text-text-primary">{value}</span>
        )}
    </div>
);

export default InfluencerDetailModal;
