import React from 'react';
import { Box, styled } from '@mui/material';

// FIX: Add 'export' keyword here so it can be imported in FutureOpportunitiesPage.js
export const getCategoryColors = (category) => {
  switch (category) {
    case 'Strategic Partnership':
      return { background: '#5EEAD4', text: 'black' }; 
    case 'Influencer Results':
      return { background: '#7295bc', text: 'black' };
    case 'New Geos':
      return { background: '#a389bd', text: 'black' };
    case 'Future Technologies':
      return { background: '#b383bc', text: 'black' };
    case 'Missed Revenue Potential':
      return { background: '#bc7e86', text: 'black' };
    case 'AI Integration':
      return { background: '#fdba74', text: 'black' };
    case 'New Branding Channels':
      return { background: '#BEF264', text: 'black' };
    case 'Misc. 1':
      return { background: '#FDE047', text: 'black' };
    case 'Misc. 2':
      return { background: '#F9A8D4', text: 'black' };
    default:
      return { background: '#374151', text: 'black' };
  }
};

const CategoryChipContainer = styled(Box)(({ label, selected }) => {
  const colors = getCategoryColors(label);
  return {
    backgroundColor: colors.background,
    color: colors.text,
    borderRadius: '10px',
    padding: '10px 14px', 
    display: 'inline-flex',
    fontWeight: selected ? 700 : 600, // ✅ Bold when selected
    fontSize: '0.80rem', 
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    alignItems: 'center',
    // ✅ Border styling based on selection
    border: selected ? '3px solid #FFFF00' : '3px solid transparent',
    boxShadow: selected ? '0 0 10px rgba(255, 255, 0, 0.5)' : 'none', // ✅ Optional glow effect
    transition: 'all 0.2s ease', // ✅ Smooth transition
    '&:hover': {
      transform: 'scale(1.05)', // ✅ Slight zoom on hover
      boxShadow: selected ? '0 0 15px rgba(255, 255, 0, 0.7)' : '0 2px 8px rgba(0,0,0,0.2)',
    }
  };
});

const CategoryChip = ({ label, selected = false, className = '', style = {} }) => {
    return (
        <CategoryChipContainer 
          label={label} 
          selected={selected} 
          className={className} 
          sx={style}
        >
            {label}
        </CategoryChipContainer>
    );
};

export default CategoryChip;