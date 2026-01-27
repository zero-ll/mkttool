import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Upload } from 'lucide-react';
import { useApp } from '../context/AppContext';
import TaskCard from '../components/TaskCard';
import TaskParamsDrawer from '../components/TaskParamsDrawer';

const SearchTasks = () => {
    const { tasks, deleteTask, renameTask } = useApp();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [renamingTask, setRenamingTask] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleViewParams = (task) => {
        setSelectedTask(task);
        setIsDrawerOpen(true);
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
        setTimeout(() => setSelectedTask(null), 300);
    };

    const handleRenameTask = (task) => {
        setRenamingTask(task);
    };

    const handleDeleteTask = (taskId) => {
        deleteTask(taskId);
    };

    // Filter tasks based on search
    const filteredTasks = tasks.filter(task =>
        task.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="bg-surface border border-border p-6 rounded-soft-xl shadow-soft-sm">
                <div className="flex items-center justify-between gap-6">
                    {/* Search Bar */}
                    <div className="relative flex-1 max-w-xl group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="搜索任务..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-surface-secondary border border-border rounded-soft-lg pl-12 pr-4 py-3 text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/exclusions')}
                            className="px-5 py-2.5 bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-surface-secondary rounded-soft-lg text-sm font-bold flex items-center gap-2 transition-all shadow-soft-sm hover:shadow-soft"
                        >
                            <Upload size={18} />
                            排除列表
                        </button>
                        <button
                            onClick={() => navigate('/create-task')}
                            className="px-6 py-2.5 bg-primary hover:bg-primary-hover active:scale-95 text-white rounded-soft-lg text-sm font-bold flex items-center gap-2 shadow-soft-md hover:shadow-glow-orange transition-all transform hover:-translate-y-0.5"
                        >
                            <Plus size={18} strokeWidth={2.5} />
                            新建任务
                        </button>
                    </div>
                </div>
            </div>

            {/* Task Grid */}
            {filteredTasks.length === 0 ? (
                <div className="bg-surface border border-border rounded-soft-xl p-16 text-center">
                    <div className="max-w-md mx-auto">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search size={32} className="text-primary" />
                        </div>
                        <h3 className="text-lg font-heading font-bold text-text-primary mb-2">
                            {searchQuery ? '未找到任务' : '暂无任务'}
                        </h3>
                        <p className="text-sm text-text-tertiary mb-6">
                            {searchQuery
                                ? '请尝试调整搜索关键词'
                                : '创建您的第一个红人搜索任务'}
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={() => navigate('/create-task')}
                                className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-soft-lg font-bold text-sm shadow-soft-md hover:shadow-glow-orange transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2"
                            >
                                <Plus size={18} />
                                创建任务
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onRename={handleRenameTask}
                            onDelete={handleDeleteTask}
                            onViewParams={handleViewParams}
                        />
                    ))}
                </div>
            )}

            {/* Task Params Drawer */}
            <TaskParamsDrawer
                isOpen={isDrawerOpen}
                onClose={closeDrawer}
                task={selectedTask}
            />

            {/* Rename Modal */}
            {renamingTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-surface w-full max-w-md rounded-soft-xl border border-border shadow-soft-xl overflow-hidden">
                        <div className="p-6 border-b border-border">
                            <h3 className="text-lg font-heading font-bold text-text-primary">重命名任务</h3>
                        </div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                renameTask(renamingTask.id, e.target.newName.value);
                                setRenamingTask(null);
                            }}
                            className="p-6 space-y-4"
                        >
                            <input
                                name="newName"
                                defaultValue={renamingTask.name}
                                autoFocus
                                className="w-full bg-surface-secondary border border-border rounded-soft-lg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                placeholder="输入任务名称..."
                            />
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRenamingTask(null)}
                                    className="px-5 py-2.5 bg-surface-secondary hover:bg-border text-text-secondary hover:text-text-primary rounded-soft-lg text-sm font-bold transition-all"
                                >
                                    取消
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-soft-lg text-sm font-bold shadow-soft-md hover:shadow-glow-orange transition-all"
                                >
                                    保存
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchTasks;
