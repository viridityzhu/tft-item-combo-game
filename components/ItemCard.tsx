import React from 'react';
import { Item } from '../types';

interface ItemCardProps {
  item: Item;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onClick, selected, disabled, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-20 h-20 text-sm',
    lg: 'w-24 h-24 text-base',
  };

  const baseClasses = `
    relative flex flex-col items-center justify-center 
    border-2 rounded-xl transition-all duration-200 ease-out
    cursor-pointer hover:scale-105 active:scale-95
    shadow-lg select-none overflow-hidden
  `;

  const stateClasses = disabled
    ? 'opacity-50 cursor-not-allowed grayscale'
    : selected
    ? 'border-yellow-400 ring-4 ring-yellow-400/30 bg-slate-800 z-10 scale-110'
    : 'border-slate-600 bg-slate-800 hover:border-slate-400';

  // Fallback initials
  const initials = item.name.length > 3 ? item.name.substring(0, 1) : item.name;

  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={`${baseClasses} ${sizeClasses[size]} ${stateClasses}`}
      title={item.description}
    >
      {/* Background tint */}
      <div className={`absolute inset-0 opacity-20 ${item.color} z-0`}></div>
      
      {item.image ? (
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover z-10 p-1 rounded-xl"
          onError={(e) => {
            // Fallback if image fails
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <div className="z-10 font-bold text-center drop-shadow-md leading-tight px-1 text-white">
          {initials}
        </div>
      )}
      
      {/* Selection Checkmark */}
      {selected && (
        <div className="absolute -top-2 -right-2 bg-yellow-400 text-black rounded-full p-0.5 shadow-sm z-20">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </button>
  );
};

export default ItemCard;