import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const COUNTRIES = [
    "美国", "英国", "加拿大", "澳大利亚", "德国", "法国", "日本", "韩国", "新加坡", "马来西亚",
    "泰国", "越南", "印尼", "菲律宾", "巴西", "墨西哥"
];

const MultiSelect = ({ value = [], onChange, label, placeholder, required, options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Use provided options or default to COUNTRIES
    const availableOptions = options || COUNTRIES;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (option) => {
        if (value.includes(option)) {
            onChange(value.filter(item => item !== option));
        } else {
            onChange([...value, option]);
        }
    };

    return (
        <div className="relative" ref={containerRef}>
            {label && (
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-left text-sm flex items-center justify-between focus:outline-none focus:border-indigo-500 transition-colors"
            >
                <span className={value.length === 0 ? "text-slate-400" : "text-slate-900"}>
                    {value.length === 0 ? placeholder : `${value.length} 个已选择`}
                </span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {availableOptions.map((option) => (
                        <div
                            key={option}
                            onClick={() => toggleOption(option)}
                            className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50 cursor-pointer text-sm text-slate-700"
                        >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${value.includes(option) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'
                                }`}>
                                {value.includes(option) && <Check size={12} className="text-white" />}
                            </div>
                            {option}
                        </div>
                    ))}
                </div>
            )}

            {/* Selected Tags Display */}
            {value.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {value.map(country => (
                        <span key={country} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            {country}
                            <button
                                type="button"
                                onClick={() => toggleOption(country)}
                                className="hover:text-red-500"
                            >
                                &times;
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MultiSelect;
