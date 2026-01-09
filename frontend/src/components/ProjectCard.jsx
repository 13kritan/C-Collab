import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

export const ProjectCard = ({_id, name, description, owner, collabCount }) => {
    const user = useContext(AuthContext)
    // Status color mapping
    const statusStyles = {
        Stable: 'bg-green-500/20 text-green-400 border-green-500/50',
        Building: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
        Error: 'bg-red-500/20 text-red-400 border-red-500/50',
    }
    const navigate = useNavigate()
    const head = owner===user?.user?.id? "YOU": owner
    const status = "Stable"

    const handleProjectClick = () => {
        navigate(`/project/${_id}`)
    }

    return (
        <div onClick={handleProjectClick}
         className="relative group bg-workspace-card border border-white/[0.05] rounded-xl p-6 hover:bg-workspace-hover hover:border-accent-blue/30 hover:text-accent-blue transition-all duration-300 group">
            {/* Top Border Segment */}
            <div className="absolute -top-[1px] left-1/4 right-1/4 h-[1px] bg-accent-blue shadow-[0_0_8px_#3b82f6]" />

            {/* Card Header */}
            <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-2">
                    <div className="text-accent-blue font-bold text-lg tracking-tighter">{"<C"}</div>
                    <h3 className="text-slate-200 font-medium text-md truncate max-w-[140px]">{name}</h3>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${statusStyles[status]}`}>
                    {status}
                </span>
            </div>

            {/* Content */}
            <div className="space-y-1 mb-8">
                <p className="text-sm text-slate-500 font-mono uppercase tracking-tight">Owner: {head}</p>
                <p className="text-sm text-slate-600 font-mono">{description}</p>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 text-slate-500">
                    <span className="text-sm">👤</span>
                    <span className="text-sm font-mono">{collabCount}</span>
                </div>
                <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-5 w-5 rounded-full border border-workspace-dark bg-slate-800" />
                    ))}
                </div>
            </div>

            {/* Bottom Border Segment */}
            <div className="absolute -bottom-[1px] left-1/3 right-1/3 h-[1px] bg-accent-blue/50" />
        </div>
    )
}