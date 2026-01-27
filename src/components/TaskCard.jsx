import React from 'react';
import { CheckCircle2, Loader2, Eye, Edit3, Trash2, Settings2, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TaskCard = ({ task, onRename, onDelete, onViewParams }) => {
    const navigate = useNavigate();

    const getStatusConfig = (status) => {
        if (status === 'completed') {
            return {
                icon: CheckCircle2,
                text: '已完成',
                className: 'bg-success/10 text-success border-success/20'
            };
        }
        return {
            icon: Loader2,
            text: '进行中',
            className: 'bg-warning/10 text-warning border-warning/20'
        };
    };

    const statusConfig = getStatusConfig(task.status);
    const StatusIcon = statusConfig.icon;

    return (
        <div
            className={`group bg-surface border border-border rounded-soft-xl p-6 transition-all duration-200 animate-scale-in ${task.status === 'completed' ? 'hover:shadow-soft-lg hover:-translate-y-1 cursor-pointer' : 'cursor-default'}`}
            onClick={() => task.status === 'completed' && navigate(`/task/${task.id}`)}
        >
            {/* Header with Status */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 flex items-center gap-3">
                    <h3 className={`text-lg font-heading font-bold transition-colors ${task.status === 'completed' ? 'text-text-primary group-hover:text-primary' : 'text-text-secondary'}`}>
                        {task.name}
                    </h3>
                    {/* Status Badge moved here */}
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusConfig.className}`}>
                        <StatusIcon size={12} className={task.status === 'in-progress' ? 'animate-spin' : ''} strokeWidth={2.5} />
                        {statusConfig.text}
                    </div>
                </div>

                {/* Actions Menu */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            // Open menu
                        }}
                        className="p-2 hover:bg-surface-secondary rounded-lg transition-colors"
                    >
                        <MoreVertical size={18} className="text-text-tertiary" />
                    </button>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="flex items-center justify-between gap-2 mb-6 pt-4 border-t border-border-subtle">
                {/* Method */}
                <div className="flex flex-col min-w-[70px]">
                    <p className="text-xs text-text-tertiary mb-1.5">创建方式</p>
                    <div className="flex items-center gap-1.5">
                        <Loader2 size={13} className="text-text-tertiary" />
                        <p className="text-sm font-semibold text-text-secondary truncate" title={task.searchMethod}>{task.searchMethod || '关键词'}</p>
                    </div>
                </div>

                {/* Results */}
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        if (task.status === 'completed') navigate(`/task/${task.id}`);
                    }}
                    className={`flex flex-col min-w-[60px] ${task.status === 'completed' ? 'cursor-pointer hover:opacity-80' : ''}`}
                >
                    <p className="text-xs text-text-tertiary mb-1.5">搜索结果</p>
                    <p className="text-sm font-bold text-text-primary">
                        {task.status === 'completed' ? `${task.results?.length || 0} 个` : '-'}
                    </p>
                </div>

                {/* Time */}
                <div className="flex flex-col min-w-[80px]">
                    <p className="text-xs text-text-tertiary mb-1.5">创建时间</p>
                    <p className="text-sm font-semibold text-text-secondary truncate" title={task.createdAt}>{task.createdAt}</p>
                </div>

                {/* Creator */}
                <div className="flex flex-col min-w-[70px]">
                    <p className="text-xs text-text-tertiary mb-1.5">创建人</p>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold ring-1 ring-primary/20">
                            {(task.creator || 'M').charAt(0)}
                        </div>
                        <span className="text-sm font-semibold text-text-secondary truncate">{task.creator || 'Max'}</span>
                    </div>
                </div>
            </div>

            {/* Icon Actions Row - Replaced Grid with Flex Row Icons */}
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-dashed border-border-subtle opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0" onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={() => task.status === 'completed' && navigate(`/task/${task.id}`)}
                    disabled={task.status !== 'completed'}
                    className={`flex-1 h-10 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${task.status === 'completed' ? 'bg-primary/10 hover:bg-primary text-primary hover:text-white' : 'bg-surface-secondary text-text-tertiary cursor-not-allowed opacity-50'}`}
                    title={task.status === 'completed' ? '查看结果' : '任务进行中，不可查看'}
                >
                    <Eye size={16} />
                    <span className="text-xs font-bold">查看结果</span>
                </button>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onViewParams?.(task)}
                        className="w-10 h-10 bg-surface-secondary hover:bg-primary/10 text-text-secondary hover:text-primary rounded-xl transition-all border border-transparent hover:border-primary/20 flex items-center justify-center"
                        title="查看参数"
                    >
                        <Settings2 size={16} />
                    </button>
                    <button
                        onClick={() => onRename?.(task)}
                        className="w-10 h-10 bg-surface-secondary hover:bg-primary/10 text-text-secondary hover:text-primary rounded-xl transition-all border border-transparent hover:border-primary/20 flex items-center justify-center"
                        title="重命名"
                    >
                        <Edit3 size={16} />
                    </button>
                    <button
                        onClick={() => {
                            if (task.status === 'completed') {
                                if (confirm('确定要删除此任务吗？')) onDelete?.(task.id);
                            }
                        }}
                        disabled={task.status !== 'completed'}
                        className={`w-10 h-10 rounded-xl transition-all border border-transparent flex items-center justify-center ${task.status === 'completed' ? 'bg-error/5 hover:bg-error text-error hover:text-white hover:border-error/20' : 'bg-surface-secondary text-text-tertiary cursor-not-allowed opacity-50'}`}
                        title={task.status === 'completed' ? '删除' : '任务进行中，不可删除'}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
