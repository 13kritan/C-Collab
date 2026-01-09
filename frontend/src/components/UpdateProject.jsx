import React, { useState } from 'react';
import { Save, Trash2, Info, Terminal } from 'lucide-react';
import { useProject } from '../hooks/useProject';
import { useNavigate } from 'react-router-dom';

const ProjectUpdateForm = ({ projectDetails }) => {
    const { updateProject, deleteProject, loading } = useProject()
    const [deleteClick, setDeleteClick] = useState(false)
    const [data, setData] = useState({
        name: '',
        description: '',
    })
    const navigate= useNavigate()
    // On Change Function
    const dataOnChange = (e) => {
        const { name, value } = e.target

        setData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleUpdate = async () => {
        const projectId = projectDetails._id
        const res = await updateProject(projectId, data)
        if (res) alert("Updated")
        else alert(res+ "error")
    }

    const handleDelete = async () => {
        const projectId = projectDetails._id
        const res = await deleteProject(projectId)
        if(res) {
            console.log(res)
            navigate('/home')
        }
        else alert('Failed')
    }

    return (
        <div className="max-w-4xl mx-auto py-10 px-6 animate-in fade-in duration-500">

            {/* Header with Breadcrumb-style Status */}
            <div className="flex justify-between items-end mb-12 pb-6 border-b border-white/[0.05]">
                <div>
                    <div className="flex items-center gap-2 mb-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                        <Terminal size={12} className="text-accent-blue" />
                        <span>Node: {projectDetails.name}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-100 tracking-tight">System Configuration</h1>
                </div>
                <button onClick={() => handleUpdate()}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-blue text-white text-xs font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:bg-blue-600 transition-all">
                    <Save size={14} /> Commit Changes
                </button>
            </div>

            <div className="space-y-10">

                {/* General Settings Section */}
                <section className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                            <h3 className="text-sm font-bold text-slate-200">Metadata</h3>
                            <p className="text-xs text-slate-500 mt-1">Core identification parameters for the project node.</p>
                        </div>

                        <div className="md:col-span-2 space-y-4">
                            <div className="group">
                                <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2 group-focus-within:text-accent-blue">Name</label>
                                <input onChange={(e) => dataOnChange(e)}
                                    name='name'
                                    type="text"
                                    value={data.name}
                                    defaultValue={projectDetails?.name}
                                    className="w-full bg-bg-surface/50 border border-white/[0.08] rounded-md p-3 text-slate-200 font-mono text-sm focus:outline-none focus:border-accent-blue/50"
                                />
                            </div>
                            <div className="group">
                                <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2 group-focus-within:text-accent-blue">Description</label>
                                <textarea onChange={(e) => dataOnChange(e)}
                                    name='description'
                                    value={data.description}
                                    rows={4}
                                    defaultValue={projectDetails?.description}
                                    className="w-full bg-bg-surface/50 border border-white/[0.08] rounded-md p-3 text-slate-200 text-sm focus:outline-none focus:border-accent-blue/50 resize-none"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Resources / Status Flags */}
                <section className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-xl flex items-start gap-4">
                    <div className="p-2 bg-accent-blue/10 rounded-lg text-accent-blue">
                        <Info size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-200">System Integrity</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            Updating the project identifier may break existing API endpoints and symlinks. Ensure all collaborative instances are synced before committing.
                        </p>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="pt-10 border-t border-red-500/10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                            <h3 className="text-sm font-bold text-red-500/80">Critical Zone</h3>
                            <p className="text-xs text-slate-600 mt-1">Irreversible administrative actions.</p>
                        </div>

                        <div className="md:col-span-2">
                            <div className="p-6 border border-red-500/20 bg-red-500/[0.02] rounded-xl ">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-200">Terminate Workspace</h4>
                                        <p className="text-[11px] text-slate-500 mt-1">Permanently delete all associated volumes and data.</p>
                                    </div>
                                    <button onClick={() => setDeleteClick(true)}
                                        className={`flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono hover:bg-red-500 hover:text-white transition-all ${deleteClick && 'hidden'}`}>
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                                {
                                    deleteClick && <div className="flex items-center justify-between mt-2">
                                        <div>
                                            <h4 className="text-sm font-semibold text-red-600">Are you sure?</h4>
                                            <p className="text-[11px] text-slate-500 mt-1">This action is irreversible.</p>
                                        </div>
                                        <button onClick={()=> handleDelete()}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono hover:bg-red-500 hover:text-white transition-all">
                                            <Trash2 size={14} /> Purge
                                        </button>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default ProjectUpdateForm;