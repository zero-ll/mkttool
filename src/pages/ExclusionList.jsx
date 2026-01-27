import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Search, Trash2 } from 'lucide-react';

const ExclusionList = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    // Mock 数据
    const [exclusions, setExclusions] = useState([
        {
            id: 'excl_001',
            influencerId: 'UC1234567890',
            influencerName: 'Beauty Guru Channel',
            platform: 'YouTube',
            uploadedAt: '2024-01-15 10:30:00',
            uploadedBy: 'Max User'
        },
        {
            id: 'excl_002',
            influencerId: 'UC0987654321',
            influencerName: 'Tech Review Pro',
            platform: 'YouTube',
            uploadedAt: '2024-01-18 14:20:00',
            uploadedBy: 'Max User'
        },
        {
            id: 'excl_003',
            influencerId: 'UC1122334455',
            influencerName: 'Fashion Lifestyle',
            platform: 'YouTube',
            uploadedAt: '2024-01-20 09:15:00',
            uploadedBy: 'Max User'
        }
    ]);

    const handleUpload = () => {
        // TODO: 实现文件上传逻辑
        alert('文件上传功能待实现');
    };

    const handleDelete = (id) => {
        if (confirm('确定要删除这个排除红人吗？')) {
            setExclusions(exclusions.filter(item => item.id !== id));
        }
    };

    const filteredExclusions = exclusions.filter(item =>
        item.influencerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.influencerId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in max-w-7xl">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/')}
                    className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-slate-900 transition-colors border border-transparent hover:border-slate-200 hover:shadow-sm"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">排除红人管理</h1>
                    <p className="text-slate-500 text-sm mt-1">管理需要去重的红人名单</p>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="搜索红人名称或ID..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Upload Button */}
                    <button
                        onClick={handleUpload}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        <Upload size={18} />
                        上传排除名单
                    </button>
                </div>

                {/* Template Download Hint */}
                <p className="text-xs text-slate-500 mt-3">
                    💡 上传格式：Excel (.xlsx, .xls) 或 CSV，需包含字段：红人ID、红人名称、红人平台
                    <a href="#" className="text-indigo-600 hover:underline ml-2">下载模板</a>
                </p>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    红人ID
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    红人名称
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    红人平台
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    上传时间
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    上传人
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    操作
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredExclusions.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                        {searchQuery ? '未找到匹配的红人' : '暂无排除红人数据'}
                                    </td>
                                </tr>
                            ) : (
                                filteredExclusions.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-mono text-slate-600">
                                            {item.influencerId}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                                            {item.influencerName}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                {item.platform}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {item.uploadedAt}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {item.uploadedBy}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={14} />
                                                删除
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (placeholder) */}
                {filteredExclusions.length > 0 && (
                    <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                        <p className="text-sm text-slate-600">
                            共 {filteredExclusions.length} 条记录
                        </p>
                        <div className="flex gap-2">
                            <button className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50" disabled>
                                上一页
                            </button>
                            <button className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50" disabled>
                                下一页
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExclusionList;
