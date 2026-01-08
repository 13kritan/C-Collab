import React from 'react';
import { Search, Plus } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed z-20 top-0 left-0 pl-72 w-full h-16 border-b border-white/[0.05] bg-bg-subtle flex items-center justify-between px-8">
      {/* Left Section: Search Bar */}
      <div className="flex flex-1 max-w-md">
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-accent-blue transition-colors">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-bg-surface border border-white/[0.05] rounded-md py-1.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/20 transition-all font-mono"
          />
        </div>
      </div>

      {/* Right Section: Actions & Profile */}
      <div className="flex items-center gap-4">
        {/* New Project Button */}
        <button className="flex items-center gap-2 bg-accent-blue hover:bg-blue-600 text-white text-xs font-bold py-2 px-4 rounded-md transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] active:scale-95 cursor-pointer">
          <Plus size={16} strokeWidth={3} />
          <span>New Project</span>
        </button>

        {/* User Profile */}
        <div className="relative flex items-center gap-2 pl-2 border-l border-white/[0.1]">
          <div className="h-8 w-8 rounded-full overflow-hidden border border-accent-blue shadow-[0_0_8px_rgba(59,130,246,0.5)] cursor-pointer hover:opacity-80 transition-opacity">
            <img 
              src="/api/placeholder/32/32" // Replace with your avatar source
              alt="User"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
