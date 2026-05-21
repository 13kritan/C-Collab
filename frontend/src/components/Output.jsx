import React, { useState } from 'react'

export default function Output({ running, output, sendInput, awaitingInput }) {
    const [inputValue, setInputValue] = useState("")

    const handleSend = () => {
        if (!inputValue.trim()) return
        sendInput(inputValue)
        setInputValue("")
    }

    return (
        <div className='flex flex-col h-full font-mono bg-[#050505] border border-white/[0.05] rounded-lg overflow-hidden'>
            <header className="flex items-center justify-between px-4 py-2 bg-white/[0.03] border-b border-white/[0.05]">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/40 border border-red-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40 border border-amber-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40 border border-emerald-500/60" />
                    </div>
                    <h1 className="ml-2 text-[10px] uppercase tracking-widest text-slate-500 font-bold">Terminal</h1>
                </div>
            </header>

            <div className='flex-1 p-6 overflow-y-auto text-sm custom-scrollbar'>
                <div className="mb-4">
                    <span className="text-blue-400">❯ </span>
                    <span className="text-slate-400">{running ? "Process running..." : "System idle."}</span>
                </div>

                <pre className="whitespace-pre-wrap text-slate-200 mb-4">{output}</pre>

                {awaitingInput && (
                    <div className="flex gap-2 mt-4 animate-in fade-in duration-300">
                        <span className="text-emerald-400">➜</span>
                        <input
                            autoFocus
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            className="flex-1 bg-transparent text-white outline-none border-b border-white/20 focus:border-blue-500 transition-colors"
                            placeholder="Type input and press Enter..."
                        />
                    </div>
                )}
            </div>
        </div>
    )
}