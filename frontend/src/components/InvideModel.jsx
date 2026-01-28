import React, { useState } from 'react';
import { Copy, Check, RefreshCw, Users, Eye } from 'lucide-react';

const InviteModal = () => {
  const [copied, setCopied] = useState(null);
  
  // Example generated codes (In production, fetch these from your backend)
  const codes = {
    collaborator: "C-COLLAB-8291-XJ",
    viewer: "V-VIEW-1044-PQ"
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-[#161b22] border border-gray-800 p-6 rounded-2xl w-full max-w-md shadow-2xl">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white">Invite to Project</h3>
        <p className="text-gray-400 text-sm">Share a code to grant instant access.</p>
      </div>

      <div className="space-y-4">
        {/* Collaborator Code */}
        <div className="group relative bg-[#0d1117] p-4 rounded-xl border border-emerald-900/30">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1">
              <Users size={12} /> Collaborator Code
            </span>
            <span className="text-[10px] text-gray-500 italic">Full Write Access</span>
          </div>
          <div className="flex items-center justify-between">
            <code className="text-lg font-mono text-white tracking-wider">{codes.collaborator}</code>
            <button 
              onClick={() => copyToClipboard(codes.collaborator, 'collab')}
              className="p-2 hover:bg-emerald-500/10 rounded-lg transition-colors text-emerald-400"
            >
              {copied === 'collab' ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
        </div>

        {/* Viewer Code */}
        <div className="group relative bg-[#0d1117] p-4 rounded-xl border border-purple-900/30">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 flex items-center gap-1">
              <Eye size={12} /> Viewer Code
            </span>
            <span className="text-[10px] text-gray-500 italic">Read-Only Access</span>
          </div>
          <div className="flex items-center justify-between">
            <code className="text-lg font-mono text-white tracking-wider">{codes.viewer}</code>
            <button 
              onClick={() => copyToClipboard(codes.viewer, 'view')}
              className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors text-purple-400"
            >
              {copied === 'view' ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
        </div>
      </div>

      <button className="w-full mt-6 flex items-center justify-center gap-2 py-2 text-xs text-gray-500 hover:text-white transition-colors">
        <RefreshCw size={14} /> Regenerate Codes
      </button>
    </div>
  );
};

export default InviteModal;