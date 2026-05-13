const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    location:{
        type: String,
        default: "unset"
    },
    title:{
        type: String,
        default: "Developer"
    },
    description: {
        type: String,
        default: "C Coder"
    },
    social: {
        github: {
            type: String
        },
        linkedin: {
            type: String
        },
    },
    image: {
        type: String
    },
    expertise: [{
        type: String
    }],
},
    {
        timestamps: true
    })

module.exports = mongoose.model("User", userSchema)