import React, { useContext, useRef, useState } from 'react'
import { Search, Plus } from 'lucide-react'
import { User, Settings, Terminal, Shield } from 'lucide-react'
import ProfileDropdown from './Dropdown';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const user = useContext(AuthContext)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  const checkLoc = true
  const menuItems = [
    { label: 'Profile', icon: <User size={14} />, location: '/profile' },
    { label: 'Settings', icon: <Settings size={14} /> },
    { label: 'API Keys', icon: <Terminal size={14} /> },
    { label: 'Security', icon: <Shield size={14} /> },
  ]
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
        <button onClick={() => navigate('/create')}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-slate-100 text-xs font-bold py-2 px-4 rounded-md transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] active:scale-95 cursor-pointer">
          <Plus size={16} strokeWidth={3} />
          <span>New Project</span>
        </button>

        {/* User Profile */}
        <div className="relative flex items-center gap-2 pl-2 border-l border-white/[0.1]">
          <div onClick={() => setIsOpen(!isOpen)}
            ref={dropdownRef}
            className="h-8 w-8 rounded-full overflow-hidden border border-accent-blue shadow-[0_0_8px_rgba(59,130,246,0.5)] cursor-pointer">
            <img
              src={user?.user?.image}
              alt="User"
              className="h-full w-full object-cover"
            />
            {
              isOpen && <ProfileDropdown menuItems={menuItems} dropdownRef={dropdownRef} isOpen={isOpen} setIsOpen={setIsOpen} checkLoc={checkLoc} />
            }
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
