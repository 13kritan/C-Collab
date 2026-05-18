import { Check, ChevronLeft, ChevronRight, Code2, Loader2, Play, Save, Terminal } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDocument } from '../hooks/useDocument'
import Editor from '@monaco-editor/react'
import Output from './Output'
import useCompilerSocket from "../hooks/useCompilerSocket"
import DocAudit from './DocAudit'

export default function IDE({ docId, setDocClick, isViewer }) {
    const { loading, fetchDocumentById, updateDocument } = useDocument()
    const { runCode, sendInput, output, running, awaitingInput } = useCompilerSocket()


    const [doc, setDoc] = useState()
    const [saved, setSaved] = useState(false)
    const [isEditor, setIsEditor] = useState(true)
    const [code, setCode] = useState(doc?.content)

    // Handle change: 'value' is the full string content
    const handleEditorChange = (value) => {
        setCode(value)
    }
    // Save Code
    const handleSave = async () => {
        try {
            const payload = {
                name: fileName,
                content: code
            }

            const res = await updateDocument(docId, payload)

            if (res) {
                alert("Success")
            }
        } catch (error) {
            alert(error.message || "Save failed")
        }
    }

    const handleRun = () => {
        if (!code?.trim()) return
        runCode(code)
    }



    useEffect(() => {
        if (!docId) return

        async function getDocDetail() {
            const docData = await fetchDocumentById(docId)
            setCode(docData.content)
            setDoc(docData)
        }
        getDocDetail()
    }, [docId, fetchDocumentById])

    const fileName = doc?.name

    const handleEditorWillMount = (monaco) => {
        // Define  custom theme
        monaco.editor.defineTheme('workspace-theme', {
            base: 'vs-dark', // The foundation
            inherit: true,   // Inherit default highlighting
            rules: [
                { token: '', foreground: 'ffffff' },             // General text -> White
                { token: 'keyword', foreground: '3b82f6' },      // if, return, int, void -> Blue
                { token: 'type.keyword', foreground: '3b82f6' }, // size_t, uint32_t -> Blue
                { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
                { token: 'string', foreground: '10b981' },       // Strings -> Emerald
                { token: 'preprocessor', foreground: '94a3b8' }, // #include, #define -> Muted Slate
                { token: 'number', foreground: '60a5fa' },       // Constants/Numbers -> Sky Blue
            ],
            colors: {
                // Workspace-dark background
                'editor.background': '#0d1117',
                'editor.foreground': '#cbd5e1',

                // Customizing the active line and selection
                'editor.lineHighlightBackground': '#161b22',
                'editor.selectionBackground': '#3b82f640', // 25% opacity blue

                // Gutter (line numbers area)
                'editorLineNumber.foreground': '#475569',
                'editorLineNumber.activeForeground': '#3b82f6',

                // Cursor and focus
                'editorCursor.foreground': '#3b82f6',
                'editor.focusBorder': '#00000000', // Hide default focus border

                // Scrollbar (matching your sleek design)
                'scrollbarSlider.background': '#ffffff10',
                'scrollbarSlider.hoverBackground': '#ffffff20',
                'scrollbarSlider.activeBackground': '#3b82f640',
            },
        })
    }

    return (
        <div className='w-full h-full bg-bg-primary p-2 flex flex-col'>
           
            <div className="relative header flex items-center justify-between ">
                <div className='flex items-center py-2 '>
                    <button onClick={() => setDocClick(false)}
                        className="flex items-center gap-2 text-slate-400 hover:text-accent-blue transition-all mr-4 group font-mono text-[10px] uppercase tracking-[0.4em]">
                        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Workspace
                    </button>

                    <div className="text-white font-mono text-sm flex gap-2 items-center">
                        <span className='text-accent-blue text-base'>[C]</span>
                        <span>{doc?.name}.c</span>
                    </div>
                </div>

                <DocAudit docId={docId} />

                {!isViewer &&
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className={`flex items-center gap-2 mr-5 px-3 py-1 rounded border text-xs font-mono transition-all
            ${saved
                                ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10'
                                : 'border-blue-500/50 text-blue-400 bg-blue-500/10 hover:bg-blue-500/20'}
          `}
                    >
                        {loading ? <Loader2 size={12} className="animate-spin" /> : saved ? <Check size={12} /> : <Save size={12} />}
                        {loading ? 'Saving...' : saved ? 'Saved' : 'Save'}
                    </button>
                }
            </div>


            <header className="h-14 border-b border-white/[0.05] flex items-center justify-between px-6 bg-[#0d1117]">
                {/* Segmented Control Toggle */}
                <div className="flex p-1 bg-white/[0.03] border border-white/[0.08] rounded-lg">
                    <button
                        onClick={() => setIsEditor(true)}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-[11px] font-mono transition-all ${isEditor
                            ? 'bg-accent-blue text-white shadow-lg'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <Code2 size={14} />
                        SOURCE
                    </button>
                    <button
                        onClick={() => setIsEditor(false)}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-[11px] font-mono transition-all ${!isEditor
                            ? 'bg-accent-blue text-white shadow-lg'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <Terminal size={14} />
                        OUTPUT
                    </button>
                </div>
                <button
                    onClick={() => handleRun()}
                    disabled={running}
                    className="group relative flex items-center gap-2 px-5 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg transition-all hover:bg-emerald-500/20 active:scale-95 disabled:opacity-50"
                >
                    {/* The Icon */}
                    {running ? (
                        <Loader2 size={14} className="animate-spin text-emerald-400" />
                    ) : (
                        <Play size={14} className="fill-emerald-400 text-emerald-400 group-hover:scale-110 transition-transform" />
                    )}

                    {/* Button Text */}
                    <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-emerald-400">
                        {running ? "Executing..." : "Run Code"}
                    </span>

                    {/* Subtle Neon Glow Effect */}
                    <div className="absolute inset-0 rounded-lg bg-emerald-500/5 blur-md group-hover:bg-emerald-500/10 transition-all" />
                </button>
            </header>

            {/* Main Content Body */}
            <div className=' bg-bg-main w-full flex-1 px-4 py-2 rounded-md overflow-hidden'>
                <div className="relative flex-1 flex flex-col h-full bg-[#1e1e1e]">

                    {/* The Editor Instance */}
                    <div className="absolute inset-0 flex-1 overflow-hidden">
                        {isEditor ?
                            <Editor
                                height="100%"
                                defaultLanguage='c'
                                defaultValue={doc?.content}
                                value={code}
                                theme="workspace-theme"
                                onChange={handleEditorChange}
                                beforeMount={handleEditorWillMount}
                                loading={<div className="text-slate-500 font-mono text-xs animate-pulse p-10">Initializing Kernel Editor...</div>}
                                options={{
                                    readOnly: isViewer,
                                    fontFamily: 'JetBrains Mono, Menlo, monospace',
                                    fontSize: 13,
                                    minimap: { enabled: false },
                                    lineNumbers: 'on',
                                    glyphMargin: false,
                                    folding: true,
                                    lineDecorationsWidth: 10,
                                    lineNumbersMinChars: 3,
                                    formatOnType: true,
                                    autoClosingBrackets: 'always',
                                }}
                            />
                            : <Output running={running} output={output} sendInput={sendInput} awaitingInput={awaitingInput} />
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}
