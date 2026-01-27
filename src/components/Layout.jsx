import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Search, Users, Settings, Bell, Menu } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProjectSelector from './ProjectSelector';

const SidebarItem = ({ to, icon: Icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3.5 rounded-soft-lg transition-all duration-200 group font-bold ${isActive
                ? 'bg-primary text-white shadow-soft-md'
                : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
            }`
        }
    >
        <Icon size={20} strokeWidth={2.5} />
        <span className="font-bold">{label}</span>
    </NavLink>
);

const Layout = () => {
    const location = useLocation();
    const { projects, currentProject, createProject, switchProject } = useApp();
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const getPageTitle = () => {
        if (location.pathname.includes('connect')) return '红人建联';
        if (location.pathname.includes('task')) return '任务详情';
        if (location.pathname.includes('exclusions')) return '排除列表';
        if (location.pathname.includes('create-task')) return '新建任务';
        return '搜索任务';
    };

    const handleCreateProject = (e) => {
        e.preventDefault();
        if (newProjectName.trim()) {
            createProject({
                name: newProjectName,
                color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                description: ''
            });
            setNewProjectName('');
            setShowCreateDialog(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-surface-tertiary text-text-primary font-sans selection:bg-primary/20 selection:text-primary">
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm animate-fade-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                w-64 fixed h-full bg-surface border-r border-border flex flex-col z-30 transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 flex items-center justify-between">
                    <h1 className="text-2xl font-heading font-black bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent tracking-tight">
                        InfluencerHub
                    </h1>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="lg:hidden p-2 text-text-tertiary hover:text-text-primary rounded-full hover:bg-surface-secondary"
                    >
                        <Settings size={20} /> {/* Using Settings icon as placeholder closer, or just tap outside */}
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <SidebarItem to="/" icon={Search} label="搜索任务" />
                    <SidebarItem to="/connect" icon={Users} label="红人建联" />
                </nav>

                <div className="p-4 mt-auto border-t border-border">
                    <div className="flex items-center gap-3 px-4 py-3 text-text-secondary hover:text-text-primary cursor-pointer transition-colors rounded-soft-lg hover:bg-surface-secondary">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-xs ring-2 ring-white shadow-soft-sm">
                            M
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-text-primary">Max User</p>
                            <p className="text-xs text-text-tertiary font-medium">Pro Team</p>
                        </div>
                        <Settings size={16} />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 min-h-screen flex flex-col relative overflow-hidden bg-surface-tertiary transition-all duration-300">
                {/* Decorative Background Elements */}
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary-dark/5 rounded-full blur-[120px] pointer-events-none" />

                {/* Top Header */}
                <header className="h-20 px-8 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md bg-surface/70 border-b border-border">
                    <div className="flex items-center gap-4 lg:gap-6">
                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-text-secondary hover:text-primary rounded-lg hover:bg-surface-secondary transition-colors"
                        >
                            <Menu size={24} />
                        </button>

                        <ProjectSelector
                            currentProject={currentProject}
                            projects={projects}
                            onProjectChange={switchProject}
                            onCreateProject={() => setShowCreateDialog(true)}
                        />
                        <div className="hidden lg:block h-6 w-px bg-border"></div>
                        <div className="hidden md:block">
                            <h2 className="text-xl font-heading font-bold text-text-primary animate-fade-in">{getPageTitle()}</h2>
                            <p className="text-xs text-text-tertiary font-medium">Manage your influencer campaigns</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2.5 text-text-tertiary hover:text-primary hover:bg-surface-secondary rounded-full transition-all relative border border-transparent hover:border-border hover:shadow-soft-sm">
                            <Bell size={20} />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full border-2 border-white ring-1 ring-error/20" />
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 p-4 lg:p-8 overflow-y-auto scroll-smooth">
                    <Outlet />
                </div>
            </main>

            {/* Project Creation Dialog */}
            {showCreateDialog && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-surface p-6 rounded-soft-xl shadow-soft-xl w-full max-w-md border border-border">
                        <h3 className="text-lg font-heading font-bold mb-4 text-text-primary">Create New Project</h3>
                        <form onSubmit={handleCreateProject}>
                            <input
                                type="text"
                                value={newProjectName}
                                onChange={(e) => setNewProjectName(e.target.value)}
                                placeholder="Project Name"
                                className="w-full p-3 bg-surface-secondary border border-border rounded-soft-lg mb-6 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all font-medium"
                                autoFocus
                                required
                            />
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateDialog(false)}
                                    className="px-5 py-2.5 rounded-soft-lg border border-border text-text-secondary hover:bg-surface-secondary hover:text-text-primary font-bold text-sm transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-soft-lg bg-primary text-white hover:bg-primary-hover font-bold text-sm shadow-soft-md hover:shadow-glow-orange transition-all transform hover:-translate-y-0.5"
                                >
                                    Create Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Layout;
