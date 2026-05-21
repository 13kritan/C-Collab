import React, { useState } from 'react' 
import { ChevronLeft, Terminal, Sparkles } from 'lucide-react' 
import { useNavigate } from 'react-router-dom' 
import { useProject } from '../hooks/useProject' 

const CreateProject = () => {
    const { createProject } = useProject()

    const [data, setData] = useState({
        name: '',
        description: '',
    })
    const navigate = useNavigate()

    const onChange = (e) => {
        const { name, value } = e.target
        setData((prev) => ({
            ...prev,
            [name]: value,
        }))
        console.log(data)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await createProject(data)
            if(res) navigate('/home')
        } catch (error) {
            console.error(error)
            alert(error)
        }

    }
    return (
        <div className="max-w-3xl mx-auto px-6 animate-in fade-in duration-700">
            {/* Navigation */}
            <button onClick={() => navigate('/home')}
                className="flex items-center gap-2 text-slate-500 hover:text-accent-blue transition-colors mb-10 group font-mono text-[10px] uppercase tracking-[0.3em]">
                <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                Return to Root
            </button>

            {/* Header  */}
            <div className="mb-16 relative">
                <div className="flex items-center gap-3 mb-2">
                    <Sparkles size={18} className="text-accent-blue" />
                    <h1 className="text-3xl font-bold text-slate-100 tracking-tight">New Workspace</h1>
                </div>
                <p className="text-slate-500 text-sm">Initialize a new isolated development environment.</p>
                
                <div className="absolute -bottom-6 left-0 w-full h-[1px] bg-white/[0.05]">
                    <div className="absolute left-0 w-24 h-full bg-accent-blue shadow-[0_0_10px_#3b82f6]" />
                </div>
            </div>

            <div className="space-y-8">
                {/* Name Input */}
                <div className="group">
                    <label className="block text-xs font-mono uppercase tracking-[0.2em] text-slate-500 mb-3 group-focus-within:text-accent-blue transition-colors">
                        Project Name <span className="text-accent-blue/50">*</span>
                    </label>
                    <input onChange={(e) => onChange(e)}
                        name='name'
                        value={data.name}
                        type="text"
                        placeholder="kernel-v2-refactor"
                        className="w-full bg-bg-main/40 border border-white/[0.08] rounded-lg px-4 py-2 text-slate-100 placeholder:text-slate-700 focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/10 transition-all font-mono text-md"
                    />
                </div>

                {/* Description Input */}
                <div className="group">
                    <label className="block text-xs font-mono uppercase tracking-[0.2em] text-slate-500 mb-3 group-focus-within:text-accent-blue transition-colors">
                        Project Description
                    </label>
                    <textarea onChange={(e) => onChange(e)}
                        name='description'
                        value={data.description}
                        rows={4}
                        placeholder="Define the scope and technical objectives of this workspace..."
                        className="w-full bg-bg-main/40 border border-white/[0.08] rounded-lg px-4 py-2 text-slate-100 placeholder:text-slate-700 focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/10 transition-all resize-none leading-relaxed"
                    />
                </div>

                {/* Action Section */}
                <div className="pt-6 flex items-center justify-between border-t border-white/[0.05]">
                    <p className="text-[10px] text-slate-600 font-mono italic max-w-xs">
                        System will allocate resources upon initialization.
                    </p>

                    <button onClick={(e) => handleSubmit(e)}
                        className="group relative bg-accent-blue hover:bg-blue-600 text-white font-bold py-3 px-10 rounded-lg text-sm transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)] flex items-center gap-3">
                        <Terminal size={16} className="group-hover:rotate-12 transition-transform" />
                        <span>Initialize</span>

                        <div className="absolute -top-1 -right-1 h-2 w-2 border-t border-r border-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                </div>
            </div>
        </div>
    ) 
} 

export default CreateProject