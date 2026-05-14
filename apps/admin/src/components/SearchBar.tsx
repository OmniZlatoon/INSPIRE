'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

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

    return (
        <div
            className={`relative flex items-center h-10 transition-all duration-500 ease-in-out border border-gray-200 dark:border-gray-700 rounded-full bg-white dark:bg-[#1a1a1a] shadow-sm hover:shadow-md ${isFocused ? 'w-80 md:w-96 ring-2 ring-primary/20 border-primary' : 'w-40 md:w-48'
                }`}
        >
            <div className="flex items-center w-full px-4">
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

                {/* Separator Pipe */}
                <div className="h-4 w-[1px] bg-gray-200 dark:bg-gray-700 mx-2" />

                <Search
                    size={18}
                    className={`transition-colors duration-300 ${isFocused ? 'text-primary' : 'text-[#80868b]'}`}
                />
            </div>
        </div>
    );
}
