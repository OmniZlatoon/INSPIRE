'use client';
import React from 'react';
import { Search } from 'lucide-react';

interface NoResultsFoundProps {
    searchTerm: string;
    onClear?: () => void;
}

export function NoResultsFound({ searchTerm, onClear }: NoResultsFoundProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-gray-50 dark:bg-[#212121] rounded-full flex items-center justify-center mb-6">
                <Search size={40} className="text-[#5f6368] dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-[#202124] dark:text-white mb-2">
                No results found
            </h3>
            <p className="text-[#5f6368] dark:text-gray-400 text-sm max-w-sm">
                Your search for "<span className="font-semibold">{searchTerm}</span>" did not match any records. 
                Try checking for typos or using more general terms.
            </p>
            {onClear && (
                <button 
                    onClick={onClear}
                    className="mt-6 text-sm font-medium text-primary hover:underline transition-all"
                >
                    Clear search query
                </button>
            )}
        </div>
    );
}
