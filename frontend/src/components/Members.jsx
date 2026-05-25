import React, { useState } from 'react'
import { UserPlus, Shield, Trash2, Terminal, Eye, Code2, Copy, Check, Clock, ShieldAlert, Users, RefreshCw, X } from 'lucide-react'
import { useInvite } from '../hooks/useInvite'
import { useProject } from '../hooks/useProject'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const MembersTab = ({ projectDetails }) => {
    const navigate = useNavigate()
    const { deleteViewer, deleteCollaborator, changeRole } = useProject()
    const [inviteTabOpen, setInviteTabOpen] = useState(false)
    const projectId = projectDetails._id
    const { code, generateInvite, formatTime, loading, isExpired, error } = useInvite(projectId)

    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        if (!code || isExpired) return
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }



    return (
        <>
            <div className="flex-1 overflow-y-auto bg-[#0d1117] p-8 text-gray-300">
                <div className="flex items-center gap-2 mb-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    <Terminal size={12} className="text-accent-blue" />
                    <span>Node: {projectDetails.name}</span>
                </div>
                <div className=" mx-auto">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-2xl font-semibold text-white">Members</h1>
                        <button onClick={() => setInviteTabOpen(true)}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-all text-sm font-medium">
                            <UserPlus size={16} />
                            Invite
                        </button>
                    </div>

                    {!inviteTabOpen ?
                        <div>
                            {/* 1. OWNERS */}
                            <div className="mb-10">
                                <SectionHeader title="Project Owners" icon={<Shield size={16} />} count={projectDetails?.owner?.length} color="text-blue-400" />
                                <MemberRow navigate={navigate} key={projectDetails?.owner._id} projectDetails={projectDetails} member={projectDetails?.owner} isOwner />
                            </div>

                            {/* 2. COLLABORATORS (Read/Write) */}
                            <div className="mb-10">
                                <SectionHeader title="Collaborators" icon={<Code2 size={16} />} count={projectDetails?.collaborators.length} color="text-emerald-400" />
                                {projectDetails?.collaborators.length > 0 ? (
                                    projectDetails?.collaborators.map(c => <MemberRow navigate={navigate} key={c._id} deleteCollaborator={deleteCollaborator} projectDetails={projectDetails} changeRole={changeRole} member={c} role={'collaborator'} />)
                                ) : (
                                    <p className="text-xs text-gray-600 pl-4">No active collaborators.</p>
                                )}
                            </div>

                            {/* 3. VIEWERS (Read-Only) */}
                            <div className="mb-10">
                                <SectionHeader title="Viewers" icon={<Eye size={16} />} count={projectDetails?.viewers.length} color="text-purple-400" />
                                {projectDetails?.viewers.length > 0 ? (
                                    projectDetails?.viewers.map(v => <MemberRow changeRole={changeRole} navigate={navigate} key={v.id} deleteViewer={deleteViewer} projectDetails={projectDetails} member={v} role={'viewer'} />)
                                ) : (
                                    <p className="text-xs text-gray-600 pl-4">No read-only viewers.</p>
                                )}
                            </div>
                        </div> :

                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-800 bg-[#161b22] shadow-2xl">

                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-gray-800 p-5">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Invite Members</h3>
                                        <p className="text-xs text-gray-500">Codes expire after 10 minutes</p>
                                    </div>
                                    <button onClick={() => setInviteTabOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="p-6">
                                    {/* Role Selection Buttons */}
                                    <div className="mb-6 flex gap-3">
                                        <button
                                            onClick={() => { generateInvite('collaborators'); }}
                                            disabled={loading}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-500 disabled:opacity-50"
                                        >
                                            <Users size={16} /> {loading ? '...' : 'Collab Code'}
                                        </button>
                                        <button
                                            onClick={() => { generateInvite('viewers'); }}
                                            disabled={loading}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-purple-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-purple-500 disabled:opacity-50"
                                        >
                                            <Eye size={16} /> {loading ? '...' : 'Viewer Code'}
                                        </button>
                                    </div>

                                    {/* Error Message */}
                                    {error && (
                                        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-900/30 bg-red-900/10 p-3 text-xs text-red-400">
                                            <ShieldAlert size={14} /> {error}
                                        </div>
                                    )}

                                    {/* Dynamic Code Display */}
                                    {code ? (
                                        <div className={`relative rounded-xl border p-6 transition-all ${isExpired ? 'border-gray-800 bg-gray-900/20' : 'border-blue-500/30 bg-blue-500/5'}`}>

                                            <div className="mb-4 flex items-center justify-between">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                    {isExpired ? 'Status: Expired' : 'Active Invite Code'}
                                                </span>
                                                <div className={`flex items-center gap-1 font-mono text-xs ${isExpired ? 'text-red-500' : 'text-blue-400'}`}>
                                                    <Clock size={12} /> {isExpired ? '00:00' : formatTime}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between gap-4 rounded-lg bg-[#0d1117] p-4 border border-gray-800">
                                                <code className={`text-3xl font-mono font-bold tracking-[0.3em] ${isExpired ? 'text-gray-700' : 'text-white'}`}>
                                                    {isExpired ? '------' : code}
                                                </code>
                                                <button
                                                    onClick={handleCopy}
                                                    disabled={isExpired}
                                                    className="rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white disabled:opacity-20"
                                                >
                                                    {copied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
                                                </button>
                                            </div>

                                            {isExpired && (
                                                <div className="mt-4 text-center">
                                                    <button
                                                        onClick={() => generateInvite('collaborators')}
                                                        className="flex items-center justify-center gap-2 text-xs text-blue-400 hover:underline mx-auto"
                                                    >
                                                        <RefreshCw size={12} /> Regenerate new code
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed border-gray-800 text-gray-600">
                                            <Users size={32} className="mb-2 opacity-20" />
                                            <p className="text-xs">Select a role to generate a code</p>
                                        </div>
                                    )}
                                </div>

                                {/* Footer Info */}
                                <div className="bg-[#0d1117] p-4 text-center text-[10px] text-gray-600 uppercase tracking-tighter">
                                    Security Note: Codes are valid for a single use or 10 minutes.
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

// Sub-component for section titles
const SectionHeader = ({ title, icon, count, color }) => (
    <div className={`flex items-center justify-between border-b border-gray-800 pb-2 mb-4 ${color}`}>
        <div className="flex items-center gap-2 uppercase text-xs tracking-[0.2em] font-bold">
            {icon}
            {title}
        </div>
        <span className="text-[10px] bg-gray-800 px-2 py-0.5 rounded-full text-gray-400">{count}</span>
    </div>
)

function getInitials(name = "") {
    if (!name.trim()) return "";

    const parts = name.trim().split(/\s+/);

    const first = parts[0][0];
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";

    return (first + last).toUpperCase();
}


const MemberRow = ({ member, isOwner, projectDetails, deleteCollaborator, deleteViewer, navigate, changeRole, role }) => (
    
    <div
        className="group flex items-center justify-between py-3 px-3 hover:bg-[#161b22] rounded-md transition-all border border-transparent hover:border-gray-800 mb-1">
        <div onClick={() => navigate(`/view-profile/${member._id}`, {
            state: member
        })}
            className="flex items-center gap-4">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-inner ${isOwner ? 'bg-blue-900/30 text-blue-400' : 'bg-gray-800 text-gray-400'}`}>

                {member?.image ? (
                    <img
                        src={member.image}
                        alt={member.name}
                        className="w-8 h-8 rounded-full"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                        {getInitials(member?.name)}
                    </div>
                )}
            </div>
            <div>
                <div className="text-sm text-gray-200 font-medium">{member?.name}</div>
                <div className="text-[11px] text-gray-500 font-mono tracking-tight">{member?.email}</div>
            </div>
        </div>

{/* CHANGE ROLES */}
        <div className="flex items-center gap-4">
        
            {!isOwner && ( 
                <select  onChange={(e) => changeRole(e.target.value, member._id, projectDetails._id)}
                    className="bg-[#0d1117] border border-gray-800 rounded px-2 py-1 text-[11px] text-gray-400 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer hover:text-white"
                    defaultValue={role}
                >
                    <option value="collaborator">Collaborator</option>
                    <option value="viewer">Viewer</option>
                </select>
                
            )}
            <button onClick={() => {
                const projectId = projectDetails._id
                const isCollaborator = projectDetails.collaborators?.some(
                    (c) => c._id === member._id
                )
                const isViewer = projectDetails.viewers?.some(
                    (c) => c._id === member._id
                )
                try {
                    if (isCollaborator) deleteCollaborator(projectId, member._id)
                    else if (isViewer) deleteViewer(projectId, member._id)
                    else if (isOwner) toast.error("Cant delete Owner")


                } catch (error) {
                    console.log(error)
                }


            }}
                className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                <Trash2 size={14} />
            </button>
        </div>
    </div>
);

export default MembersTab