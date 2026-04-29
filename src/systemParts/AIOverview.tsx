import React from 'react';
import { X } from 'lucide-react';

interface AIOverviewProps {
    onClose: () => void;
}

const AIOverview: React.FC<AIOverviewProps> = ({ onClose }) => {
    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            position: 'relative'
        }}>
            {/* Top Bar with Close Button */}
            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '16px',
            }}>
                <button 
                    onClick={onClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px',
                        borderRadius: '50%',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f3f4'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    <X size={24} />
                </button>
            </div>

            {/* Placeholder Content */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                fontFamily: "'Inter', sans-serif",
                padding: '24px'
            }}>
                AI Overview Content
            </div>
        </div>
    );
};

export default AIOverview;
