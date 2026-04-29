import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
    value?: string;
    onChange?: (val: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f1f3f4',
            borderRadius: '24px',
            padding: '8px 16px',
            width: '100%',
            maxWidth: '500px',
            border: '1px solid transparent',
            transition: 'border-color 0.2s, background-color 0.2s',
        }}>
            <Search size={20} color="#5f6368" style={{ marginRight: '12px' }} />
            <input 
                type="text" 
                placeholder="Search for courses..." 
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    outline: 'none',
                    fontSize: '1rem',
                    color: '#202124',
                    width: '100%'
                }}
            />
        </div>
    );
};

export default SearchBar;
