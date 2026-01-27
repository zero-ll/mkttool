import React from 'react';
import { Clock, Users, CheckCircle2, Loader2, Eye, Edit3, Trash2, MoreVertical } from 'lucide-react';
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
            className="group bg-surface border border-border rounded-soft-xl p-6 hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer animate-scale-in"
            onClick={() => navigate(`/task/${task.id}`)}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-heading font-bold text-text-primary mb-1 group-hover:text-primary transition-colors">
                        {task.name}
                    </h3>
                    <p className="text-xs text-text-tertiary font-medium">{task.searchMethod || '关键词搜索'}</p>
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

            {/* Status Badge */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${statusConfig.className} mb-4`}>
                <StatusIcon size={12} className={task.status === 'in-progress' ? 'animate-spin' : ''} strokeWidth={2.5} />
                {statusConfig.text}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div
                    className="flex items-center gap-2 cursor-pointer hover:bg-primary/5 rounded-lg p-2 -m-2 transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (task.status === 'completed') navigate(`/task/${task.id}`);
                    }}
                    title={task.status === 'completed' ? '点击查看搜索结果' : ''}
                >
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Users size={16} className="text-primary" />
                    </div>
                    <div>
                        <p className="text-xs text-text-tertiary">搜索结果</p>
                        <p className="text-sm font-bold text-text-primary">
                            {task.status === 'completed' ? `${task.results?.length || 0}` : '-'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-info/10 rounded-lg">
                        <Clock size={16} className="text-info" />
                    </div>
                    <div>
                        <p className="text-xs text-text-tertiary">创建时间</p>
                        <p className="text-sm font-bold text-text-primary">{task.createdAt}</p>
                    </div>
                </div>
            </div>

            {/* Creator */}
            <div className="flex items-center gap-2 pt-4 border-t border-border">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xs font-bold">
                    {(task.creator || 'M').charAt(0)}
                </div>
                <div className="flex-1">
                    <p className="text-[10px] text-text-tertiary font-medium">创建人</p>
                    <p className="text-xs text-text-secondary font-medium">{task.creator || 'Max User'}</p>
                </div>
            </div>

            {/* Quick Actions (Hover) */}
            <div className="grid grid-cols-2 gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={() => navigate(`/task/${task.id}`)}
                    className="px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                    <Eye size={14} />
                    查看结果
                </button>
                <button
                    onClick={() => onViewParams?.(task)}
                    className="px-3 py-2 neu-btn-secondary text-xs flex items-center justify-center gap-1.5"
                >
                    <MoreVertical size={14} />
                    查看参数
                </button>
                <button
                    onClick={() => onRename?.(task)}
                    className="px-3 py-2 bg-surface-secondary hover:bg-border text-text-secondary hover:text-text-primary rounded-lg transition-colors flex items-center justify-center gap-1.5 text-xs font-bold"
                >
                    <Edit3 size={14} />
                    重命名
                </button>
                <button
                    onClick={() => {
                        if (confirm('确定要删除此任务吗？')) onDelete?.(task.id);
                    }}
                    className="px-3 py-2 bg-error/10 hover:bg-error/20 text-error rounded-lg transition-colors flex items-center justify-center gap-1.5 text-xs font-bold"
                >
                    <Trash2 size={14} />
                    删除
                </button>
            </div>
        </div>
    );
};

export default TaskCard;
