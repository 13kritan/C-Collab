const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },

  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
    default: null
  },

  action: {
    type: String,
    required: true
  },

  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  details: {
    type: String,
    default: ""
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("AuditLog", auditLogSchema);
