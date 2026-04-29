import React from 'react';
import { Share2 } from 'lucide-react';
import CourseTemplate from '../components/CourseTemplate';
import { coursesData } from '../data/coursesData';

interface Props {
    activeModule: string | null;
}

const DiscreteMaths: React.FC<Props> = ({ activeModule }) => {
    const data = coursesData['Discrete Mathematics'];
    return (
        <CourseTemplate 
            data={data} 
            themeColor="#00e5ff" // Neon Cyan
            icon={<Share2 size={32} />} 
            activeModule={activeModule} 
        />
    );
};

export default DiscreteMaths;
