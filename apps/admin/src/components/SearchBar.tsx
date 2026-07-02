'use client';
import React, { useState, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
    placeholder?: string;
    onSearch: (query: string) => void;
    value?: string;
}

export function SearchBar({ placeholder = "Search...", onSearch, value = "" }: SearchBarProps) {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearch(e.target.value);
    };

    const handleClear = () => {
        onSearch('');
        inputRef.current?.focus();
    };

    return (
        /* Outer wrapper is right-aligned so expansion goes LEFT */
        <div className="flex justify-end">
            <div
                className={`relative flex items-center h-10 transition-all duration-500 ease-in-out border rounded-full bg-white dark:bg-[#1a1a1a] shadow-sm hover:shadow-md cursor-text
                    ${isFocused
                        ? 'w-72 md:w-96 ring-2 ring-primary/20 border-primary dark:border-primary'
                        : 'w-40 md:w-48 border-gray-200 dark:border-[#2E2E2E]'
                    }`}
                onClick={() => inputRef.current?.focus()}
            >
                <div className="flex items-center w-full px-3 gap-2">
                    <Search
                        size={16}
                        className={`shrink-0 transition-colors duration-300 ${isFocused ? 'text-primary' : 'text-[#80868b]'}`}
                    />

                    {/* Separator */}
                    <div className="h-4 w-[1px] bg-gray-200 dark:bg-gray-700 shrink-0" />

                    <input
                        ref={inputRef}
                        type="text"
                        value={value}
                        onChange={handleQueryChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={placeholder}
                        className="w-full bg-transparent border-none outline-none text-sm text-[#202124] dark:text-white placeholder:text-[#5f6368] dark:placeholder:text-gray-500"
                    />

                    {/* Clear button */}
                    {value && (
                        <button
                            onMouseDown={(e) => { e.preventDefault(); handleClear(); }}
                            className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            <X size={10} className="text-gray-600 dark:text-gray-300" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
