import React from 'react';
import { Cpu } from 'lucide-react';
import CourseTemplate from '../components/CourseTemplate';
import { coursesData } from '../data/coursesData';

interface Props {
    activeModule: string | null;
}

const CircuitTheory: React.FC<Props> = ({ activeModule }) => {
    const data = coursesData['Circuit Theory'];
    return (
        <CourseTemplate 
            data={data} 
            themeColor="#ffcc00" // Neon Yellow
            icon={<Cpu size={32} />} 
            activeModule={activeModule} 
        />
    );
};

export default CircuitTheory;
