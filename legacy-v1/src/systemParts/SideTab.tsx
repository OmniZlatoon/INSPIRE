import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const COURSES = [
    'Discrete Mathematics',
    'Physics',
    'Data Structures and Algorithms (DSA)',
    'C Programming',
    'Circuit Theory'
];

const MODULES = [
    'Module 1: "Did You Know?"',
    'Module 2: Brief Course Introduction',
    'Module 3: Common Challenges',
    'Module 4: Cultivating Inspiration',
    'Module 5: Real-World Wisdom (Part 1)',
    'Module 6: The Bounce-Back Strategy',
    'Module 7: Real-World Wisdom (Part 2)',
    'Module 9: Q&A Section'
];

interface SideTabProps {
    activeCourse: string | null;
    setActiveCourse: (course: string | null) => void;
    activeModule: string | null;
    setActiveModule: (module: string | null) => void;
}

const SideTab: React.FC<SideTabProps> = ({ activeCourse, setActiveCourse, activeModule, setActiveModule }) => {
    const [isCoursesOpen, setIsCoursesOpen] = useState(true);
    // Keep expanded state local to the tab, while activeCourse reflects the currently viewed course.
    const [expandedCourse, setExpandedCourse] = useState<string | null>(activeCourse);

    const handleCourseClick = (course: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedCourse(expandedCourse === course ? null : course);
        setActiveCourse(course);
        setActiveModule(null); // Reset module scrolling when switching course
    };

    const handleModuleClick = (course: string, module: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveCourse(course);
        setActiveModule(module);
    };

    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px 16px',
            backgroundColor: '#ffffff',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Heading */}
            <h2 style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: '1.1rem',
                color: '#202124',
                margin: '0 0 24px 8px',
                letterSpacing: '0.01em'
            }}>
                Outlined Courses
            </h2>

            {/* Main Courses Dropdown Toggle */}
            <div
                onClick={() => setIsCoursesOpen(!isCoursesOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 8px',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    backgroundColor: isCoursesOpen ? '#f8f9fa' : 'transparent',
                    transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f3f4'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isCoursesOpen ? '#f8f9fa' : 'transparent'}
            >
                <span style={{
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    color: '#202124'
                }}>
                    Courses
                </span>
                {isCoursesOpen ? <ChevronUp size={18} color="#5f6368" /> : <ChevronDown size={18} color="#5f6368" />}
            </div>

            {/* Courses List (Animated Slide) */}
            <AnimatePresence>
                {isCoursesOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div style={{ paddingLeft: '8px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {COURSES.map((course) => {
                                const isExpanded = expandedCourse === course;
                                const isActiveCourse = activeCourse === course;

                                return (
                                    <div key={course}>
                                        {/* Individual Course Toggle */}
                                        <div
                                            onClick={(e) => handleCourseClick(course, e)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '8px 8px 8px 12px',
                                                cursor: 'pointer',
                                                borderRadius: '6px',
                                                backgroundColor: isActiveCourse ? '#e8eaed' : 'transparent',
                                                transition: 'background-color 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => { if (!isActiveCourse) e.currentTarget.style.backgroundColor = '#f1f3f4' }}
                                            onMouseLeave={(e) => { if (!isActiveCourse) e.currentTarget.style.backgroundColor = 'transparent' }}
                                        >
                                            <span style={{
                                                fontSize: '0.9rem',
                                                fontWeight: isActiveCourse ? 500 : 400,
                                                color: isActiveCourse ? '#202124' : '#5f6368',
                                                transition: 'color 0.2s ease'
                                            }}>
                                                {course}
                                            </span>
                                            {isExpanded ? <ChevronUp size={16} color={isActiveCourse ? '#202124' : '#5f6368'} /> : <ChevronDown size={16} color={isActiveCourse ? '#202124' : '#5f6368'} />}
                                        </div>

                                        {/* Modules List for this Course */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                                                    style={{ overflow: 'hidden' }}
                                                >
                                                    <div style={{
                                                        paddingLeft: '24px',
                                                        paddingTop: '4px',
                                                        paddingBottom: '8px',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: '6px',
                                                        borderLeft: '1px solid #e8eaed',
                                                        marginLeft: '16px',
                                                        marginTop: '4px'
                                                    }}>
                                                        {MODULES.map((module, idx) => {
                                                            const isModuleActive = isActiveCourse && activeModule === module;

                                                            return (
                                                                <div
                                                                    key={idx}
                                                                    onClick={(e) => handleModuleClick(course, module, e)}
                                                                    style={{
                                                                        fontSize: '0.85rem',
                                                                        padding: '6px 8px',
                                                                        cursor: 'pointer',
                                                                        borderRadius: '4px',
                                                                        fontWeight: isModuleActive ? 500 : 400,
                                                                        color: isModuleActive ? '#202124' : '#5f6368',
                                                                        backgroundColor: isModuleActive ? '#f1f3f4' : 'transparent',
                                                                        transition: 'all 0.2s ease'
                                                                    }}
                                                                    onMouseEnter={(e) => { if (!isModuleActive) e.currentTarget.style.backgroundColor = '#f8f9fa' }}
                                                                    onMouseLeave={(e) => { if (!isModuleActive) e.currentTarget.style.backgroundColor = 'transparent' }}
                                                                >
                                                                    {module}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* General Module (Module 8) outside the Courses dropdown */}
            <div style={{ marginTop: '16px' }}>
                <div
                    onClick={() => setActiveModule('module8')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 8px',
                        cursor: 'pointer',
                        borderRadius: '6px',
                        backgroundColor: activeModule === 'module8' ? '#e8eaed' : 'transparent',
                        transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => { if (activeModule !== 'module8') e.currentTarget.style.backgroundColor = '#f1f3f4' }}
                    onMouseLeave={(e) => { if (activeModule !== 'module8') e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                    <span style={{
                        fontWeight: activeModule === 'module8' ? 500 : 400,
                        fontSize: '0.9rem',
                        color: activeModule === 'module8' ? '#202124' : '#5f6368',
                        lineHeight: 1.4
                    }}>
                        Real-World Application Showcase
                    </span>
                </div>
            </div>

        </div>
    );
};

export default SideTab;
