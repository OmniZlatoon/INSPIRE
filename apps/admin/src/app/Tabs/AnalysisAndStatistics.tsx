'use client';

import React, { useState, useEffect } from 'react';
import { Users, Route, BookOpen, Book, MessageSquare, TrendingUp, RefreshCw, WifiOff, Layers } from 'lucide-react';
//import { OfflineMode } from '@/components/OfflineState';

interface Stats {
    totalUsers: number;
    totalCarriers: number;
    totalCourses: number;
    totalBooks: number;
    totalMessages: number;
    totalSpecializations: number;
}

interface MetricCard {
    title: string;
    key: keyof Stats;
    icon: React.ReactNode;
    accentColor: string;
    bgColor: string;
    darkBgColor: string;
    description: string;
}

const metricCards: MetricCard[] = [
    {
        title: 'Total Users',
        key: 'totalUsers',
        icon: <Users size={18} />,
        accentColor: 'text-blue-500',
        bgColor: 'bg-blue-50',
        darkBgColor: 'dark:bg-blue-900/15',
        description: 'Registered accounts',
    },
    {
        title: 'Carrier Paths',
        key: 'totalCarriers',
        icon: <Route size={18} />,
        accentColor: 'text-emerald-500',
        bgColor: 'bg-emerald-50',
        darkBgColor: 'dark:bg-emerald-900/15',
        description: 'Active routes',
    },

    {
        title: 'Total Specialties',
        key: 'totalSpecializations',
        icon: <Layers size={18} />,
        accentColor: 'text-indigo-500',
        bgColor: 'bg-indigo-50',
        darkBgColor: 'dark:bg-indigo-900/15',
        description: 'Curated specialties',
    },
    {
        title: 'Total Courses',
        key: 'totalCourses',
        icon: <BookOpen size={18} />,
        accentColor: 'text-violet-500',
        bgColor: 'bg-violet-50',
        darkBgColor: 'dark:bg-violet-900/15',
        description: 'Published courses',
    },
    {
        title: 'Total Books',
        key: 'totalBooks',
        icon: <Book size={18} />,
        accentColor: 'text-amber-500',
        bgColor: 'bg-amber-50',
        darkBgColor: 'dark:bg-amber-900/15',
        description: 'Listed resources',
    },
    {
        title: 'Total Messages',
        key: 'totalMessages',
        icon: <MessageSquare size={18} />,
        accentColor: 'text-rose-500',
        bgColor: 'bg-rose-50',
        darkBgColor: 'dark:bg-rose-900/15',
        description: 'User messages sent',
    },

];

function formatNumber(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n.toString();
}

export default function AnalysisAndStatistics() {
    const [stats, setStats] = useState<Stats>({
        totalUsers: 0,
        totalCarriers: 0,
        totalCourses: 0,
        totalBooks: 0,
        totalMessages: 0,
        totalSpecializations: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isOffline, setIsOffline] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL + '/api/inspire/stats' || 'http://localhost:5000/api/inspire/stats';

    const fetchStats = async () => {
        setIsLoading(true);
        try {
            const [usersRes, carriersRes, coursesRes, booksRes, messagesRes, specsRes] = await Promise.all([
                fetch(`${BASE_URL}/users`),
                fetch(`${BASE_URL}/carriers`),
                fetch(`${BASE_URL}/courses`),
                fetch(`${BASE_URL}/books`),
                fetch(`${BASE_URL}/messages`),
                fetch(`${BASE_URL}/specializations`),
            ]);

            const [usersData, carriersData, coursesData, booksData, messagesData, specsData] = await Promise.all([
                usersRes.json(),
                carriersRes.json(),
                coursesRes.json(),
                booksRes.json(),
                messagesRes.json(),
                specsRes.json(),
            ]);

            setStats(prev => ({
                ...prev,
                totalUsers: usersData.success ? usersData.data.totalUsers : prev.totalUsers,
                totalCarriers: carriersData.success ? carriersData.data.totalCarriers : prev.totalCarriers,
                totalCourses: coursesData.success ? coursesData.data.totalCourses : prev.totalCourses,
                totalBooks: booksData.success ? booksData.data.totalBooks : prev.totalBooks,
                totalMessages: messagesData.success ? messagesData.data.totalMessages : prev.totalMessages,
                totalSpecializations: specsData.success ? specsData.data.totalSpecializations : prev.totalSpecializations,
            }));
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <div className="p-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">


            {
                (
                    <>
                        {/* Header */}
                        <div className="flex items-start justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-[#202124] dark:text-white">Analysis & Statistics</h2>
                                <p className="text-[#5f6368] dark:text-gray-400 mt-1 text-sm">
                                    Real-time overview of platform metrics and usage.
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                {lastUpdated && !isLoading && (
                                    <span className="text-xs text-[#5f6368] dark:text-gray-500">
                                        Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                )}
                                <button
                                    onClick={fetchStats}
                                    disabled={isLoading || isOffline}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-[#5f6368] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2d2d2d] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
                                    Refresh
                                </button>
                            </div>
                        </div>
                        {/* Metric Cards */}

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                            {metricCards.map((card) => (
                                <div
                                    key={card.key}
                                    className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-gray-800 p-4 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200 group"
                                >
                                    {/* Icon */}
                                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${card.bgColor} ${card.darkBgColor} ${card.accentColor} mb-3`}>
                                        {card.icon}
                                    </div>

                                    {/* Value */}
                                    {isLoading ? (
                                        <div className="h-7 w-16 bg-gray-100 dark:bg-gray-800 rounded animate-pulse mb-1" />
                                    ) : (
                                        <p className="text-2xl font-bold text-[#202124] dark:text-white tracking-tight">
                                            {formatNumber(stats[card.key])}
                                        </p>
                                    )}

                                    {/* Title */}
                                    <p className="text-xs font-semibold text-[#202124] dark:text-gray-200 mt-0.5">
                                        {card.title}
                                    </p>

                                    {/* Description */}
                                    <p className="text-[11px] text-[#5f6368] dark:text-gray-500 mt-0.5">
                                        {card.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Summary Bar */}
                        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-gray-800 px-5 py-4 flex items-center gap-3">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/15 rounded-lg">
                                <TrendingUp size={16} className="text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-[#202124] dark:text-white">Platform at a glance</p>
                                <p className="text-xs text-[#5f6368] dark:text-gray-400">
                                    {isLoading
                                        ? 'Fetching latest data...'
                                        : `${formatNumber(stats.totalUsers)} users · ${formatNumber(stats.totalCarriers)} carrier paths · ${formatNumber(stats.totalCourses)} courses · ${formatNumber(stats.totalSpecializations)} Specializations · ${formatNumber(stats.totalBooks)} books · ${formatNumber(stats.totalMessages)} messages`
                                    }
                                </p>
                            </div>
                        </div>
                    </>
                )}
        </div>
    );
}
