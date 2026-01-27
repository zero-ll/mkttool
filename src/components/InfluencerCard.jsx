import React from 'react';
import { Mail, MailX, Star, TrendingUp, Eye } from 'lucide-react';

const InfluencerCard = ({ influencer, onConnect }) => {
    const getScoreColor = (score) => {
        if (score < 60) return 'bg-error/10 text-error border-error/20';
        if (score < 80) return 'bg-warning/10 text-warning border-warning/20';
        return 'bg-success/10 text-success border-success/20';
    };

    return (
        <div className="group bg-surface border border-border rounded-soft-xl p-5 hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-200 animate-fade-in">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
                {/* Avatar */}
                <div className="relative">
                    <img
                        src={influencer.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${influencer.id}`}
                        alt={influencer.name}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-soft-sm"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-white"></div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h4 className="text-base font-heading font-bold text-text-primary truncate group-hover:text-primary transition-colors">
                        {influencer.name}
                    </h4>
                    <p className="text-xs text-text-tertiary font-medium">{influencer.handle}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-text-secondary">{influencer.followers}</span>
                        <span className="text-text-tertiary">·</span>
                        <span className="text-xs text-text-tertiary">{influencer.country}</span>
                    </div>
                </div>

                {/* Email Status */}
                <div>
                    {influencer.email ? (
                        <div className="p-2 bg-success/10 rounded-lg" title="Has Email">
                            <Mail size={16} className="text-success" />
                        </div>
                    ) : (
                        <div className="p-2 bg-border rounded-lg" title="No Email">
                            <MailX size={16} className="text-text-tertiary" />
                        </div>
                    )}
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Quality Score */}
                <div>
                    <p className="text-xs text-text-tertiary mb-1">Quality</p>
                    <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${getScoreColor(influencer.qualityScore)}`}>
                        <Star size={12} />
                        {influencer.qualityScore}
                    </div>
                </div>

                {/* Business Match */}
                <div>
                    <p className="text-xs text-text-tertiary mb-1">Match</p>
                    <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${getScoreColor(influencer.businessMatch)}`}>
                        <TrendingUp size={12} />
                        {influencer.businessMatch}
                    </div>
                </div>

                {/* Avg Views */}
                <div>
                    <p className="text-xs text-text-tertiary mb-1">Avg Views</p>
                    <p className="text-sm font-bold text-text-primary">{influencer.avgViews?.toLocaleString() || '-'}</p>
                </div>

                {/* CPM */}
                <div>
                    <p className="text-xs text-text-tertiary mb-1">Est. CPM</p>
                    <p className="text-sm font-bold text-text-primary">${influencer.estimatedCPM || '-'}</p>
                </div>
            </div>

            {/* Type Tags */}
            {influencer.type && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {influencer.type.split(',').map((tag, idx) => (
                        <span
                            key={idx}
                            className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-md"
                        >
                            {tag.trim()}
                        </span>
                    ))}
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-border">
                <button
                    onClick={() => window.open(influencer.profileUrl, '_blank')}
                    className="flex-1 px-4 py-2.5 bg-surface-secondary hover:bg-border text-text-secondary hover:text-text-primary rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                    <Eye size={14} />
                    View Profile
                </button>
                <button
                    onClick={() => onConnect?.(influencer)}
                    className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-bold shadow-soft-md hover:shadow-glow-orange transition-all transform hover:-translate-y-0.5"
                >
                    Connect
                </button>
            </div>
        </div>
    );
};

export default InfluencerCard;
