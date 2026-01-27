import React from 'react';
import { X } from 'lucide-react';

const TaskParamsDrawer = ({ isOpen, onClose, task }) => {
    if (!isOpen || !task) return null;

    const renderKeywordSearchParams = (params) => (
        <div className="space-y-6">
            {/* Basic Info */}
            <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">基本信息</h3>
                <div className="space-y-2">
                    <ParamItem label="任务名称" value={task.name} />
                    <ParamItem label="搜索方式" value={task.searchMethod} />
                    <ParamItem label="平台" value={params.platform || 'YouTube'} />
                </div>
            </div>

            {/* Keywords */}
            <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">关键词配置</h3>
                <div className="space-y-2">
                    <ParamItem
                        label="行业关键词"
                        value={params.industryKeywords?.length > 0 ? params.industryKeywords.join(', ') : '-'}
                        isTags
                    />
                    <ParamItem
                        label="品牌关键词"
                        value={params.brandKeywords?.length > 0 ? params.brandKeywords.join(', ') : '-'}
                        isTags
                    />
                    <ParamItem
                        label="竞品关键词"
                        value={params.competitorKeywords?.length > 0 ? params.competitorKeywords.join(', ') : '-'}
                        isTags
                    />
                    <ParamItem label="单个关键词最大红人数" value={params.maxInfluencers || '-'} />
                </div>
            </div>

            {/* Filtering */}
            <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">筛选条件</h3>
                <div className="space-y-2">
                    <ParamItem label="排序方式" value={params.sortBy || '-'} />
                    <ParamItem label="搜索维度" value={params.targetRegion || '-'} />
                    <ParamItem
                        label="目标国家"
                        value={params.targetCountries?.length > 0 ? params.targetCountries.join(', ') : '-'}
                    />
                    <ParamItem
                        label="粉丝区间"
                        value={params.fanRangeValue ? `${params.fanRangeOperator} ${params.fanRangeValue}` : '-'}
                    />
                </div>
            </div>

            {/* Exclusions */}
            <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">排除选项</h3>
                <div className="space-y-2">
                    <ParamItem
                        label="排除已搜索过的红人"
                        value={params.excludeSearched ? '是' : '否'}
                        isBoolean
                    />
                    <ParamItem
                        label="排除去重的红人"
                        value={params.excludeDeduplicated ? '是' : '否'}
                        isBoolean
                    />
                </div>
            </div>

            {/* Profile */}
            {(params.p0Types?.length > 0 || params.p1Types?.length > 0 || params.p2Types?.length > 0) && (
                <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">目标红人画像</h3>
                    <div className="space-y-2">
                        <ParamItem
                            label="P0 频道类型"
                            value={params.p0Types?.length > 0 ? params.p0Types.join(', ') : '-'}
                            isTags
                        />
                        <ParamItem
                            label="P1 频道类型"
                            value={params.p1Types?.length > 0 ? params.p1Types.join(', ') : '-'}
                            isTags
                        />
                        <ParamItem
                            label="P2 频道类型"
                            value={params.p2Types?.length > 0 ? params.p2Types.join(', ') : '-'}
                            isTags
                        />
                    </div>
                </div>
            )}
        </div>
    );

    const renderInfluencerIdSearchParams = (params) => (
        <div className="space-y-6">
            {/* Basic Info */}
            <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">基本信息</h3>
                <div className="space-y-2">
                    <ParamItem label="任务名称" value={task.name} />
                    <ParamItem label="搜索方式" value={task.searchMethod} />
                </div>
            </div>

            {/* Keywords */}
            <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">关键词配置</h3>
                <div className="space-y-2">
                    <ParamItem
                        label="行业关键词"
                        value={params.industryKeywords?.length > 0 ? params.industryKeywords.join(', ') : '-'}
                        isTags
                    />
                    <ParamItem
                        label="品牌关键词"
                        value={params.brandKeywords?.length > 0 ? params.brandKeywords.join(', ') : '-'}
                        isTags
                    />
                    <ParamItem
                        label="竞品关键词"
                        value={params.competitorKeywords?.length > 0 ? params.competitorKeywords.join(', ') : '-'}
                        isTags
                    />
                </div>
            </div>

            {/* Filtering */}
            <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">筛选条件</h3>
                <div className="space-y-2">
                    <ParamItem
                        label="目标国家"
                        value={params.targetCountries?.length > 0 ? params.targetCountries.join(', ') : '-'}
                    />
                    <ParamItem label="频道类型匹配" value={params.channelTypeMatch || '-'} />
                </div>
            </div>

            {/* Exclusions */}
            <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">排除选项</h3>
                <div className="space-y-2">
                    <ParamItem
                        label="排除已搜索过的红人"
                        value={params.excludeSearched ? '是' : '否'}
                        isBoolean
                    />
                    <ParamItem
                        label="排除去重的红人"
                        value={params.excludeDeduplicated ? '是' : '否'}
                        isBoolean
                    />
                </div>
            </div>

            {/* Profile */}
            {(params.p0Types?.length > 0 || params.p1Types?.length > 0 || params.p2Types?.length > 0) && (
                <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">目标红人画像</h3>
                    <div className="space-y-2">
                        <ParamItem
                            label="P0 频道类型"
                            value={params.p0Types?.length > 0 ? params.p0Types.join(', ') : '-'}
                            isTags
                        />
                        <ParamItem
                            label="P1 频道类型"
                            value={params.p1Types?.length > 0 ? params.p1Types.join(', ') : '-'}
                            isTags
                        />
                        <ParamItem
                            label="P2 频道类型"
                            value={params.p2Types?.length > 0 ? params.p2Types.join(', ') : '-'}
                            isTags
                        />
                    </div>
                </div>
            )}

            {/* Upload Info */}
            {params.uploadedFile && (
                <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">上传信息</h3>
                    <div className="space-y-2">
                        <ParamItem label="上传文件" value={params.uploadedFile} />
                    </div>
                </div>
            )}
        </div>
    );

    const params = task.details || task.params || {};

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">任务参数</h2>
                        <p className="text-sm text-slate-500 mt-0.5">查看任务的详细配置信息</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto h-[calc(100%-73px)] px-6 py-6">
                    {task.searchMethod === '关键词搜索'
                        ? renderKeywordSearchParams(params)
                        : renderInfluencerIdSearchParams(params)
                    }
                </div>
            </div>
        </>
    );
};

// Helper Component
const ParamItem = ({ label, value, isTags, isBoolean }) => (
    <div className="flex items-start py-2">
        <span className="text-sm text-slate-500 w-40 flex-shrink-0">{label}</span>
        <span className={`text-sm flex-1 ${isBoolean
            ? (value === '是' ? 'text-green-600 font-medium' : 'text-slate-400')
            : 'text-slate-900'
            }`}>
            {isTags && value !== '-' ? (
                <div className="flex flex-wrap gap-1.5">
                    {value.split(', ').map((tag, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700">
                            {tag}
                        </span>
                    ))}
                </div>
            ) : (
                value
            )}
        </span>
    </div>
);

export default TaskParamsDrawer;
