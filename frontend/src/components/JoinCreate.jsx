import React from 'react'
import { ChevronLeft, Plus, Users, ArrowUpRight, Terminal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function JoinCreate({ setIsJoin }) {
    const navigate = useNavigate()
    return (
        <div className='fixed top-0 left-0 w-full pl-64 h-full bg-bg-main/20 backdrop-blur-lg flex items-center justify-center'>
            <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in duration-700">

                {/* 1. Minimalist Back Navigation */}
                <button onClick={() => setIsJoin(false)}
                    className="flex items-center gap-2 text-slate-400 hover:text-accent-blue transition-all mb-12 group font-mono text-[10px] uppercase tracking-[0.4em]">
                    <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Root / Workspaces
                </button>

                {/* 2. Mode Selection Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Create Project Card */}
                    <button onClick={() => navigate('/create')}
                        className="relative group flex flex-col items-start p-8 bg-workspace-card border border-white/[0.05] rounded-2xl transition-all hover:bg-white/[0.02] overflow-hidden text-left">
                        {/* Top Segmented Accent */}
                        <div className="absolute -top-[1px] left-8 right-8 h-[1px] bg-accent-blue shadow-[0_0_15px_#3b82f6] scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

                        <div className="mb-6 p-3 bg-accent-blue/10 rounded-lg text-accent-blue group-hover:scale-110 transition-transform">
                            <Plus size={24} strokeWidth={2.5} />
                        </div>

                        <h3 className="text-xl font-bold text-slate-100 mb-2 flex items-center gap-2">
                            New Workspace
                            <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-accent-blue" />
                        </h3>
                        <p className="text-sm text-slate-500 font-light leading-relaxed mb-6">
                            Initialize a fresh environment with custom project configurations and management.
                        </p>

                        <span className="mt-auto text-[10px] font-mono uppercase tracking-widest text-accent-blue/60 group-hover:text-accent-blue">
                            Execute Command _
                        </span>
                    </button>

                    {/* Join Project Card */}
                    <button className="relative group flex flex-col items-start p-8 bg-workspace-dark border border-white/[0.05] rounded-2xl transition-all hover:border-white/20 overflow-hidden text-left">
                        <div className="mb-6 p-3 bg-slate-800/50 rounded-lg text-slate-400 group-hover:text-slate-200 transition-colors">
                            <Users size={24} />
                        </div>

                        <h3 className="text-xl font-bold text-slate-300 mb-2">Collaboration</h3>
                        <p className="text-sm text-slate-600 font-light leading-relaxed mb-6">
                            Input a terminal invitation code to sync with an existing project and join a team session.
                        </p>

                        <span className="mt-auto text-[10px] font-mono uppercase tracking-widest text-slate-600 group-hover:text-slate-400">
                            Access Project _
                        </span>

                        {/* Bottom Segmented Accent (Subtle) */}
                        <div className="absolute -bottom-[1px] left-12 right-12 h-[1px] bg-white/10 group-hover:bg-white/30 transition-colors" />
                    </button>

                </div>

                {/* 3. System Footer */}
                <div className="mt-12 flex items-center justify-center gap-4 text-slate-800">
                    <div className="h-[1px] w-12 bg-current" />
                    <Terminal size={14} />
                    <div className="h-[1px] w-12 bg-current" />
                </div>

            </div>
        </div>
    )
}
