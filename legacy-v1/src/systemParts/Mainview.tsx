import React from 'react';
import DiscreteMaths from '../CourseView/DiscreteMaths';
import Physics from '../CourseView/Physics';
import DSA from '../CourseView/DSA';
import CProgramming from '../CourseView/Cprogram';
import CircuitTheory from '../CourseView/CircuitTheory';

interface MainviewProps {
    activeCourse: string | null;
    activeModule: string | null;
}

const Mainview: React.FC<MainviewProps> = ({ activeCourse, activeModule }) => {
    
    const renderCourse = () => {
        switch (activeCourse) {
            case 'Discrete Mathematics':
                return <DiscreteMaths activeModule={activeModule} />;
            case 'Physics':
                return <Physics activeModule={activeModule} />;
            case 'Data Structures and Algorithms (DSA)':
                return <DSA activeModule={activeModule} />;
            case 'C Programming':
                return <CProgramming activeModule={activeModule} />;
            case 'Circuit Theory':
                return <CircuitTheory activeModule={activeModule} />;
            default:
                return (
                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-muted)'
                    }}>
                        Select a course from the SideTab to begin.
                    </div>
                );
        }
    };

    return (
        <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#fafafa', // Soft background for the main view
            position: 'relative',
            overflow: 'hidden'
        }}>
            {renderCourse()}
        </div>
    );
};

export default Mainview;
