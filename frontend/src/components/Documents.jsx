import React, { useEffect, useRef, useState } from 'react'
import { MoreVertical, FileText, ChevronRight, HardDrive, Search, ExternalLink, Plus } from 'lucide-react'
import { useDocument } from '../hooks/useDocument'
import { InlineCloader } from '../utils/PageLoader'

export default function Documents({ projectDetails, docClick }) {
    const { documents, fetchDocumentsByProject, createDocument, loading } = useDocument()
    const inputRef = useRef(null)
    const [newDocClick, setNewDocClick] = useState(false)
    const [data, setData] = useState({
        name: '',
        content: ''
    })

    // Auto Fetch Documents
    useEffect(() => {
        if (!projectDetails?._id) return

        fetchDocumentsByProject(projectDetails._id)
    }, [projectDetails?._id, fetchDocumentsByProject])


    // On Change Function
    const dataOnChange = (e) => {
        const { name, value } = e.target

        setData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // Add Doc Function
    const handleAddDocument = async () => {
        const projectId = projectDetails._id
        console.log(projectId)
        const res = await createDocument(projectId, data)
        if (res) {
            setData({
                name: '',
                content: ''
            })
            alert("Doc Added")
        }
        else alert("Doc Not Added")
    }

    // Add Doc Function on Enter
    const handleAddDocOnEnter = (e) => {
        if (e.key === "Enter") {
            handleAddDocument()
        }
    }

    // Close doc when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setNewDocClick(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Focus when new doc click
    useEffect(() => {
        if (newDocClick && inputRef.current) {
            inputRef.current.focus()
        }
    }, [newDocClick])

    return (
        <>
            <main className={`flex-1 flex flex-col ${docClick ? 'gap-3 h-full' : 'flex-1'}`}>
                {/* Toolbar */}
                <header className={`border-b border-white/[0.05] ${docClick ? 'flex-col gap-3 py-3' : 'items-center h-14'} flex  justify-between px-6 bg-workspace-dark`}>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                            <HardDrive size={14} />
                            <span>root</span>
                            <ChevronRight size={12} />
                            <span className="text-slate-300">{projectDetails?.name}</span>
                        </div>
                    </div>
                    <div className={`flex items-center gap-3`}>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                            <input
                                type="text"
                                placeholder="Find in files..."
                                className={`bg-white/[0.03] border border-white/[0.05] rounded py-1 pl-9 pr-3 text-xs focus:outline-none focus:border-accent-blue/50 transition-all ${docClick ? 'w-32' : 'w-48'}`}
                            />
                        </div>
                        <button className="p-2 text-slate-500 hover:text-white transition-colors"><ExternalLink size={16} /></button>
                    </div>
                </header>

                {/* Folder List Grid */}
                <div className={`overflow-y-auto flex flex-col-reverse gap-3 ${docClick ? 'p-3' : 'p-8'}`}>
                    <div className="grid grid-cols-1 gap-[1px] bg-white/[0.05] border border-white/[0.05] rounded-lg overflow-hidden">
                        {
                            newDocClick && <div
                                className="group flex items-center justify-between px-6 py-3 bg-bg-subtle transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-4 w-full">

                                    {
                                        loading ? <InlineCloader /> :
                                            <FileText size={18} className="text-blue-400/60" />
                                    }

                                    <input onChange={(e) => dataOnChange(e)}
                                        ref={inputRef}
                                        onKeyDown={handleAddDocOnEnter}
                                        name='name'
                                        value={data.name}
                                        className="text-sm font-mono tracking-tight outline-none text-slate-300 bg-bg-subtle w-full" />
                                </div>
                            </div>
                        }
                        {
                            documents?.map((file, i) => (
                                <div
                                    key={i}
                                    className="group flex items-center justify-between px-6 py-3 bg-workspace-dark hover:bg-accent-blue/[0.03] transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <FileText size={18} className="text-blue-400/60" />
                                        <span className="text-sm font-mono tracking-tight text-slate-300 group-hover:text-white">
                                            {file.name}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-8 font-mono text-[10px] text-slate-600">
                                        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-white">
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                    {/* Empty State / Dropzone Suggestion */}
                    <div onClick={() => setNewDocClick(true)}
                        className={` border-2 border-dashed border-white/[0.03] rounded-xl flex flex-col items-center justify-center gap-3 grayscale hover:grayscale-0 transition-all cursor-pointer group ${docClick ? 'p-2' : 'p-4'}`}>
                        <div className="p-4 rounded-full bg-white/[0.02] border border-white/[0.05] group-hover:border-accent-blue/30 transition-all">
                            <Plus size={12} className="text-slate-600 group-hover:text-accent-blue" />
                        </div>
                        <p className="text-xs font-mono text-slate-500 group-hover:text-slate-400 uppercase tracking-widest">Deploy new document</p>
                    </div>

                </div>

            </main>
        </>
    )
}
