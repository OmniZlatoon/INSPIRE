'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Trophy, Medal, Award, ChevronDown, ChevronUp, Users, TrendingUp, Coins, Crown, X, ArrowUpDown } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { NoResultsFound } from '@/components/NoResultsFound';

const API_URL = `${(process.env.NEXT_PUBLIC_API_URL ?? '')}/api/inspire/leaderboard/totalRankings`;

interface UserData {
    uid: string;
    email: string;
    name: string;
    inspirePoints: number;
    rank?: number;
}

/* ── Skeleton Shimmer Row ── */
const SkeletonRow = ({ index }: { index: number }) => (
    <tr style={{ animationDelay: `${index * 80}ms` }} className="animate-pulse">
        <td className="px-5 py-4">
            <div className="flex justify-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700/60" />
            </div>
        </td>
        <td className="px-5 py-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700/60 shrink-0" />
                <div className="space-y-2 flex-1">
                    <div className="h-3.5 w-32 rounded bg-gray-200 dark:bg-gray-700/60" />
                    <div className="h-2.5 w-44 rounded bg-gray-100 dark:bg-gray-800/60" />
                </div>
            </div>
        </td>
        <td className="px-5 py-4 hidden md:table-cell">
            <div className="h-5 w-16 rounded bg-gray-100 dark:bg-gray-800/60 mx-auto" />
        </td>
        <td className="px-5 py-4 hidden lg:table-cell">
            <div className="h-1.5 w-24 rounded-full bg-gray-100 dark:bg-gray-800/60 mx-auto" />
        </td>
        <td className="px-5 py-4">
            <div className="flex items-center justify-end gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700/60" />
                <div className="h-3.5 w-14 rounded bg-gray-200 dark:bg-gray-700/60" />
            </div>
        </td>
    </tr>
);

/* ── Skeleton Stats Card ── */
const SkeletonStatCard = () => (
    <div className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2E2E2E] rounded-xl p-5 animate-pulse">
        <div className="flex items-center justify-between mb-3">
            <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700/60" />
            <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800/60" />
        </div>
        <div className="h-7 w-16 rounded bg-gray-200 dark:bg-gray-700/60 mb-1" />
        <div className="h-2.5 w-28 rounded bg-gray-100 dark:bg-gray-800/60" />
    </div>
);

/* ── Stat Card ── */
const StatCard = ({ icon: Icon, label, value, subtitle, color }: {
    icon: any; label: string; value: string | number; subtitle: string; color: string;
}) => {
    const colorMap: Record<string, string> = {
        blue: 'bg-blue-50 dark:bg-blue-900/15 text-blue-600 dark:text-blue-400',
        amber: 'bg-amber-50 dark:bg-amber-900/15 text-amber-600 dark:text-amber-400',
        green: 'bg-green-50 dark:bg-green-900/15 text-green-600 dark:text-green-400',
        purple: 'bg-purple-50 dark:bg-purple-900/15 text-purple-600 dark:text-purple-400',
    };
    return (
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2E2E2E] rounded-xl p-5 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#5f6368] dark:text-gray-400 uppercase tracking-wider">{label}</span>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
                    <Icon size={18} />
                </div>
            </div>
            <div className="text-2xl font-bold text-[#202124] dark:text-white">{value}</div>
            <p className="text-[11px] text-[#80868b] dark:text-gray-500 mt-1">{subtitle}</p>
        </div>
    );
};

/* ── Coin Icon SVG ── */
const CoinIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
        <circle cx="8" cy="8" r="7" fill="#FBBC05" />
        <circle cx="8" cy="8" r="5.5" fill="#F9AB00" />
        <text x="8" y="11" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#795400">✦</text>
    </svg>
);

export default function Leaderboard() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'total' | 'course' | 'carrier'>('total');
    const [sortMode, setSortMode] = useState<'highest' | 'lowest' | 'top3'>('highest');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 15;

    useEffect(() => { fetchLeaderboard(); }, []);
    useEffect(() => { filterAndSortUsers(); setCurrentPage(1); }, [users, searchQuery, sortMode]);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            let currentRank = 1, lastPoints = -1;
            const ranked: UserData[] = data.leaderboard.map((u: UserData, i: number) => {
                if (u.inspirePoints !== lastPoints) { currentRank = i + 1; lastPoints = u.inspirePoints; }
                return { ...u, rank: currentRank };
            });
            setUsers(ranked);
            setFilteredUsers(ranked);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const filterAndSortUsers = () => {
        let result = [...users];
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
        }
        if (sortMode === 'highest') result.sort((a, b) => b.inspirePoints - a.inspirePoints);
        else if (sortMode === 'lowest') result.sort((a, b) => a.inspirePoints - b.inspirePoints);
        else if (sortMode === 'top3') { result = result.filter(u => (u.rank || 0) <= 3).sort((a, b) => b.inspirePoints - a.inspirePoints); }
        setFilteredUsers(result);
    };

    const stats = useMemo(() => {
        if (!users.length) return { total: 0, avg: 0, max: 0, active: 0 };
        const pts = users.map(u => u.inspirePoints);
        return {
            total: users.length,
            avg: Math.round(pts.reduce((a, b) => a + b, 0) / pts.length),
            max: Math.max(...pts),
            active: users.filter(u => u.inspirePoints > 0).length,
        };
    }, [users]);

    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredUsers.slice(start, start + pageSize);
    }, [filteredUsers, currentPage]);

    const totalPages = Math.ceil(filteredUsers.length / pageSize);

    const renderRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return <img src="/LeaderboardIcons/1st.png" alt="1st" className="w-8 h-8 drop-shadow-md" />;
            case 2: return <img src="/LeaderboardIcons/2nd.png" alt="2nd" className="w-8 h-8 drop-shadow-md" />;
            case 3: return <img src="/LeaderboardIcons/3rd.png" alt="3rd" className="w-8 h-8 drop-shadow-md" />;
            default: return <span className="font-bold text-[#80868b] dark:text-gray-500 w-8 text-center inline-block text-sm">{rank}</span>;
        }
    };

    const getProgressWidth = (points: number) => {
        const max = stats.max || 1;
        return `${Math.max((points / max) * 100, 4)}%`;
    };

    const tabs = [
        { key: 'total' as const, label: 'Global Rank', icon: Trophy },
        { key: 'course' as const, label: 'Rank by Course', icon: Medal },
        { key: 'carrier' as const, label: 'Rank by Carrier', icon: Award },
    ];

    return (
        <div className="p-8 w-full min-h-full animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* ── Header ── */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-[#202124] dark:text-white">Leaderboard</h2>
                    <p className="text-sm text-[#5f6368] dark:text-gray-400 mt-0.5">Rankings and Inspire Points across the platform</p>
                </div>
                <div className="flex items-center gap-3">
                    <SearchBar placeholder="Search users..." value={searchQuery} onSearch={setSearchQuery} />
                </div>
            </div>

            {/* ── Stats Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {loading ? (
                    <>
                        <SkeletonStatCard /><SkeletonStatCard /><SkeletonStatCard /><SkeletonStatCard />
                    </>
                ) : (
                    <>
                        <StatCard icon={Users} label="Total Users" value={stats.total.toLocaleString()} subtitle="Registered participants" color="blue" />
                        <StatCard icon={TrendingUp} label="Avg Points" value={stats.avg.toLocaleString()} subtitle="Platform average score" color="green" />
                        <StatCard icon={Crown} label="Highest Score" value={stats.max.toLocaleString()} subtitle="Top performer points" color="amber" />
                        <StatCard icon={Coins} label="Active Users" value={stats.active.toLocaleString()} subtitle={`${stats.total ? Math.round((stats.active / stats.total) * 100) : 0}% participation rate`} color="purple" />
                    </>
                )}
            </div>

            {/* ── Controls Bar ── */}
            <div className="flex flex-col lg:flex-row justify-between items-center bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2E2E2E] p-1.5 rounded-xl mb-6 gap-3">
                {/* Segmented Tab Toggle */}
                <div className="flex bg-gray-100 dark:bg-[#111] p-1 rounded-lg w-full lg:w-auto">
                    {tabs.map(t => (
                        <button
                            key={t.key}
                            onClick={() => setActiveTab(t.key)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap
                                ${activeTab === t.key
                                    ? 'bg-white dark:bg-[#2d2d2d] shadow-sm text-primary ring-1 ring-black/5 dark:ring-white/10'
                                    : 'text-[#5f6368] dark:text-gray-400 hover:text-[#202124] dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#1a1a1a]'
                                }`}
                        >
                            <t.icon size={15} />
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                    <ArrowUpDown size={14} className="text-[#80868b]" />
                    <select
                        value={sortMode}
                        onChange={(e) => setSortMode(e.target.value as any)}
                        className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#2E2E2E] text-sm font-medium text-[#5f6368] dark:text-gray-300 cursor-pointer outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none pr-8"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2380868b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
                    >
                        <option value="highest">Highest Points</option>
                        <option value="lowest">Lowest Points</option>
                        <option value="top3">Top 3 Only</option>
                    </select>
                </div>
            </div>

            {/* ── Content ── */}
            {activeTab !== 'total' ? (
                <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-[#2E2E2E] p-12 text-center">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/15 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trophy className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-[#202124] dark:text-white mb-2">Feature Coming Soon</h3>
                    <p className="text-[#5f6368] dark:text-gray-400 max-w-md mx-auto text-sm">
                        Specific ranking systems for individual courses and carriers are currently under development.
                    </p>
                </div>
            ) : (
                <div className="bg-white dark:bg-[#1a1a1a] rounded border border-gray-100 dark:border-[#2E2E2E] overflow-hidden" style={{ borderRadius: '4px' }}>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/80 dark:bg-[#111] border-b border-gray-100 dark:border-[#2E2E2E]">
                                <th className="px-5 py-3.5 text-[11px] font-bold text-[#5f6368] dark:text-gray-400 uppercase tracking-wider w-20 text-center">Rank</th>
                                <th className="px-5 py-3.5 text-[11px] font-bold text-[#5f6368] dark:text-gray-400 uppercase tracking-wider">User</th>
                                <th className="px-5 py-3.5 text-[11px] font-bold text-[#5f6368] dark:text-gray-400 uppercase tracking-wider text-center hidden md:table-cell">Level</th>
                                <th className="px-5 py-3.5 text-[11px] font-bold text-[#5f6368] dark:text-gray-400 uppercase tracking-wider text-center hidden lg:table-cell">Progress</th>
                                <th className="px-5 py-3.5 text-[11px] font-bold text-[#5f6368] dark:text-gray-400 uppercase tracking-wider text-right">Points</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800/60">
                            {loading ? (
                                Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} index={i} />)
                            ) : paginatedUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5}>
                                        <NoResultsFound searchTerm={searchQuery} onClear={() => setSearchQuery('')} />
                                    </td>
                                </tr>
                            ) : (
                                paginatedUsers.map((user) => {
                                    const level = Math.floor(user.inspirePoints / 100) + 1;
                                    const isTop3 = (user.rank || 0) <= 3;
                                    return (
                                        <tr
                                            key={user.uid}
                                            className={`transition-colors duration-150 group
                                                ${isTop3 ? 'bg-amber-50/30 dark:bg-amber-900/5 hover:bg-amber-50/60 dark:hover:bg-amber-900/10' : 'hover:bg-gray-50/60 dark:hover:bg-white/[0.03]'}`}
                                        >
                                            <td className="px-5 py-4 text-center">
                                                <div className="flex justify-center transition-transform duration-200 group-hover:scale-110">
                                                    {renderRankIcon(user.rank || 0)}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="text-sm font-semibold text-[#202124] dark:text-white capitalize truncate">{user.name}</div>
                                                        <div className="text-xs text-[#80868b] dark:text-gray-500 truncate">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-center hidden md:table-cell">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-[#5f6368] dark:text-gray-300">
                                                    Lv.{level}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 hidden lg:table-cell">
                                                <div className="w-28 mx-auto">
                                                    <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                                                            style={{ width: getProgressWidth(user.inspirePoints) }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#5f6368] dark:text-white">
                                                    <CoinIcon />
                                                    {user.inspirePoints.toLocaleString()}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>

                    {/* ── Pagination ── */}
                    {!loading && totalPages > 1 && (
                        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 dark:border-[#2E2E2E] bg-gray-50/50 dark:bg-[#111]">
                            <span className="text-xs text-[#80868b] dark:text-gray-500">
                                Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredUsers.length)} of {filteredUsers.length}
                            </span>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-200 dark:border-[#2E2E2E] text-[#5f6368] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    Previous
                                </button>
                                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                                    let page: number;
                                    if (totalPages <= 5) page = i + 1;
                                    else if (currentPage <= 3) page = i + 1;
                                    else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                                    else page = currentPage - 2 + i;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-8 h-8 text-xs font-medium rounded-md transition-colors
                                                ${currentPage === page
                                                    ? 'bg-primary text-white shadow-sm'
                                                    : 'text-[#5f6368] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1a1a1a]'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-200 dark:border-[#2E2E2E] text-[#5f6368] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
