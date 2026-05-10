'use client';

import React from 'react';
import { Users, Route, BookOpen, Book } from 'lucide-react';

export default function AnalysisAndStatistics() {
    const metrics = [
        { title: 'Total Users', value: '1,248', icon: <Users size={24} className="text-blue-500" /> },
        { title: 'Total Carrier Path', value: '14', icon: <Route size={24} className="text-green-500" /> },
        { title: 'Total Course', value: '56', icon: <BookOpen size={24} className="text-purple-500" /> },
        { title: 'Total Books', value: '312', icon: <Book size={24} className="text-orange-500" /> },
    ];

    return (
        <div className="p-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#202124] dark:text-white">Analysis and Statistics</h2>
                <p className="text-[#5f6368] dark:text-gray-400 mt-2">Overview of platform metrics and overall usage.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, index) => (
                    <div 
                        key={index}
                        className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden group"
                    >
                        {/* Decorative Top Accent */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 dark:bg-gray-800 group-hover:bg-primary transition-colors duration-300"></div>
                        
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-gray-50 dark:bg-[#2d2d2d] rounded-lg">
                                    {metric.icon}
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-[#5f6368] dark:text-gray-400 text-sm font-medium mb-1 uppercase tracking-wider">
                                    {metric.title}
                                </h3>
                                <p className="text-3xl font-bold text-[#202124] dark:text-white">
                                    {metric.value}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
