import React, { useContext, useState } from 'react';
import { ChevronDown, History, X } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { useDocumentAudit } from '../hooks/useDocSocket'

const DocAudit = ({docId}) => {
  const [isOpen, setIsOpen] = useState(false)
  const user = useContext(AuthContext)

  
  const { auditLog } = useDocumentAudit({
    documentId: docId,
    currentUserId: user?.user._id
  })

  const latest = auditLog[auditLog.length - 1]

  return (
    <>
      {/* --- TOP BOX --- */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-3 px-4 py-1.5 bg-[#0d1117] border-x border-b border-[#30363d] cursor-pointer hover:bg-[#161b22] transition-colors group"
      >
        <div className="flex items-center gap-2">
          {/* <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${latest.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'
            }`} /> */}
          <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-tighter">
            Audit_Log:
          </span>
        </div>

        <span className="text-[11px] font-mono text-[#c9d1d9] truncate max-w-[250px]">
          [{latest?.time}] {latest?.msg}
        </span>

        <ChevronDown size={12} className={`text-gray-600 group-hover:text-white transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* HISTORY DROPDOWN  */}
      {isOpen && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-[70] w-full max-w-lg bg-[#0d1117] border border-[#30363d] shadow-2xl font-mono overflow-hidden animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              <History size={12} /> System_Audit_History
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white">
              <X size={14} />
            </button>
          </div>

          <div className="max-h-[300px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {auditLog?.map(log => (
              <div key={log.id} className="text-zinc-400">
                <span className="text-red-500">
                [{new Date(log.timestamp).toLocaleTimeString('en-GB', { hour12: false })}]
                </span>{" "}
                {log.message}
              </div>
            ))}
          </div>

          <div className="p-2 border-t border-[#30363d] bg-[#0d1117] flex justify-center">
            <span className="text-[9px] text-gray-600 uppercase">End of Log — Total Events: {auditLog?.length}</span>
          </div>
        </div>
      )}
    </>
  )
}

export default DocAudit