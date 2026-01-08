import React, { useState } from 'react'
import { LayoutGrid, Box, Share2, Activity } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('Projects')
  const navigate = useNavigate()

  const menuItems = [
    { name: 'Projects', icon: <LayoutGrid size={18} />, path: 'home' },
    { name: 'Recent', icon: <Box size={18} />, path: 'recent' },
    { name: 'Shared', icon: <Share2 size={18} />, path: 'shared' },
    { name: 'Activity', icon: <Activity size={18} />, path: 'activity' },
  ]

  return (
    <div className="fixed z-30 top-0 left-0 w-64 h-screen bg-bg-main border-r border-white/[0.05] flex flex-col py-6 ">
      {/* Brand / Logo Section */}
      <div className="px-8 mb-10 flex items-center w-full gap-1">
        <div className="text-accent-blue text-3xl font-bold tracking-tighter flex items-center">
          <span className="opacity-50">[</span>
          <span className="px-0.5">C</span>
          <span className="opacity-50">]</span>
        </div>
        <h1 className='font-mono font-bold text-2xl tracking-tighter text-slate-200'>- Collab</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => {
              setActiveTab(item.name)
              navigate(`/${item.path}`)
            }}
            className={`
              w-full flex items-center gap-4 py-3 px-8 transition-all duration-200
              font-mono text-sm group relative
              ${activeTab === item.name
                ? 'text-slate-100 bg-white/[0.03]'
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.01]'}
            `}
          >
            {/* Active Indicator Line */}
            {activeTab === item.name && (
              <div className="absolute left-0 w-[2px] h-full bg-accent-blue shadow-[0_0_10px_#3b82f6]" />
            )}

            <span className={`${activeTab === item.name ? 'text-accent-blue' : 'text-slate-500 group-hover:text-slate-300'}`}>
              {item.icon}
            </span>

            <span className="tracking-tight">{item.name}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar