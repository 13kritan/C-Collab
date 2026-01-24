const { Server } = require("socket.io")
const jwt = require("jsonwebtoken")

const Project = require("./models/project.model")
const Document = require("./models/document.model")

const compilerSocket = require("./socket/compiler.socket")

// documentId -> Set(userId)
const activeEditors = {}

const initSocket = (server, app) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  })

  // expose io & activeEditors
  app.set("io", io)
  app.set("activeEditors", activeEditors)

  // 🔐 SOCKET AUTH
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

  // Compiler Socket
  compilerSocket(io)

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.userId)

    // JOIN DOCUMENT
    socket.on("join-document", async ({ documentId }) => {
      const doc = await Document.findById(documentId)
      if (!doc) return socket.emit("error", "Document not found")

      const project = await Project.findById(doc.project)

      const canView =
        project.owner.toString() === socket.userId ||
        project.collaborators.includes(socket.userId) ||
        project.viewers.includes(socket.userId)

      if (!canView) return socket.emit("error", "Access denied")

      socket.join(documentId)

      if (!activeEditors[documentId])
        activeEditors[documentId] = new Set()

      activeEditors[documentId].add(socket.userId)

      socket.to(documentId).emit("user-joined", socket.userId)
    })

    // LEAVE DOCUMENT
    socket.on("leave-document", ({ documentId }) => {
      socket.leave(documentId)
      activeEditors[documentId]?.delete(socket.userId)

      if (activeEditors[documentId]?.size === 0)
        delete activeEditors[documentId]

      socket.to(documentId).emit("user-left", socket.userId)
    })

    // REAL-TIME EDIT
    socket.on("document-change", async ({ documentId, content }) => {
      const doc = await Document.findById(documentId)
      if (!doc) return

      const project = await Project.findById(doc.project)

      const canEdit =
        project.owner.toString() === socket.userId ||
        project.collaborators.includes(socket.userId)

      if (!canEdit) return

      doc.content = content
      await doc.save()

      socket.to(documentId).emit("document-update", content)
    })

    socket.on("disconnect", () => {
      for (const docId in activeEditors) {
        activeEditors[docId].delete(socket.userId)
        if (activeEditors[docId].size === 0)
          delete activeEditors[docId]
      }
      console.log("Socket disconnected:", socket.userId)
    })
  })
}

module.exports = { initSocket }