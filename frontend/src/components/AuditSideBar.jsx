import React, { useState, useEffect } from 'react'
import { Terminal, ChevronRight, ChevronLeft, Activity } from 'lucide-react'
import { useProject } from '../hooks/useProject'

const AuditSidebar = ({ projectId }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [auditLog, setAuditLog] = useState([])
    const {fetchAuditLogs} = useProject()
    
    useEffect(() => {
        const getLogs = async () => {
            const res = await fetchAuditLogs(projectId)
            setAuditLog(res)
        }
    
        if (projectId) getLogs()
    }, [projectId])

    return (
        <div
            className={`fixed right-0 top-0 h-full bg-[#0d1117] border-l border-[#30363d] transition-all duration-300 z-40 ${isOpen ? 'w-72' : 'w-0'
                }`}
        >
            {/* Tab Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute left-[-28px] top-1/2 -translate-y-1/2 bg-[#0d1117] border border-[#30363d] border-r-0 py-4 px-1 text-gray-500 hover:text-blue-400 transition-colors rounded-l-md"
            >
                {isOpen ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>

            {isOpen && (
                <div className="flex flex-col h-full font-mono">
                    {/* Header */}
                    <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-[#30363d]">
                        <Activity size={14} className="text-blue-500" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                            Event_Stream
                        </span>
                    </div>

                    {/* Log List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {auditLog?.length === 0 ? (
                            <div className="text-[10px] text-gray-700 font-mono text-center mt-10">
                                [ WAITING_FOR_IO_EVENTS... ]
                            </div>
                        ) : (
                            auditLog?.map((log) => (
                                <div
                                    key={log._id}
                                    className="flex flex-col gap-1 border-l border-b border-[#30363d] pl-3 py-1 hover:border-blue-500 transition-colors group"
                                >
                                    <div className="flex justify-between items-center text-[9px]">
                                        <span className="text-gray-500">
                                            {typeof log.createdAt === 'number'
                                                ? new Date(log.createdAt).toLocaleTimeString('en-GB', { hour12: false })
                                                : log.createdAt}
                                        </span>
                                        <span className={`font-bold ${log.type === 'SIGERR' || log.type === 'ERROR' ? 'text-red-500' :
                                            log.type === 'JOIN' || log.type === 'SYSTEM' ? 'text-blue-400' :
                                                'text-gray-500'
                                            }`}>
                                            {log.action}
                                        </span>
                                    </div>
                                    <div className="text-[11px] text-[#8b949e] group-hover:text-[#c9d1d9] transition-colors break-words leading-tight">
                                        {log.details}
                                    </div>
                                    <div className="text-[11px] text-white group-hover:text-[#c9d1d9] transition-colors break-words leading-tight">
                                        {log.performedBy?.name}
                                    </div>
                                    <div className="text-[11px] text-red-300 group-hover:text-[#c9d1d9] transition-colors break-words leading-tight">
                                        {log.targetUser?.name}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-2 px-4 bg-[#0d1117] border-t border-[#30363d] text-[9px] text-gray-600 flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                            <span>LIVE_SESSION</span>
                        </div>
                        <span>LOGS: {auditLog?.length}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuditSidebar