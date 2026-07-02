import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessMessageProps {
    message: string | null;
    isExiting: boolean;
}

export function SuccessMessage({ message, isExiting }: SuccessMessageProps) {
    if (!message) return null;

    return (
        <div className={`fixed bottom-6 right-6 z-[200] flex items-center gap-2.5 px-4 py-2.5 bg-white dark:bg-[#1e1e1e] border border-green-200 dark:border-[#2E2E2E] rounded-lg shadow-lg transition-all duration-500 ${isExiting ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
            <span className="w-1 h-6 rounded-full bg-green-500 flex-shrink-0" />
            <CheckCircle size={14} className="text-green-500" />
            <span className="text-xs font-medium text-[#202124] dark:text-white">{message}</span>
        </div>
    );
}
