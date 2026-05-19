'use client';

import React, { useState, useEffect } from 'react';
import { SideBar, TabKeys } from '../MainScreenParts/SideBar';
import { useTheme } from 'next-themes';
import { Sun, Moon, LogOut } from 'lucide-react';
import { auth } from '@/firebase/firebaseConfig';
import { User, signOut } from 'firebase/auth';

import AnalysisAndStatistics from '@/app/Tabs/AnalysisAndStatistics';
import CarrierPath from '@/app/Tabs/CarrierPath';
import SpecializationTab from '@/app/Tabs/Specialization';
import CourseOverlook from '@/app/Tabs/CourseOverlook';
import BooksManagement from '@/app/Tabs/BooksManagement';
import Leaderboard from '@/app/Tabs/Leaderboard';
import SystemNotifications from '@/app/Tabs/SystemNotifications';
import PlatformSettings from '@/app/Tabs/PlatformSettings';
import DeveloperOptions from '@/app/Tabs/DeveloperOptions';
import { OfflineMode } from '@/components/OfflineState';

export default function MainScreen() {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [activeTab, setActiveTab] = useState<TabKeys>('analysis');
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    const [user, setUser] = useState<User | null>(null);
    const [isOffline, setIsOffline] = useState(false);


    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    // Avoid hydration mismatch for next-themes
    useEffect(() => {
        setMounted(true);
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });

        // Professional robust offline detection
        const checkInternet = async () => {
            if (!navigator.onLine) {
                setIsOffline(true);
                return;
            }
            try {
                // Ping a lightweight resource to verify actual internet access
                const response = await fetch('/favicon.ico?_=' + new Date().getTime(), {
                    method: 'HEAD',
                    cache: 'no-store'
                });
                setIsOffline(!response.ok);
            } catch (error) {
                setIsOffline(true);
            }
        };

        // Initial check
        checkInternet();

        const handleOnline = () => checkInternet();
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Heartbeat check every 5 seconds for lively detection
        const intervalId = setInterval(checkInternet, 5000);

        return () => {
            unsubscribe();
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            clearInterval(intervalId);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            // Navigation will be handled by a higher-level auth guard (e.g. page.tsx)
        } catch (error) {
            console.error('Error signing out', error);
        }
    };

    const getProfileImage = () => {
        if (user?.photoURL) {
            return user.photoURL;
        }
        // Professional fallback generator using initials
        const emailStr = user?.email || 'Admin';
        const initial = emailStr.charAt(0).toUpperCase();
        return `https://ui-avatars.com/api/?name=${initial}&background=202124&color=fff&size=100`;
    };

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    // Close profile menu if clicking outside would be ideal, but for now we toggle on click
    const toggleProfileMenu = () => {
        setIsProfileMenuOpen(!isProfileMenuOpen);
    };

    // Content Renderer based on active tab using the new components
    const renderTabContent = () => {
        switch (activeTab) {
            case 'analysis':
                return <AnalysisAndStatistics />;
            case 'career':
                return <CarrierPath />;
            case 'specialization':
                return <SpecializationTab />;
            case 'course':
                return <CourseOverlook />;
            case 'books':
                return <BooksManagement />;
            case 'leaderboard':
                return <Leaderboard />;
            case 'notifications':
                return <SystemNotifications />;
            case 'settings':
                return <PlatformSettings />;
            case 'developer':
                return <DeveloperOptions />;
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen w-full bg-white dark:bg-[#121212] overflow-hidden transition-colors duration-300">

            {/* Sidebar Section */}
            <div
                className={`transition-all duration-300 ease-in-out h-full ${isSidebarExpanded ? 'w-[25%] lg:w-[20%] xl:w-[15%]' : 'w-[10%] lg:w-[8%] xl:w-[5%]'
                    }`}
            >
                <SideBar
                    isExpanded={isSidebarExpanded}
                    setIsExpanded={setIsSidebarExpanded}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            </div>

            {/* Main Content Section */}
            <div
                className={`transition-all duration-300 ease-in-out h-full flex flex-col ${isSidebarExpanded ? 'w-[90%] lg:w-[95%] xl:w-[90%]' : 'w-[90%] lg:w-[92%] xl:w-[95%]'
                    }`}
            >
                {/* Header Section */}
                <header className="h-16 px-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] shadow-sm z-10 transition-colors duration-300">

                    {/* Left: Logo */}
                    <div className="flex items-center">
                        <span className="logo-text text-2xl text-[#202124] dark:text-white">Inspire</span>
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-[#f1f3f4] dark:bg-[#2d2d2d] text-xs font-semibold text-[#5f6368] dark:text-gray-300">ADMIN</span>
                    </div>

                    {/* Right: Theme Toggle & Profile */}
                    <div className="flex items-center space-x-6">

                        {/* Theme Toggle */}
                        {mounted && (
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full hover:bg-[#f1f3f4] dark:hover:bg-[#2d2d2d] text-[#5f6368] dark:text-gray-300 transition-all duration-300 transform active:scale-90"
                                aria-label="Toggle Dark Mode"
                            >
                                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                        )}

                        {/* Profile Section */}
                        <div className="relative">
                            <div
                                className="flex items-center space-x-3 border-l border-gray-200 dark:border-gray-700 pl-6 cursor-pointer"
                                onClick={toggleProfileMenu}
                            >
                                <div className="flex flex-col items-end hidden md:flex">
                                    <span className="text-sm font-semibold text-[#202124] dark:text-white">
                                        {user?.displayName || user?.email || 'Administrator'}
                                    </span>
                                    <span className="text-xs text-[#5f6368] dark:text-gray-400">
                                        System Admin
                                    </span>
                                </div>
                                <img
                                    src={getProfileImage()}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full border-2 border-white dark:border-[#2d2d2d] shadow-sm object-cover"
                                />
                            </div>

                            {/* Logout Dropdown - Click Based */}
                            <div className={`absolute top-14 right-0 bg-white dark:bg-[#2d2d2d] shadow-xl border border-gray-100 dark:border-gray-700 rounded-lg py-2 px-4 transition-all duration-200 z-50 ${isProfileMenuOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                <button onClick={handleLogout} className="flex items-center text-sm text-red-600 dark:text-red-400 hover:text-red-800 font-medium whitespace-nowrap">
                                    <LogOut size={16} className="mr-2" /> Sign Out
                                </button>
                            </div>
                        </div>

                    </div>
                </header>

                {/* Dynamic Main Screen Area */}
                <main className="flex-1 overflow-y-auto bg-white dark:bg-[#121212] transition-colors duration-300">
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
                        {isOffline ? <OfflineMode /> : renderTabContent()}
                    </div>
                </main>
            </div>

        </div>
    );
}
