const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const http = require("http")

const connectDB = require("./config/connectDB")
const corsOptions = require("./config/cors")

const authRoutes = require("./routes/auth.routes")
const documentRoutes = require("./routes/document.routes")
const projectRoutes = require("./routes/project.routes")
const compileRoutes = require("./routes/compiler.routes")
const inviteRoutes = require("./routes/invite.routes")

const { initSocket } = require("./socket")

dotenv.config()

const app = express()

app.use(cors(corsOptions))
app.use(express.json())

app.get("/", (req, res) => {
  res.json({ status: "OK", service: "C-Collab Server Running..." })
})

app.use("/api/auth", authRoutes)
app.use("/api/document", documentRoutes)
app.use("/api/project", projectRoutes)
app.use("/api/compile", compileRoutes)
app.use("/api/invite", inviteRoutes)

// ✅ SINGLE SERVER
const server = http.createServer(app)

// ✅ INIT SOCKET ON SAME SERVER
initSocket(server, app)

const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    await connectDB()
    server.listen(PORT, () => {
      console.log(`✅ HTTP + Socket running on PORT ${PORT}`)
    })
  } catch (error) {
    console.error("❌ Server failed:", error.message)
    process.exit(1)
  }
}

startServer()
