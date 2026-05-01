const { Server } = require("socket.io")
const jwt = require("jsonwebtoken")
const Project = require("./models/project.model")
const Document = require("./models/document.model")
const compilerSocket = require("./socket/compiler.socket")

const activeEditors = {}

const initSocket = (server, app) => {
  const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
  })

  app.set("io", io)
  app.set("activeEditors", activeEditors)

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token
    if (!token) return next(new Error("Unauthorized"))
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      socket.userId = decoded.userId
      next()
    } catch {
      next(new Error("Unauthorized"))
    }
  })

  compilerSocket(io)

  io.on("connection", (socket) => {
    // 1. JOIN DOCUMENT
    socket.on("join-document", async (documentId) => { // Fixed: destructured vs direct id
      const doc = await Document.findById(documentId)
      if (!doc) return socket.emit("error", "Document not found")

      const project = await Project.findById(doc.project)
      const canView =
        project.owner.toString() === socket.userId ||
        project.collaborators.includes(socket.userId) ||
        project.viewers.includes(socket.userId)

      if (!canView) return socket.emit("error", "Access denied")

      socket.join(documentId)
      
      if (!activeEditors[documentId]) activeEditors[documentId] = new Set()
      activeEditors[documentId].add(socket.userId)

      // Notify the local user they succeeded
      socket.emit("joined-document", { documentId })
      
      // Notify everyone else in the room (for the Audit Log)
      socket.to(documentId).emit("user-joined", socket.userId)
    })

    // 2. REAL-TIME EDIT
    socket.on("document-change", async ({ documentId, content }) => {
      // Broadcast content immediately for UI responsiveness (Optimistic)
      socket.to(documentId).emit("document-update", content)
      
      // Broadcast audit event for the Log box
      socket.to(documentId).emit("document-change-audit", {
        user: socket.userId.slice(0,6)
      })

      // Background Save (Throttle this in production for performance)
      try {
        await Document.findByIdAndUpdate(documentId, { content })
      } catch (err) {
        console.error("FS_ERR: DB_WRITE_FAILED", err)
      }
    })

    // 3. LEAVE & DISCONNECT
    const handleLeave = (documentId) => {
      socket.leave(documentId)
      if (activeEditors[documentId]) {
        activeEditors[documentId].delete(socket.userId)
        if (activeEditors[documentId].size === 0) delete activeEditors[documentId]
      }
      socket.to(documentId).emit("user-left", socket.userId)
    }

    socket.on("leave-document", ({ documentId }) => handleLeave(documentId))

    socket.on("disconnect", () => {
      for (const docId in activeEditors) {
        if (activeEditors[docId].has(socket.userId)) {
          handleLeave(docId)
        }
      }
    })
  })
}

module.exports = { initSocket }