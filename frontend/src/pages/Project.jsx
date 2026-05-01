import React, { useContext, useEffect, useState } from 'react'
import { Folder, Database, Users2 } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useProject } from '../hooks/useProject'
import Documents from '../components/Documents'
import ProjectUpdateForm from '../components/UpdateProject'
import IDE from '../components/IDE'
import MembersTab from '../components/Members'
import { AuthContext } from '../context/AuthContext'
import AuditSideBar from '../components/AuditSideBar'

const ProjectView = () => {
    const { id } = useParams()
    const { fetchProjectById } = useProject()
    const [projectDetails, setProjectDetails] = useState()
    const [docClick, setDocClick] = useState(false)
    const [currentDocId, setCurrentDocId] = useState()
    const user = useContext(AuthContext)

    useEffect(() => {
        async function fetch() {
            const res = await fetchProjectById(id)
            setProjectDetails(res?.project)
        }
        fetch()
    }, [id])

    // On Document Click
    const handleDocClick = (docId) => {
        console.log("DocId: " + docId)
        setCurrentDocId(docId)
        setDocClick(true)
    }

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
        {
            key: "Members",
            label: "Members",
            icon: Users2,
        },
    ]
    const renderContent = () => {
        switch (activeTab) {
            case "Explorer":
                return (
                    <Documents
                        projectDetails={projectDetails}
                        docClick={docClick}
                        handleDocClick={handleDocClick}
                    />
                )

            case "Update":
                return (
                    <ProjectUpdateForm
                        projectDetails={projectDetails}
                        docClick={docClick}
                    />
                )

            case "Members":
                return (
                    <MembersTab
                        projectDetails={projectDetails}
                    />
                )

            default:
                return null
        }
    }

    const isViewer = projectDetails?.viewers?.some(
        (c) => c._id === user?.user?.id
    )

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

                        {projectDetails && <AuditSideBar projectId={projectDetails?._id} />}

                    </>
                        : <Documents projectDetails={projectDetails} docClick={docClick} handleDocClick={handleDocClick} />

                }


            </aside>

            {/* 2. Main Content Area (Documents) */}

            {
                !docClick ?
                    renderContent()
                    : <IDE docId={currentDocId} setDocClick={setDocClick} isViewer={isViewer} />
            }

        </div>
    );
};

export default ProjectView