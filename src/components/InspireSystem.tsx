import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Sparkles } from 'lucide-react';
import Logo from '../../public/parts/Logo';
import SearchBar from '../../public/parts/SearchBar';
import SideTab from '../systemParts/SideTab';
import Mainview from '../systemParts/Mainview';
import AIOverview from '../systemParts/AIOverview';

const InspireSystem: React.FC = () => {
    // Default state: AI Overview is closed until explicitly opened
    const [isAIOverviewOpen, setIsAIOverviewOpen] = useState(false);

    // State for routing the courses
    const [activeCourse, setActiveCourse] = useState<string | null>('Discrete Mathematics');
    const [activeModule, setActiveModule] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const courses = [
        'Discrete Mathematics', 
        'Physics', 
        'Data Structures and Algorithms (DSA)', 
        'C Programming', 
        'Circuit Theory'
    ];

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (!query.trim()) return;

        // Find the first course that matches the query
        const match = courses.find(course => 
            course.toLowerCase().includes(query.toLowerCase())
        );

        if (match) {
            setActiveCourse(match);
            setActiveModule(null); // Reset module view when switching courses via search
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            width: '100vw',
            overflow: 'hidden',
            backgroundColor: '#ffffff'
        }}>
            {/* ── Navbar ──────────────────────────────────── */}
            <nav style={{
                height: '64px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 24px',
                borderBottom: '1px solid var(--border-subtle)',
                backgroundColor: '#ffffff',
                zIndex: 100
            }}>
                <div style={{ width: '20%', display: 'flex', alignItems: 'center' }}>
                    <Logo onClick={() => setIsAIOverviewOpen(true)} />
                </div>
                
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <SearchBar value={searchQuery} onChange={handleSearch} />
                </div>

                <div style={{ width: '20%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: isAIOverviewOpen ? '#e8f0fe' : '#f1f3f4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onClick={() => setIsAIOverviewOpen(!isAIOverviewOpen)}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isAIOverviewOpen ? '#d2e3fc' : '#e8eaed'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isAIOverviewOpen ? '#e8f0fe' : '#f1f3f4'}
                    title="Toggle AI Assistant"
                    >
                        <Sparkles size={20} color={isAIOverviewOpen ? '#1a73e8' : '#5f6368'} />
                    </div>

                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#f1f3f4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e8eaed'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f1f3f4'}
                    >
                        <User size={20} color="#5f6368" />
                    </div>
                </div>
            </nav>

            {/* ── Main Content Area ────────────────────────── */}
            <div style={{
                display: 'flex',
                flex: 1,
                overflow: 'hidden' // prevents entire page from scrolling
            }}>
                {/* SideTab - Fixed 20% width */}
                <div style={{
                    width: '20%',
                    borderRight: '1px solid var(--border-subtle)',
                    overflowY: 'auto'
                }}>
                    <SideTab 
                        activeCourse={activeCourse}
                        setActiveCourse={setActiveCourse}
                        activeModule={activeModule}
                        setActiveModule={setActiveModule}
                    />
                </div>

                {/* Mainview - flexible, takes 60% or 80% dynamically */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto'
                }}>
                    <Mainview 
                        activeCourse={activeCourse} 
                        activeModule={activeModule} 
                    />
                </div>

                {/* AIOverview - Togglable 20% width */}
                <AnimatePresence initial={false}>
                    {isAIOverviewOpen && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: '20%', opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            style={{
                                borderLeft: '1px solid var(--border-subtle)',
                                overflow: 'hidden',
                                display: 'flex'
                            }}
                        >
                            {/* Inner wrapper prevents content squishing during animation */}
                            <div style={{ width: '100%', minWidth: '250px', height: '100%' }}>
                                <AIOverview onClose={() => setIsAIOverviewOpen(false)} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default InspireSystem;
