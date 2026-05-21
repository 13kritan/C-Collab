import React, { useEffect, useRef, useState } from 'react'
import { MoreVertical, FileText, ChevronRight, HardDrive, Plus, Trash2 } from 'lucide-react'
import { useDocument } from '../hooks/useDocument'
import { InlineCloader } from '../utils/PageLoader'

export default function Documents({ projectDetails, docClick, handleDocClick }) {
    const { documents, fetchDocumentsByProject, createDocument, deleteDocument, loading, error, updateDocument } = useDocument()
    const inputRef = useRef(null)
    const [newDocClick, setNewDocClick] = useState(false)
    const [data, setData] = useState({
        name: '',
        content: ''
    })
    const [renamingId, setRenamingId] = useState(null)
    const [renameValue, setRenameValue] = useState("")

    // Auto Fetch Documents
    useEffect(() => {
        if (!projectDetails?._id) return
        fetchDocumentsByProject(projectDetails._id)
    }, [projectDetails?._id, fetchDocumentsByProject, documents])


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
        const res = await createDocument(projectId, data)
        if (res) {
            setData({
                name: '',
                content: ''
            })
            fetchDocumentsByProject(projectId)
            setNewDocClick(false)
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

    // DropDown Document
    const [openDocId, setOpenDocId] = useState(null)
    const dropdownRef = useRef({})
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!openDocId) return

            const dropdownEl = dropdownRef.current[openDocId]
            if (dropdownEl && !dropdownEl.contains(event.target)) {
                setOpenDocId(null)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [openDocId])

    return (
        <>
            <main className={`flex-1 flex flex-col ${docClick ? 'gap-3 h-full' : 'flex-1'}`}>
                {/* Toolbar */}
                <header className={`border-b border-white/[0.05] ${docClick ? 'flex-col gap-3 py-3' : 'items-center h-14'} flex  justify-between px-6 tablet:px-2 bg-workspace-dark`}>
                    <div className="flex items-center">
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                            <HardDrive size={14} />
                            <span>root</span>
                            <ChevronRight size={12} />
                            <span className="text-slate-300">{projectDetails?.name}</span>
                        </div>
                    </div>

                </header>

                {/* Folder List Grid */}
                <div className={` flex flex-col-reverse gap-3 ${docClick ? 'p-3' : 'p-8'}`}>
                    <div className="grid grid-cols-1 gap-[1px] bg-white/[0.05] border border-white/[0.05] rounded-lg">
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
                        {documents?.map((file) => (
                            <div
                                key={file._id}
                                className="relative group flex items-center justify-between px-6 tablet:px-2 bg-workspace-dark hover:bg-accent-blue/[0.03] transition-colors cursor-pointer"
                            >
                                <div onClick={() => handleDocClick(file._id)}
                                    className="flex h-full py-3 items-center gap-4 flex-1 mr-4 text-slate-300 hover:text-accent-blue">
                                    <FileText size={18} className="text-blue-400/60" />
                                    {renamingId === file._id ? (
                                        <input
                                            value={renameValue}
                                            autoFocus
                                            onChange={(e) => setRenameValue(e.target.value)}
                                            onBlur={async () => {
                                                if (!renameValue.trim()) return

                                                await updateDocument(file._id, { name: renameValue })
                                                setRenamingId(null)
                                            }}
                                            onKeyDown={async (e) => {
                                                if (e.key === "Enter") {
                                                    await updateDocument(file._id, { name: renameValue })
                                                    setRenamingId(null)
                                                }
                                                if (e.key === "Escape") {
                                                    setRenamingId(null)
                                                }
                                            }}
                                            className="bg-transparent border border-white/10 px-2 py-1 text-sm"
                                        />
                                    ) : (
                                        <span className="text-sm font-mono">{file.name}</span>
                                    )}
                                </div>

                                <div className="relative  flex items-center gap-8 font-mono text-[10px] text-slate-600">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setOpenDocId((prev) =>
                                                prev === file._id ? null : file._id
                                            )
                                        }}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-white"
                                    >
                                        <MoreVertical size={16} />
                                    </button>

                                    {openDocId === file._id && (
                                        <div ref={(el) => (dropdownRef.current[file._id] = el)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="doc-dropdown absolute right-0 top-4 w-56 origin-top-right bg-bg-primary border border-white/10 rounded-xl rounded-tr-none shadow-2xl z-50  animate-in fade-in zoom-in-95 duration-100"
                                        >
                                            {/* Update */}
                                            <div className="py-1">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setRenamingId(file._id)
                                                        setRenameValue(file.name)
                                                        setOpenDocId(null)
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-2 text-xs font-mono text-slate-400 hover:text-accent-blue hover:bg-bg-main/10"
                                                >
                                                    <FileText size={14} />
                                                    Rename
                                                </button>
                                            </div>

                                            {/* Delete */}
                                            <div className="p-1 bg-red-600/20 hover:bg-red-600/50">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        deleteDocument(file._id)
                                                        setOpenDocId(null)
                                                    }}
                                                    className="w-full rounded-md flex items-center gap-3 px-4 py-2 text-xs font-mono text-slate-300 hover:text-slate-100"
                                                >
                                                    <Trash2 size={14} />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Add Document */}
                    <div onClick={() => setNewDocClick(true)}
                        className={` border-2 border-dashed border-white/[0.03] rounded-xl flex flex-col items-center justify-center gap-3 grayscale hover:grayscale-0 transition-all cursor-pointer group ${docClick ? 'p-2' : 'p-4'}`}>
                        <div className="p-4 rounded-full bg-white/[0.02] border border-white/[0.05] group-hover:border-accent-blue/30 transition-all">
                            <Plus size={12} className="text-slate-600 group-hover:text-accent-blue" />
                        </div>
                        <p className="text-xs font-mono text-center text-slate-500 group-hover:text-slate-400 uppercase tracking-widest">Deploy new document</p>
                    </div>

                </div>

            </main>
        </>
    )
}
