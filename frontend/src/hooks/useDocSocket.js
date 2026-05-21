import { useEffect, useState, useRef } from "react" 
import { io } from "socket.io-client" 

export const useDocumentAudit = ({ documentId }) => {
  const [auditLog, setAuditLog] = useState([]) 
  const socketRef = useRef(null) 

  //  push logs
  const pushLog = (type, message) => {
    setAuditLog((prev) => [
      {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        type,
        message: message.toUpperCase().replace(/\s/g, '_'),
      },
      ...prev.slice(0, 49), // Keep last 50 entries
    ]) 
  } 

  useEffect(() => {
    if (!documentId) return 

    // 1. Initialize Socket
    socketRef.current = io("http://localhost:5000", {
      auth: { token: localStorage.getItem("token") }
    }) 

    const socket = socketRef.current 

    // 2. Emit Join (Matches backend: socket.on("join-document", async (documentId)))
    socket.emit("join-document", documentId) 

    // --- LISTENERS ---

    // Triggered by backend: socket.emit("joined-document")
    socket.on("joined-document", () => {
      pushLog("SYSTEM", "LOCAL_CLIENT: ATTACHED_TO_ROOM") 
    }) 

    // Triggered by backend: socket.to(documentId).emit("user-joined", socket.userId)
    socket.on("user-joined", (userId) => {
      pushLog("JOIN", `REMOTE_PEER: ${userId.slice(0, 6)}__CONNECTED`) 
    }) 

    // Triggered by backend: socket.to(documentId).emit("user-left", socket.userId)
    socket.on("user-left", (userId) => {
      pushLog("LEAVE", `REMOTE_PEER: ${userId.slice(0, 6)}__DISCONNECTED`) 
    }) 

    // Triggered by backend: socket.to(documentId).emit("document-update", content)
    socket.on("document-update", () => {
      pushLog("EDIT", "FS_EVENT: BUFFER_SYNCED") 
    }) 

    // Handle connection errors
    socket.on("error", (err) => {
      pushLog("SIGERR", `CRITICAL: ${err}`) 
    }) 

    // --- CLEANUP ---
    return () => {
      socket.emit("leave-document", { documentId }) 
      socket.off("joined-document") 
      socket.off("user-joined") 
      socket.off("user-left") 
      socket.off("document-update") 
      socket.off("error") 
      socket.disconnect() 
    } 
  }, [documentId]) 

  return {
    auditLog,
    clearAudit: () => setAuditLog([]),
    // Export socket to emit changes
    socket: socketRef.current 
  } 
} 