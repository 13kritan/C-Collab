const mongoose = require("mongoose")

const documentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    collaborators: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    content: {
        type: String,
        default: "C code"
    },
    language: {
        type: String,
        default: "C"
    }
},
    { timeStamps: true }
)

module.exports = mongoose.model("Document", documentSchema)