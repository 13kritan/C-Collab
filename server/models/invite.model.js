const mongoose = require('mongoose')

const inviteSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  code: { type: String, required: true, unique: true },
  role: { type: String, enum: ['collaborators', 'viewers'], required: true },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 600 
  }
})

module.exports = mongoose.model('Invite', inviteSchema)