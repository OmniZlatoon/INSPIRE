import React from 'react';

interface LogoProps {
    onClick?: () => void;
    style?: React.CSSProperties;
}

const Logo: React.FC<LogoProps> = ({ onClick, style }) => {
    return (
        <div 
            className="logo-font" 
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default', ...style }}
        >
            Inspire.
        </div>
    );
};

export default Logo;
