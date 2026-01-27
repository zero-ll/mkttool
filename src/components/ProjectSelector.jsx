import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Plus } from 'lucide-react';

const ProjectSelector = ({ currentProject, projects, onProjectChange, onCreateProject }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border-subtle rounded-xl hover:bg-gray-50/50 hover:border-border transition-all shadow-sm hover:shadow"
            >
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-primary/20"></div>
                    <span className="text-sm font-bold text-text-primary">{currentProject?.name || 'Select Project'}</span>
                </div>
                <ChevronDown size={16} className={`text-text-tertiary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-64 bg-white border border-border-subtle rounded-xl shadow-xl overflow-hidden animate-fade-in">
                    <div className="px-4 py-3 border-b border-border-subtle bg-gray-50/50">
                        <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Switch Workspace</p>
                    </div>

                    <div className="max-h-60 overflow-y-auto p-1">
                        {projects.map((project) => (
                            <button
                                key={project.id}
                                onClick={() => {
                                    onProjectChange(project);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-left mb-1 ${currentProject?.id === project.id
                                    ? 'bg-primary/5 text-primary'
                                    : 'hover:bg-gray-50 text-text-secondary hover:text-text-primary'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-2.5 h-2.5 rounded-full"
                                        style={{ backgroundColor: project.color || '#4f46e5' }}
                                    ></div>
                                    <span className="text-sm font-bold">{project.name}</span>
                                </div>
                                {currentProject?.id === project.id && (
                                    <Check size={16} strokeWidth={3} className="text-primary" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="border-t border-border-subtle p-2 bg-gray-50/50">
                        <button
                            onClick={() => {
                                onCreateProject();
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-primary hover:bg-white hover:shadow-sm border border-transparent hover:border-border-subtle rounded-lg transition-all font-bold text-sm"
                        >
                            <Plus size={16} strokeWidth={2.5} />
                            <span>Create Project</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectSelector;
