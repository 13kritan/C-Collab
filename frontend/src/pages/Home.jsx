import React, { useContext, useState } from 'react'
import JoinCreate from '../components/JoinCreate'
import { ProjectCard } from '../components/ProjectCard'
import { AuthContext } from '../context/AuthContext'
import { useProject } from '../hooks/useProject'
import { CardSkeleton } from '../utils/PageLoader'


function Home() {
    const { projects, loading } = useProject()
    const user = useContext(AuthContext)
    const [isJoin, setIsJoin] = useState(false)
    const collabCount = projects?.[0]?.collaborators?.length + 1 || 0
    const num = 5

    return (
        <div className='relative bg-bg-primary font-sans text-slate-200 space-y-6'>
            {/* Home Heading */}
            <div className="space-y-2">
                <h2 className='text-3xl font-bold font-mono'>My Workspace</h2>
                <p className='text-slate-400 font-mono'>Welcome Back, {user?.user?.name}. </p>
            </div>

            {/* Project Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Create/Join Project Placeholder */}
                <button onClick={() => setIsJoin(true)}
                    className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-white/[0.05] bg-transparent p-6 text-slate-500 hover:border-accent-blue/30 hover:text-accent-blue transition-all group">
                    <div className="text-3xl font-light group-hover:scale-110 transition-transform">+</div>
                    <span className="text-xs font-mono tracking-widest uppercase">Join or Create Project</span>
                </button>

                {/* Projects Mapping */}
                {
                    loading ? Array.from({ length: num }).map((_, i) => (
                        <CardSkeleton key={i} />
                    )) :
                        projects?.map((project, index) => (
                            <ProjectCard key={index} collabCount={collabCount} {...project} />
                        ))
                }
            </div>
            {
                isJoin && <JoinCreate setIsJoin={setIsJoin} />
            }
        </div>
    )
}

export default Home
