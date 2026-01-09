import React, { useEffect, useState } from 'react'
import { Folder, Database } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useProject } from '../hooks/useProject'
import Documents from '../components/Documents'
import ProjectUpdateForm from '../components/UpdateProject'

const ProjectView = () => {
    const { id } = useParams()
    const { fetchProjectById } = useProject()
    const [projectDetails, setProjectDetails] = useState()
    const [docClick, setDocClick] = useState(false)

    const onDocClick = () => {
        setDocClick(true)
    }

    useEffect(() => {
        async function fetch() {
            const res = await fetchProjectById(id)
            setProjectDetails(res.project)
        }
        fetch()
    }, [id])

    const [activeTab, setActiveTab] = useState("Explorer")
    const navItems = [
        {
            key: "Explorer",
            label: "Explorer",
            icon: Folder,
        },
        {
            key: "Update",
            label: "Update",
            icon: Database,
        },
    ]
    const renderContent = () => {
        switch (activeTab) {
          case "Explorer":
            return (
              <Documents
                projectDetails={projectDetails}
                docClick={docClick}
              />
            )
      
          case "Update":
            return (
              <ProjectUpdateForm
                projectDetails={projectDetails}
                docClick={docClick}
              />
            )
      
          default:
            return null
        }
      }      

    return (
        <div className="flex h-full bg-workspace-dark text-slate-300 animate-in fade-in duration-500">

            {/* 1. Project Sub-Sidebar (Options) */}
            <aside className="w-60 border-r border-white/[0.05] bg-workspace-card/30 flex flex-col">
                {
                    !docClick ? <>
                        <div className="p-6 border-b border-white/[0.05]">
                            <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-accent-blue mb-1">Project Node</h2>
                            <h1 className="text-lg font-bold text-white truncate">{projectDetails?.name}</h1>
                        </div>

                        <nav className="flex-1 p-4 space-y-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeTab === item.key;

                                return (
                                    <button
                                        key={item.key}
                                        onClick={() => setActiveTab(item.key)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-mono transition-all border
                                            ${isActive ? "bg-accent-blue/10 text-accent-blue border border-accent-blue/20 "
                                                : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/[0.02] "
                                            }
        `}
                                    >
                                        <Icon size={16} />
                                        {item.label}
                                    </button>
                                );
                            })}
                        </nav>

                    </>
                        : <Documents projectDetails={projectDetails} docClick={docClick} onDocClick={onDocClick} />

                }


            </aside>

            {/* 2. Main Content Area (Documents) */}

            {
                !docClick ?
                    renderContent()
                    : <div className='w-full h-full bg-bg-surface'>hello</div>
            }



        </div>
    );
};

export default ProjectView