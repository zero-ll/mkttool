import React, { useState } from 'react';
import { X } from 'lucide-react';

const TagInput = ({ label, required, placeholder, value = [], onChange }) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTags(inputValue);
        }
    };

    const addTags = (input) => {
        if (!input.trim()) return;

        // Support semicolon-separated values
        const newTags = input
            .split(/[;,]/)
            .map(tag => tag.trim())
            .filter(tag => tag && !value.includes(tag));

        if (newTags.length > 0) {
            onChange([...value, ...newTags]);
            setInputValue('');
        }
    };

    const removeTag = (tagToRemove) => {
        onChange(value.filter(tag => tag !== tagToRemove));
    };

    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus-within:border-indigo-500 transition-colors">
                {/* Tags Display */}
                <div className="flex flex-wrap gap-2 mb-2">
                    {value.map((tag, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200"
                        >
                            {tag}
                            <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="hover:text-indigo-900"
                            >
                                <X size={12} />
                            </button>
                        </span>
                    ))}
                </div>

                {/* Input */}
                <input
                    type="text"
                    placeholder={placeholder}
                    className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={() => addTags(inputValue)}
                />
            </div>

            {placeholder?.includes('分号') && (
                <p className="text-xs text-slate-500 mt-1">
                    💡 提示：支持分号(;)或逗号(,)分隔多个关键词
                </p>
            )}
        </div>
    );
};

export default TagInput;
