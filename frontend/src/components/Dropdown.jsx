import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { UserMinus } from 'lucide-react'
import useAuth from '../hooks/useAuth'

const ProfileDropdown = ({ menuItems, dropdownRef, isOpen, setIsOpen }) => {
    const user = useContext(AuthContext)
    const { logout } = useAuth()
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])



    return (
        <>
            {/* Dropdown Menu */}
            {isOpen && (
                <div onMouseEnter={(e) => e.stopPropagation()}
                    onMouseMove={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 mt-3 w-56 origin-top-right bg-bg-primary/20 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">

                    {/* Header Section */}
                    <div className="px-4 py-3 border-b border-white/[0.05] bg-bg-main/10">
                        <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">Developer</p>
                        <p className="text-sm font-bold text-slate-100 truncate">{user.user?.email}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                        {menuItems.map((item, index) => (
                            <button
                                key={index}
                                className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-mono text-slate-400 hover:text-accent-blue hover:bg-bg-main/10 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-slate-500 group-hover:text-accent-blue transition-colors">
                                        {item.icon}
                                    </span>
                                    <span>{item.label}</span>
                                </div>
                                {item.detail && <span className="text-[9px] text-slate-600">{item.detail}</span>}
                            </button>
                        ))}
                    </div>

                    {/* Logout Section */}
                    <div className="border-t border-white/[0.05] bg-red-500/[0.02] mt-1">
                        <button onClick={logout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-xs font-mono text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                            <UserMinus size={14} />
                            <span>Terminate Session</span>
                        </button>
                    </div>

                    {/* Bottom Accent Line */}
                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-accent-blue/50 to-transparent" />
                </div>
            )}
        </>
    )
}

export default ProfileDropdown;