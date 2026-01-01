const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to MongoDB Successfully!")
    } catch (error) {
        console.error("MongoDB connection Failed: ", error.message)
    }
}

module.exports = connectDB