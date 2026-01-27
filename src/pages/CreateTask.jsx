import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Search, ChevronDown, Video, User, Sparkles, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import TagInput from '../components/TagInput';
import MultiSelect from '../components/MultiSelect';

const CreateTask = () => {
    const navigate = useNavigate();
    const { createTask } = useApp();
    const [activeTab, setActiveTab] = useState('keyword'); // 'keyword' or 'influencer'
    const [currentStep, setCurrentStep] = useState(1); // 步骤：1-基本信息, 2-搜索配置, 3-目标画像

    // Keyword Search State
    const [keywordForm, setKeywordForm] = useState({
        taskName: '',
        industryKeywords: [],
        brandKeywords: [],
        competitorKeywords: [],
        maxInfluencers: '50',
        platform: 'YouTube',
        sortBy: '相关性',
        targetRegion: '按视频',
        targetCountries: [],
        fanRangeOperator: '>=',
        fanRangeValue: '',
        excludeSearched: true,
        excludeDeduplicated: true,

        // Target Influencer Profile
        p0Types: [],
        p1Types: [],
        p2Types: []
    });

    // Influencer ID Search State
    const [idForm, setIdForm] = useState({
        name: '',
        industryKeywords: [],
        brandKeywords: [],
        competitorKeywords: [],
        targetCountries: [],
        channelTypeMatch: '相关性',
        excludeSearched: true,
        excludeDeduplicated: true,

        // Target Influencer Profile
        p0Types: [],
        p1Types: [],
        p2Types: []
    });

    const handleNext = () => {
        // 验证当前步骤
        if (currentStep === 1) {
            if (activeTab === 'keyword') {
                if (!keywordForm.taskName) {
                    alert('请填写任务名称');
                    return;
                }
                if (keywordForm.industryKeywords.length === 0) {
                    alert('行业关键词为必填项，请至少添加一个关键词');
                    return;
                }
                if (keywordForm.brandKeywords.length === 0) {
                    alert('本品关键词为必填项，请至少添加一个关键词');
                    return;
                }
                if (keywordForm.competitorKeywords.length === 0) {
                    alert('竞品关键词为必填项，请至少添加一个关键词');
                    return;
                }
            } else {
                if (!idForm.name) {
                    alert('请填写任务名称');
                    return;
                }
            }
        }

        if (currentStep === 2) {
            if (activeTab === 'keyword') {
                if (keywordForm.targetCountries.length === 0) {
                    alert('请选择目标国家');
                    return;
                }
            } else {
                if (idForm.targetCountries.length === 0) {
                    alert('请选择目标国家');
                    return;
                }
            }
        }

        if (currentStep === 3) {
            if (activeTab === 'keyword') {
                if (keywordForm.p0Types.length === 0) {
                    alert('P0 频道类型为必填项，请至少添加一个类型');
                    return;
                }
                if (keywordForm.p1Types.length === 0) {
                    alert('P1 频道类型为必填项，请至少添加一个类型');
                    return;
                }
                if (keywordForm.p2Types.length === 0) {
                    alert('P2 频道类型为必填项，请至少添加一个类型');
                    return;
                }
            } else {
                if (idForm.p0Types.length === 0) {
                    alert('P0 频道类型为必填项，请至少添加一个类型');
                    return;
                }
                if (idForm.p1Types.length === 0) {
                    alert('P1 频道类型为必填项，请至少添加一个类型');
                    return;
                }
                if (idForm.p2Types.length === 0) {
                    alert('P2 频道类型为必填项，请至少添加一个类型');
                    return;
                }
            }
        }

        setCurrentStep(currentStep + 1);
    };

    const handlePrevious = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let newTaskData = {};

        if (activeTab === 'keyword') {
            // Validate Fan Range
            if (keywordForm.fanRangeValue && parseInt(keywordForm.fanRangeValue) < 10) {
                alert('粉丝数区间数值不能小于 10');
                return;
            }

            newTaskData = {
                name: keywordForm.taskName,
                keywords: keywordForm.industryKeywords.join(', '),
                platform: keywordForm.platform,
                searchMethod: '关键词搜索',
                details: { ...keywordForm }
            };
        } else {
            newTaskData = {
                name: idForm.name,
                keywords: '红人ID搜索',
                platform: 'YouTube',
                searchMethod: '红人ID搜索',
                details: { ...idForm }
            };
        }

        createTask(newTaskData);
        navigate('/');
    };

    // 步骤指示器
    const steps = [
        { number: 1, title: '基本信息', desc: 'Task Details' },
        { number: 2, title: '搜索配置', desc: 'Search Config' },
        { number: 3, title: '目标画像', desc: 'Target Profile' }
    ];

    return (
        <div className="animate-fade-in max-w-6xl mx-auto pb-16 pt-8">
            {/* Header */}
            <div className="mb-10 text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-text-secondary mb-3">
                    <span className="cursor-pointer hover:text-text-primary transition-colors" onClick={() => navigate('/')}>Tasks</span>
                    <span className="text-text-tertiary">›</span>
                    <span className="font-medium text-text-primary">Create New Task</span>
                </div>
                <h1 className="text-4xl font-extrabold text-text-primary tracking-tight mb-3">Define Your Task</h1>
                <p className="text-text-secondary text-lg max-w-2xl mx-auto">Set the foundation for your KOL discovery by naming your task and adding initial keywords.</p>
            </div>

            {/* Main Content Card - Glass Effect */}
            <div className="glass-panel overflow-hidden relative z-10">
                {/* Step Indicator - Clean Look */}
                <div className="pt-8 pb-10 px-8 relative">
                    <div className="absolute top-12 left-1/4 right-1/4 h-[2px] bg-gray-100 -z-10"></div>
                    <div className="absolute top-12 left-1/4 h-[2px] bg-primary transition-all duration-500 -z-10" style={{ width: `${((currentStep - 1) / 2) * 50}%` }}></div>

                    <div className="flex justify-between max-w-xl mx-auto relative">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex flex-col items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-md ${currentStep === step.number
                                    ? 'bg-primary text-white scale-110 shadow-glow ring-4 ring-primary/20'
                                    : currentStep > step.number
                                        ? 'bg-primary/10 text-primary border border-primary/20'
                                        : 'bg-white text-text-tertiary border border-border'
                                    }`}>
                                    {currentStep > step.number ? '✓' : step.number}
                                </div>
                                <div className="text-center">
                                    <p className={`text-sm font-bold transition-colors ${currentStep === step.number ? 'text-primary' :
                                        currentStep > step.number ? 'text-text-primary' : 'text-text-tertiary'
                                        }`}>
                                        {step.title}
                                    </p>
                                    <p className="text-xs text-text-tertiary mt-0.5 font-medium">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Render Tabs ONLY on Step 1 */}
                {currentStep === 1 && (
                    <div className="flex justify-center mb-8">
                        <div className="bg-gray-100/50 p-1.5 rounded-xl inline-flex shadow-inner">
                            <button
                                onClick={() => setActiveTab('keyword')}
                                className={`flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'keyword'
                                    ? 'bg-white text-primary shadow-sm ring-1 ring-black/5'
                                    : 'text-text-secondary hover:text-text-primary hover:bg-white/50'
                                    }`}
                            >
                                <Search size={16} strokeWidth={2.5} />
                                Keyword Search
                            </button>
                            <button
                                onClick={() => setActiveTab('influencer')}
                                className={`flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'influencer'
                                    ? 'bg-white text-primary shadow-sm ring-1 ring-black/5'
                                    : 'text-text-secondary hover:text-text-primary hover:bg-white/50'
                                    }`}
                            >
                                <Upload size={16} strokeWidth={2.5} />
                                Upload List
                            </button>
                        </div>
                    </div>
                )}


                {/* Form Content */}
                <form onSubmit={handleSubmit} className="px-12 pb-12">
                    {activeTab === 'keyword' ? (
                        <>
                            {/* Step 1: 基本信息 */}
                            {currentStep === 1 && (
                                <div className="space-y-8 animate-fade-in">
                                    <div className="max-w-3xl mx-auto space-y-6">
                                        {/* Task Name */}
                                        <div>
                                            <label className="block text-sm font-bold text-text-primary mb-2">
                                                Task Name <span className="text-primary">*</span>
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="e.g. Summer 2024 Tech Reviewers"
                                                className="w-full bg-gray-50/50 border border-border-subtle rounded-xl px-4 py-3.5 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-[15px] shadow-sm"
                                                value={keywordForm.taskName}
                                                onChange={(e) => setKeywordForm({ ...keywordForm, taskName: e.target.value })}
                                            />
                                        </div>

                                        {/* Industry Keywords - Highlighting this as key input */}
                                        <div className="bg-orange-50/30 p-6 rounded-2xl border border-orange-100/50">
                                            <TagInput
                                                label={<span className="text-primary font-bold flex items-center gap-2"><Sparkles size={14} /> Industry Keywords</span>}
                                                required
                                                placeholder="Smart home, IoT, AI gadgets..."
                                                value={keywordForm.industryKeywords}
                                                onChange={(val) => setKeywordForm({ ...keywordForm, industryKeywords: val })}
                                                className="bg-white border-orange-100"
                                                theme="warm"
                                            />
                                            <p className="text-xs text-text-tertiary mt-2 ml-1">Type keywords and press Enter. Add at least one to start.</p>
                                        </div>

                                        {/* Brand & Competitor Keywords */}
                                        <div className="grid grid-cols-2 gap-6">
                                            <TagInput
                                                label="Brand Keywords"
                                                required
                                                placeholder="Your brand name or product names"
                                                value={keywordForm.brandKeywords}
                                                onChange={(val) => setKeywordForm({ ...keywordForm, brandKeywords: val })}
                                            />

                                            <TagInput
                                                label="Competitor Keywords"
                                                required
                                                placeholder="Competitor names or similar products"
                                                value={keywordForm.competitorKeywords}
                                                onChange={(val) => setKeywordForm({ ...keywordForm, competitorKeywords: val })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: 搜索配置 */}
                            {currentStep === 2 && (
                                <div className="space-y-8 animate-fade-in">
                                    <div className="grid grid-cols-2 gap-8">
                                        {/* Videos per Keyword */}
                                        <div>
                                            <label className="block text-sm font-bold text-text-primary mb-2">
                                                Videos per Keyword <span className="text-primary">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    required
                                                    type="number"
                                                    min="1"
                                                    max="100"
                                                    className="w-full bg-gray-50/50 border border-border-subtle rounded-xl px-4 py-3.5 text-text-primary font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                    value={keywordForm.maxInfluencers}
                                                    onChange={(e) => setKeywordForm({ ...keywordForm, maxInfluencers: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        {/* Sort Order */}
                                        <div>
                                            <label className="block text-sm font-bold text-text-primary mb-2">
                                                Sort Order
                                            </label>
                                            <div className="relative">
                                                <select
                                                    className="w-full bg-gray-50/50 border border-border-subtle rounded-xl px-4 py-3.5 text-text-primary font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                                                    value={keywordForm.sortBy}
                                                    onChange={(e) => setKeywordForm({ ...keywordForm, sortBy: e.target.value })}
                                                >
                                                    <option value="相关性">Relevance (Default)</option>
                                                    <option value="观看次数">View Count</option>
                                                    <option value="发布日期">Date Published</option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-tertiary">
                                                    <ChevronDown size={18} strokeWidth={2.5} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Country Preference */}
                                    <div>
                                        <MultiSelect
                                            label="Country Preference"
                                            required
                                            placeholder="Select target countries"
                                            value={keywordForm.targetCountries}
                                            onChange={(val) => setKeywordForm({ ...keywordForm, targetCountries: val })}
                                        />
                                    </div>

                                    {/* Search Dimension - Segmented Control */}
                                    <div>
                                        <label className="block text-sm font-bold text-text-primary mb-2">
                                            Search Dimension
                                        </label>
                                        <div className="flex bg-gray-100 p-1.5 rounded-xl max-w-md">
                                            <button
                                                type="button"
                                                onClick={() => setKeywordForm({ ...keywordForm, targetRegion: '按视频' })}
                                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${keywordForm.targetRegion === '按视频'
                                                    ? 'bg-white text-primary shadow-sm'
                                                    : 'text-text-secondary hover:text-text-primary'
                                                    }`}
                                            >
                                                <Video size={16} className={keywordForm.targetRegion === '按视频' ? 'fill-current' : ''} />
                                                Videos
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setKeywordForm({ ...keywordForm, targetRegion: '按频道' })}
                                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${keywordForm.targetRegion === '按频道'
                                                    ? 'bg-white text-primary shadow-sm'
                                                    : 'text-text-secondary hover:text-text-primary'
                                                    }`}
                                            >
                                                <User size={16} className={keywordForm.targetRegion === '按频道' ? 'fill-current' : ''} />
                                                Channels
                                            </button>
                                        </div>
                                    </div>

                                    {/* Exclusion Options */}
                                    <div className="space-y-4 pt-2">
                                        <label className="flex items-start gap-4 cursor-pointer group p-4 border border-border-subtle rounded-xl hover:border-primary/30 hover:bg-orange-50/20 transition-all">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="peer sr-only"
                                                    checked={keywordForm.excludeSearched}
                                                    onChange={(e) => setKeywordForm({ ...keywordForm, excludeSearched: e.target.checked })}
                                                />
                                                <div className="w-5 h-5 border-2 border-text-tertiary rounded flex items-center justify-center peer-checked:bg-primary peer-checked:border-primary transition-all">
                                                    <svg className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">Exclude previously searched influencers</span>
                                                <p className="text-xs text-text-secondary mt-1">Smartly filters out influencers you've already discovered in other tasks.</p>
                                            </div>
                                        </label>

                                        <label className="flex items-start gap-4 cursor-pointer group p-4 border border-border-subtle rounded-xl hover:border-primary/30 hover:bg-orange-50/20 transition-all">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="peer sr-only"
                                                    checked={keywordForm.excludeDeduplicated}
                                                    onChange={(e) => setKeywordForm({ ...keywordForm, excludeDeduplicated: e.target.checked })}
                                                />
                                                <div className="w-5 h-5 border-2 border-text-tertiary rounded flex items-center justify-center peer-checked:bg-primary peer-checked:border-primary transition-all">
                                                    <svg className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">Exclude deduplicated influencers</span>
                                                <p className="text-xs text-text-secondary mt-1">Avoids influencers from your global exclusion list.</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: 目标画像 */}
                            {currentStep === 3 && (
                                <div className="space-y-8 animate-fade-in">
                                    <div className="text-center mb-8">
                                        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <User size={32} />
                                        </div>
                                        <h3 className="text-xl font-bold text-text-primary">Target Influencer Profile</h3>
                                        <p className="text-sm text-text-secondary mt-2 max-w-md mx-auto">Analyze channel content to find the best match. Filtering by types helps improve relevance score.</p>
                                    </div>

                                    <div className="space-y-6">
                                        <TagInput
                                            label="P0 Channel Types (Priority)"
                                            required
                                            placeholder="e.g. Tech Reviews, Gadget Unboxing..."
                                            value={keywordForm.p0Types}
                                            onChange={(val) => setKeywordForm({ ...keywordForm, p0Types: val })}
                                        />
                                        <TagInput
                                            label="P1 Channel Types (Secondary)"
                                            required
                                            placeholder="e.g. Lifestyle, DIY..."
                                            value={keywordForm.p1Types}
                                            onChange={(val) => setKeywordForm({ ...keywordForm, p1Types: val })}
                                        />
                                        <TagInput
                                            label="P2 Channel Types (Acceptable)"
                                            required
                                            placeholder="e.g. General Tech, News..."
                                            value={keywordForm.p2Types}
                                            onChange={(val) => setKeywordForm({ ...keywordForm, p2Types: val })}
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        // Influencer ID Search Form
                        <>
                            {/* Step 1: 基本信息 */}
                            {currentStep === 1 && (
                                <div className="space-y-6 max-w-2xl mx-auto animate-fade-in">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            Task Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g. Competitor Analysis Q3"
                                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all font-medium"
                                            value={idForm.name}
                                            onChange={(e) => setIdForm({ ...idForm, name: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            Upload List <span className="text-red-500">*</span>
                                        </label>
                                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-orange-400 hover:bg-orange-50/10 transition-colors cursor-pointer group">
                                            <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                                <Upload size={24} />
                                            </div>
                                            <p className="text-sm font-medium text-slate-900 mb-1">Click to upload or drag and drop</p>
                                            <p className="text-xs text-slate-500">Excel or CSV files only</p>
                                            <input type="file" className="hidden" accept=".xlsx,.xls,.csv" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: 搜索配置 */}
                            {currentStep === 2 && (
                                <div className="space-y-6 max-w-2xl mx-auto animate-fade-in">
                                    <div className="grid grid-cols-3 gap-4">
                                        <TagInput
                                            label="Industry Keywords"
                                            placeholder="Press enter..."
                                            value={idForm.industryKeywords}
                                            onChange={(val) => setIdForm({ ...idForm, industryKeywords: val })}
                                        />
                                        <TagInput
                                            label="Brand Keywords"
                                            placeholder="Press enter..."
                                            value={idForm.brandKeywords}
                                            onChange={(val) => setIdForm({ ...idForm, brandKeywords: val })}
                                        />
                                        <TagInput
                                            label="Competitor Keywords"
                                            placeholder="Press enter..."
                                            value={idForm.competitorKeywords}
                                            onChange={(val) => setIdForm({ ...idForm, competitorKeywords: val })}
                                        />
                                    </div>

                                    <MultiSelect
                                        label="Country Preference"
                                        required
                                        placeholder="Search countries..."
                                        value={idForm.targetCountries}
                                        onChange={(val) => setIdForm({ ...idForm, targetCountries: val })}
                                    />

                                    <div className="space-y-3 pt-4">
                                        <label className="flex items-start gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 mt-0.5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                                                checked={idForm.excludeSearched}
                                                onChange={(e) => setIdForm({ ...idForm, excludeSearched: e.target.checked })}
                                            />
                                            <div>
                                                <span className="text-sm font-medium text-slate-700">Exclude previously searched influencers</span>
                                                <p className="text-xs text-slate-500 mt-0.5">Won't show influencers from other tasks</p>
                                            </div>
                                        </label>
                                        <label className="flex items-start gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 mt-0.5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                                                checked={idForm.excludeDeduplicated}
                                                onChange={(e) => setIdForm({ ...idForm, excludeDeduplicated: e.target.checked })}
                                            />
                                            <div>
                                                <span className="text-sm font-medium text-slate-700">Exclude deduplicated influencers</span>
                                                <p className="text-xs text-slate-500 mt-0.5">Won't show influencers from exclusion list</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: 目标画像 */}
                            {currentStep === 3 && (
                                <div className="space-y-6 max-w-2xl mx-auto animate-fade-in">
                                    <div className="text-center mb-8">
                                        <h3 className="text-lg font-bold text-slate-900">Target Influencer Profile</h3>
                                        <p className="text-sm text-slate-500 mt-1">Define your ideal influencer types (optional)</p>
                                    </div>

                                    <TagInput
                                        label="P0 Channel Types (Priority)"
                                        placeholder="e.g. Tech Reviews, Gadget Unboxing..."
                                        value={idForm.p0Types}
                                        onChange={(val) => setIdForm({ ...idForm, p0Types: val })}
                                    />
                                    <TagInput
                                        label="P1 Channel Types (Secondary)"
                                        placeholder="e.g. Lifestyle, DIY..."
                                        value={idForm.p1Types}
                                        onChange={(val) => setIdForm({ ...idForm, p1Types: val })}
                                    />
                                    <TagInput
                                        label="P2 Channel Types (Acceptable)"
                                        placeholder="e.g. General Tech, News..."
                                        value={idForm.p2Types}
                                        onChange={(val) => setIdForm({ ...idForm, p2Types: val })}
                                    />
                                </div>
                            )}
                        </>
                    )}

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>

                        <div className="flex items-center gap-3">
                            {currentStep > 1 && (
                                <button
                                    type="button"
                                    onClick={handlePrevious}
                                    className="px-6 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors font-semibold"
                                >
                                    Previous
                                </button>
                            )}

                            {currentStep < 3 ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="flex items-center gap-2 px-8 py-2.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-orange-500/20 transition-all transform hover:-translate-y-0.5"
                                >
                                    Next Step
                                    <ChevronRight size={16} />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-8 py-2.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-orange-500/20 transition-all transform hover:-translate-y-0.5"
                                >
                                    <Sparkles size={16} className="fill-current" />
                                    Start Search Task
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTask;
