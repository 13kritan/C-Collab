import React from 'react'
import {  ShieldAlert, Monitor } from 'lucide-react'

const ResponsiveBreak = ({ viewportWidth }) => {

  return (
    <div className="fixed inset-0 z-[9999] bg-[#010409] text-[#c9d1d9] font-mono flex items-center justify-center p-6 selections-none">
      {/* Outer Console Window */}
      <div className="w-full max-w-md bg-[#0d1117] border border-red-900/50 shadow-[0_0_50px_rgba(248,81,73,0.1)] rounded-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-[#30363d]">
          <div className="flex items-center gap-2 text-[10px] text-red-500 font-bold uppercase tracking-widest">
            <ShieldAlert size={14} className="animate-pulse" />
            System // Display_Fault
          </div>
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-gray-700" />
          </div>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div className="bg-red-950/20 border-l-2 border-red-500 p-3 text-[#f85149] rounded-r font-bold">
            [SIGWINCH] KERNEL_PANIC: RESOLUTION_UNDERFLOW
          </div>

          <div className="space-y-1.5 font-mono text-[11px] text-gray-400 bg-[#161b22]/50 p-3 rounded border border-[#30363d]">
            <div>&gt; CURRENT_WIDTH : {viewportWidth}px</div>
            <div>&gt; MIN_REQUIRED  : 768px</div>
            <div>&gt; SUBSYSTEM     : Core.Workspace.IDE</div>
            <div>&gt; STATUS        : HALTED (Resource Insufficient)</div>
          </div>

          <div className="text-gray-400 text-[11px] leading-relaxed pl-1">
            The C-Collab code editor, debugger console, and collaboration system require a larger workspace canvas to prevent text layout corruption and system breakage.
          </div>

          <div className="flex items-center gap-3 pt-2 text-blue-400 text-[11px] font-bold uppercase tracking-wide">
            <Monitor size={14} />
            <span>[ Action: Attach external display or expand view ]</span>
          </div>
        </div>

        <div className="px-4 py-2 bg-[#161b22] border-t border-[#30363d] flex justify-between text-[9px] text-gray-600">
          <span>TTY1 // CC_GUARD_v1.0</span>
          <span className="animate-pulse">_</span>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveBreak