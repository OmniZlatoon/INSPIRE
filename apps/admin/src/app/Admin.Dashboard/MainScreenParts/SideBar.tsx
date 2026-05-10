'use client';

import React from 'react';
import {
    FlaskConical,
    Route,
    BookOpen,
    Book,
    BarChart2,
    Bell,
    Settings,
    Code,
    Menu,
    ChevronLeft
} from 'lucide-react';

export type TabKeys = 'analysis' | 'career' | 'course' | 'books' | 'leaderboard' | 'notifications' | 'settings' | 'developer';

interface SideBarProps {
    isExpanded: boolean;
    setIsExpanded: (expanded: boolean) => void;
    activeTab: TabKeys;
    setActiveTab: (tab: TabKeys) => void;
}

export const SideBar: React.FC<SideBarProps> = ({
    isExpanded,
    setIsExpanded,
    activeTab,
    setActiveTab
}) => {
    const tabs = [
        { id: 'analysis', label: 'Analysis and Statistics', icon: <FlaskConical size={20} /> },
        { id: 'career', label: 'Career Path', icon: <Route size={20} /> },
        { id: 'course', label: 'Course Overlook', icon: <BookOpen size={20} /> },
        { id: 'books', label: 'Books', icon: <Book size={20} /> },
        { id: 'leaderboard', label: 'Leaderboard', icon: <BarChart2 size={20} /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={20} /> },
        { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
        { id: 'developer', label: 'Developer Option', icon: <Code size={20} /> },
    ];

    return (
        <aside
            className={`
        relative h-full bg-[#f1f3f4] dark:bg-[#1a1a1a] border-r border-gray-200 dark:border-gray-800
        transition-all duration-300 ease-in-out flex flex-col overflow-hidden
        ${isExpanded ? 'w-full' : 'w-full'} 
      `}
        >
            {/* Header / Toggle */}
            <div className={`flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-800 ${isExpanded ? 'justify-between' : 'justify-center'}`}>
                <div className={`transition-opacity duration-300 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
                    <span className="font-bold text-[#202124] dark:text-white text-lg tracking-wide">Inspire</span>
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-[#5f6368] dark:text-gray-300 transition-colors"
                    title={isExpanded ? 'Collapse Menu' : 'Expand Menu'}
                >
                    {isExpanded ? <ChevronLeft size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabKeys)}
                            className={`
                w-full flex items-center p-3 rounded-xl transition-all duration-200 group
                ${isActive
                                    ? 'bg-[#202124] dark:bg-white text-white dark:text-[#202124] shadow-md'
                                    : 'text-[#5f6368] dark:text-gray-400 hover:bg-white dark:hover:bg-[#2d2d2d] hover:text-[#202124] dark:hover:text-white'
                                }
                ${!isExpanded ? 'justify-center' : 'justify-start'}
              `}
                            title={tab.label}
                        >
                            <div className="flex-shrink-0">
                                {tab.icon}
                            </div>

                            <span
                                className={`
                  font-medium whitespace-nowrap transition-all duration-300 ml-4
                  ${isExpanded ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0 ml-0 overflow-hidden'}
                `}
                            >
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </nav>

            {/* Footer Area of Sidebar (optional) */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <div className={`text-xs text-[#5f6368] text-center ${!isExpanded && 'hidden'}`}>
                    Admin Portal v1.0
                </div>
            </div>
        </aside>
    );
};
