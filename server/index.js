const express = require("express")
const cors  = require("cors")
const dotenv = require("dotenv")

const connectDB = require("./config/connectDB")
const corsOptions = require("./config/cors")

const authRoutes = require("./routes/auth.routes")

dotenv.config()

const app = express()

// CORS and EXPRESS setup
app.use(cors(corsOptions))
app.use(express.json())

// Server Start Message
app.get("/", (req, res) => {
    res.status(200).json({
        status: "OK",
        service: "C-Collab Server Running..."
    })
})

// API ROUTES
app.use("/api/auth", authRoutes)


// SERVER STARTUP
const PORT = process.env.PORT || 5000
const startServer =async() => {
    try {
        await connectDB()
        app.listen(PORT, () => 
            console.log(`✅ Server Connection Successfull on PORT: ${PORT}`)
        )
    } catch (error) {
        console.error("❌ Server Connection Failed! ", error.message)
        process.exit(1)
    }
}
startServer()