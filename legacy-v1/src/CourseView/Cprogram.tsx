import React from 'react';
import { TerminalSquare } from 'lucide-react';
import CourseTemplate from '../components/CourseTemplate';
import { coursesData } from '../data/coursesData';

interface Props {
    activeModule: string | null;
}

const CProgramming: React.FC<Props> = ({ activeModule }) => {
    const data = coursesData['C Programming'];
    return (
        <CourseTemplate 
            data={data} 
            themeColor="#34c759" // Neon Green
            icon={<TerminalSquare size={32} />} 
            activeModule={activeModule} 
        />
    );
};

export default CProgramming;
