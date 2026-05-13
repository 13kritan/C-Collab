import React, { useContext, useState } from 'react'
import { Github, Linkedin, ExternalLink, Bell, Edit3, MapPin, Mail, Calendar, ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import EditProfile from '../components/EditProfile'
import Pfp from '../assets/pfp.png'

const Profile = () => {
    const navigate = useNavigate()
    const user = useContext(AuthContext)
    const [editOpen, isEditOpen] = useState(false)
    return (
        <>
            {user &&
                <div className="min-h-screen bg-[#010409] text-[#c9d1d9] p-8 font-mono">
                    {/* Container with subtle glow/glass effect */}
                    <div className="max-w-5xl mx-auto bg-[#0d1117] border border-[#30363d] rounded-xl shadow-2xl overflow-hidden">

                        {/* Top Navigation Bar */}
                        <div className=" px-6 py-4  border-b border-[#30363d] bg-[#161b22]/50">
                            <button onClick={() => navigate('/')}
                                className="flex items-center gap-2 mb-2 text-slate-400 hover:text-accent-blue transition-all group font-mono text-[10px] uppercase tracking-[0.4em]">
                                <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                                Root / Workspaces
                            </button>

                            <div className="flex items-center gap-3">
                                <div className="bg-blue-600/20 text-blue-500 p-2 rounded-md border border-blue-500/30 font-bold text-xl">
                                    [C]
                                </div>
                                <h3 className="text-lg font-semibold tracking-tight text-white space-x-2 ">C-Collab 
                                    {!editOpen ?
                                        <span className='text-sm font-medium tracking-wide text-slate-300'> Profile</span> :
                                        <span className="text-sm">  Edit Profile - <span className="text-gray-400">{user.user.name}</span></span>
                                    }
                                </h3>
                            </div>
                        </div>

                        <div className=' p-8 space-y-2 flex flex-col items-center' >
                            <button onClick={() => isEditOpen(false)}
                                className={`flex items-center gap-2 mb-2 text-slate-400 hover:text-accent-blue transition-all group font-mono text-[10px] uppercase tracking-[0.4em] ${editOpen ? '' : 'hidden'}`}>
                                <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                                Back
                            </button>
                            {!editOpen ?
                                <div className="space-y-6 w-3/4">
                                    {/* Header Section */}
                                    <div div className="flex items-center justify-between">
                                        <div className="flex items-center gap-8">
                                            <div className="relative">
                                                <img
                                                    src={user?.user?.image || Pfp}
                                                    className="w-32 h-32 rounded-full border-4 border-[#161b22] shadow-[0_0_25px_rgba(37,99,235,0.4)] ring-2 ring-blue-600"
                                                    alt="Alexander Volkov"
                                                />
                                            </div>
                                            <div>
                                                <h1 className="text-3xl font-bold text-white mb-1">{user?.user?.name}</h1>
                                                <p className="text-gray-400 text-sm">{user?.user?.title}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => isEditOpen(true)}
                                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-bold text-sm transition-all shadow-lg shadow-blue-900/20">
                                            Edit Profile
                                        </button>
                                    </div>

                                    {/* Quick Info Bar */}
                                    <div className="grid grid-cols-3 gap-4 p-4 bg-[#161b22] border border-[#30363d] rounded-xl text-[11px]">
                                        <div className="flex items-center gap-2">
                                            <Mail size={14} className="text-gray-500" />
                                            <span>Email: <span className="text-white">{user?.user?.email}</span></span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin size={14} className="text-gray-500" />
                                            <span>Location: <span className="text-white">{user?.user?.location}</span></span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-gray-500" />
                                            <span>Active Since: <span className="text-white">
                                                {
                                                    new Date(user?.user?.createdAt).toLocaleDateString('en-US', {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric"
                                                    })
                                                }
                                                </span></span>
                                        </div>
                                    </div>

                                    {/* Grid Layout for Details */}
                                    <div className="grid grid-cols-12 gap-6">

                                        {/* Left Column: Expertise & Social */}
                                        <div className="col-span-8 space-y-6">
                                            {/* Expertise Section */}
                                            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
                                                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Technical Expertise & C standards</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {user?.user?.expertise.map((tag) => (
                                                        <span key={tag} className="px-3 py-1 bg-[#0d1117] border border-[#30363d] rounded text-[11px] text-gray-400 hover:text-blue-400 hover:border-blue-500/50 cursor-default transition-colors">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Social Connections */}
                                            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
                                                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Social Connections</h3>
                                                <div className="flex gap-4">
                                                    <div className="p-3 bg-[#0d1117] border border-[#30363d] rounded-lg hover:bg-white/5 transition-colors cursor-pointer text-white">
                                                        <Github size={24} />
                                                    </div>
                                                    <div className="p-3 bg-[#0d1117] border border-[#30363d] rounded-lg hover:bg-white/5 transition-colors cursor-pointer text-white">
                                                        <Linkedin size={24} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column: Graph & Links */}
                                        <div className="col-span-4 space-y-6">
                                            <div className="space-y-3 text-[12px]">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Total Projects</span>
                                                    <span className="text-white font-bold">16</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Collaborators</span>
                                                    <span className="text-white font-bold">23</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Merged PRs</span>
                                                    <span className="text-white font-bold">27</span>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                : <EditProfile user={user} isEditOpen={isEditOpen} Pfp={Pfp} />
                            }
                        </div>
                    </div>
                </div>
            }
        </>
    );
}

export default Profile;