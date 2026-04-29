import React from 'react';
import { Atom } from 'lucide-react';
import CourseTemplate from '../components/CourseTemplate';
import { coursesData } from '../data/coursesData';

interface Props {
    activeModule: string | null;
}

const Physics: React.FC<Props> = ({ activeModule }) => {
    const data = coursesData['Physics'];
    return (
        <CourseTemplate
            data={data}
            themeColor="#ff9500" // Neon Orange
            icon={<Atom size={32} />}
            activeModule={activeModule}
        />
    );
};

export default Physics;
