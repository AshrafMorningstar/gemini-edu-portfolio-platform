
import React from 'react';
import { User, UserRole } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  if (!user) return null;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-card px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-bold rounded-sm shadow-[4px_4px_0px_#444]">
          T
        </div>
        <span className="text-xl font-bold tracking-tighter">TPS<span className="text-gray-500">.EDU</span></span>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-gray-500 uppercase tracking-widest">{user.role}</p>
        </div>
        <button 
          onClick={onLogout}
          className="px-4 py-2 border border-white hover:bg-white hover:text-black transition-all duration-300 text-sm font-medium"
        >
          LOGOUT
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
