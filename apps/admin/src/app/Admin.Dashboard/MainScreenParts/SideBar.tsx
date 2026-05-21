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
    X,
    Layers,
    LayoutGrid,
} from 'lucide-react';

export type TabKeys =
    | 'analysis'
    | 'category'
    | 'career'
    | 'specialization'
    | 'course'
    | 'books'
    | 'leaderboard'
    | 'notifications'
    | 'settings'
    | 'developer';

interface SideBarProps {
    isExpanded: boolean;
    setIsExpanded: (v: boolean) => void;
    activeTab: TabKeys;
    setActiveTab: (tab: TabKeys) => void;
}

interface NavItem {
    id: TabKeys;
    label: string;
    Icon: React.ElementType;
}

const primaryNav: NavItem[] = [
    { id: 'analysis', label: 'Analysis', Icon: FlaskConical },
    { id: 'category', label: 'Categories', Icon: LayoutGrid },
    { id: 'career', label: 'Carrier Paths', Icon: Route },
    { id: 'specialization', label: 'Specialization', Icon: Layers },
    { id: 'course', label: 'Courses', Icon: BookOpen },
    { id: 'books', label: 'Books', Icon: Book },
    { id: 'leaderboard', label: 'Leaderboard', Icon: BarChart2 },
    { id: 'notifications', label: 'Notifications', Icon: Bell },
];

const systemNav: NavItem[] = [
    { id: 'settings', label: 'Settings', Icon: Settings },
    { id: 'developer', label: 'Developer', Icon: Code },
];

export const SideBar: React.FC<SideBarProps> = ({
    isExpanded,
    setIsExpanded,
    activeTab,
    setActiveTab,
}) => {
    const NavButton = ({ id, label, Icon }: NavItem) => {
        const active = activeTab === id;
        return (
            <button
                key={id}
                onClick={() => setActiveTab(id)}
                title={!isExpanded ? label : undefined}
                className={`
                    group w-full flex items-center rounded-lg transition-all duration-150
                    ${isExpanded ? 'gap-3 px-3 py-2.5' : 'justify-center px-0 py-2.5'}
                    ${active
                        ? 'bg-[#e8f0fe] dark:bg-[#1a2744] text-[#1a73e8] dark:text-[#8ab4f8]'
                        : 'text-[#5f6368] dark:text-[#9aa0a6] hover:bg-[#f1f3f4] dark:hover:bg-[#2a2a2a] hover:text-[#202124] dark:hover:text-white'
                    }
                `}
            >
                <Icon
                    size={18}
                    strokeWidth={active ? 2.2 : 1.8}
                    className={`flex-shrink-0 ${active ? 'text-[#1a73e8] dark:text-[#8ab4f8]' : 'text-[#80868b] dark:text-[#9aa0a6]'}`}
                />
                {isExpanded && (
                    <span className={`text-[15px] font-medium tracking-[-0.01em] truncate ${active ? 'text-[#1a73e8] dark:text-[#8ab4f8]' : 'text-[#3c4043] dark:text-[#e8eaed]'}`}>
                        {label}
                    </span>
                )}
            </button>
        );
    };

    return (
        <aside className="h-full w-full flex flex-col bg-white dark:bg-[#111111] border-r border-[#e8eaed] dark:border-[#2a2a2a] overflow-hidden transition-colors duration-300">

            {/* ── Header: Hamburger ── */}
            <div className={`flex items-center h-16 flex-shrink-0 border-b border-[#e8eaed] dark:border-[#2a2a2a] ${isExpanded ? 'px-3 gap-3' : 'justify-center px-0'}`}>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex-shrink-0 p-2 rounded-full hover:bg-[#f1f3f4] dark:hover:bg-[#2a2a2a] text-[#5f6368] dark:text-[#9aa0a6] transition-colors"
                    title={isExpanded ? 'Collapse' : 'Expand'}
                >
                    {isExpanded ? <X size={17} /> : <Menu size={17} />}
                </button>

                {isExpanded && (
                    <span className="text-[14px] font-semibold text-[#202124] dark:text-[#e8eaed] tracking-tight whitespace-nowrap select-none">
                        Dashboard
                    </span>
                )}
            </div>

            {/* ── Primary Nav ── */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 pt-4 pb-1 flex flex-col gap-1">
                {isExpanded && (
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-[#80868b] dark:text-[#5f6368] px-3 mb-2 mt-1">
                        Platform
                    </p>
                )}
                {primaryNav.map((item) => (
                    <NavButton key={item.id} {...item} />
                ))}
            </nav>

            {/* ── Divider ── */}
            <div className="mx-3 border-t border-[#e8eaed] dark:border-[#2a2a2a]" />

            {/* ── System Nav ── */}
            <div className="px-2 py-3 flex flex-col gap-1 flex-shrink-0">
                {isExpanded && (
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-[#80868b] dark:text-[#5f6368] px-3 mb-2 mt-1">
                        System
                    </p>
                )}
                {systemNav.map((item) => (
                    <NavButton key={item.id} {...item} />
                ))}
            </div>

            {/* ── Footer ── */}
            {isExpanded && (
                <div className="px-4 py-2.5 border-t border-[#e8eaed] dark:border-[#2a2a2a] flex-shrink-0">
                    <p className="text-[10px] text-[#80868b] dark:text-[#5f6368]">
                        Admin Portal · v1.0
                    </p>
                </div>
            )}
        </aside>
    );
};
