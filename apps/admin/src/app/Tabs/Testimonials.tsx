'use client';

import React from 'react';
import { Quote } from 'lucide-react';

export default function Testimonials() {
    return (
        <div className="p-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#202124] dark:text-white">Testimonials</h2>
                <p className="text-[#5f6368] dark:text-gray-400 mt-1 text-sm">Manage user and partner testimonials displayed on the platform.</p>
            </div>

            <div className="flex flex-col items-center justify-center h-[55vh] text-center">
                <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/10 rounded-full flex items-center justify-center mb-6">
                    <Quote size={36} className="text-indigo-400 dark:text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-[#202124] dark:text-white mb-2">Testimonials Coming Soon</h3>
                <p className="text-[#5f6368] dark:text-gray-400 text-sm max-w-sm">
                    This section will allow you to curate and publish user testimonials across the INSPIRE platform.
                </p>
            </div>
        </div>
    );
}
