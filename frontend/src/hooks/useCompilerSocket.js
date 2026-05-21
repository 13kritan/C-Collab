import { useEffect, useRef, useState, useCallback } from "react"
import { io } from "socket.io-client"

const SOCKET_URL = "http://localhost:5000"

export default function useCompilerSocket() {
  const socketRef = useRef(null)
  const [output, setOutput] = useState("")
  const [running, setRunning] = useState(false)
  const [awaitingInput, setAwaitingInput] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    socketRef.current = io(SOCKET_URL, { auth: { token } })

    const s = socketRef.current

    s.on("stdout", (data) => setOutput((prev) => prev + data))
    s.on("stderr", (data) => setOutput((prev) => prev + data))
    s.on("awaiting-input", (state) => setAwaitingInput(state))
    
    s.on("exit", (msg) => {
      setOutput((prev) => prev + `\n--- ${msg} ---\n`)
      setRunning(false)
      setAwaitingInput(false)
    })

    return () => {
      s.off("stdout") 
      s.off("stderr") 
      s.off("exit") 
      s.off("awaiting-input") 
      s.disconnect() 
    } 
  }, []) 

  const runCode = useCallback((code) => {
    setOutput("") 
    setRunning(true) 
    setAwaitingInput(false) 
    socketRef.current?.emit("run-code", { code }) 
  }, []) 

  const sendInput = useCallback((input) => {
    socketRef.current?.emit("stdin", input) 
    setAwaitingInput(false) 
  }, []) 

  return { runCode, sendInput, output, running, awaitingInput } 
}