import React from 'react';
import { Database } from 'lucide-react';
import CourseTemplate from '../components/CourseTemplate';
import { coursesData } from '../data/coursesData';

interface Props {
    activeModule: string | null;
}

const DSA: React.FC<Props> = ({ activeModule }) => {
    const data = coursesData['Data Structures and Algorithms (DSA)'];
    return (
        <CourseTemplate 
            data={data} 
            themeColor="#b551e0" // Neon Purple
            icon={<Database size={32} />} 
            activeModule={activeModule} 
        />
    );
};

export default DSA;
