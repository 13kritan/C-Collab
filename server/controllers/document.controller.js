const Document = require("../models/document.model")
const AuditLog = require("../models/audit.model")
const Project = require("../models/project.model")

// CREATE DOCUMENT
module.exports.createDocument = async (req, res) => {
    try {
        const { name, language, content } = req.body
        const projectId = req.params.projectId
        const project = await Project.findById(projectId)
        if (!project)
            return res.status(404).json({ message: "Project not found" })

        const canEdit = project.owner.toString() === req.userId || project.collaborators.some((id) => id.toString() === req.userId)
        if (!canEdit)
            return res.status(403).json({ message: "Access denied" })

        const checkDoc = await Document.findOne({
            name,
            project: projectId
        })
        if (checkDoc)
            return res.status(403).json({ message: "Document exists." })

        const doc = await Document.create({
            name,
            content: content,
            language: language || "C",
            project: projectId,
            createdBy: req.userId
        })

        // 🧾 AUDIT LOG
        await AuditLog.create({
            project: project._id,
            document: doc._id,
            action: "Created Document",
            performedBy: req.userId,
            details: "Document created"
        })

        res.status(201).json({ message: "Document Created.", document: doc });

    } catch (error) {
        console.error("Document Creation Error!", error)
        res.status(500).json({ message: "Server Error!" })
    }
}

// GET ALL DOCUMENTS
module.exports.getAllDocuments = async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId)

        if (!project)
            return res.status(404).json({ message: "Project not found" })

        const userId = req.userId

        const canView = project.owner.toString() === userId || project.collaborators.includes(userId) || project.viewers.includes(userId)

        if (!canView)
            return res.status(403).json({ message: "Access denied" })

        const docs = await Document.find({ project: project._id })
        res.json(docs)

    } catch (error) {
        console.error("Fetch Documents Error!", error)
        res.status(500).json({ message: "Server Error!" })
    }
}

// GET DOCUMENT BY ID
module.exports.getDocumentById = async (req, res) => {
    try {
        const doc = await Document.findById(req.params.id)
        if (!doc)
            return res.status(404).json({ message: "Document not found" })

        const project = await Project.findById(doc.project)
        const userId = req.userId

        const isOwner = project.owner.toString() === userId
        const isCollaborator = project.collaborators.includes(userId)
        const isViewer = project.viewers.includes(userId)

        if (!isOwner && !isCollaborator && !isViewer)
            return res.status(403).json({ message: "Access denied" });

        res.json({
            document: doc,
            permissions: {
                canEdit: isOwner || isCollaborator,
                canView: true
            }
        });

    } catch (error) {
        console.error("Fetch Document Error!", error)
        res.status(500).json({ message: "Server Error!" })
    }
}

// UPDATE DOCUMENT (owner + collaborator)
module.exports.updateDocument = async (req, res) => {
    try {
        const { name, content } = req.body
        const io = req.app.get("io")

        const doc = await Document.findById(req.params.id)
        if (!doc)
            return res.status(404).json({ message: "Document not found" })

        const project = await Project.findById(doc.project)

        const canEdit = project.owner.toString() === req.userId || project.collaborators.includes(req.userId)

        if (!canEdit)
            return res.status(403).json({ message: "Access denied" })

        doc.name = name || doc.name
        doc.content = content ?? doc.content

        await doc.save()

        // 🧾 AUDIT LOG
        await AuditLog.create({
            project: project._id,
            document: doc._id,
            action: "Updated Document",
            performedBy: req.userId,
            details: "Document updated"
        })

        io.to(req.params.id).emit("document-update", doc.content)
        res.json({ message: "Document updated", document: doc })

    } catch (error) {
        console.error("Update Document Error!", error)
        res.status(500).json({ message: "Server Error!" })
    }
}

// DELETE DOCUMENT (owner only)
module.exports.deleteDocument = async (req, res) => {
    try {
        const doc = await Document.findById(req.params.id)
        if (!doc)
            return res.status(404).json({ message: "Document not found" })

        const project = await Project.findById(doc.project)

        if (project.owner.toString() !== req.userId)
            return res.status(403).json({ message: "Only owner can delete document" })

        await doc.deleteOne()

        // 🧾 AUDIT LOG
        await AuditLog.create({
            project: project._id,
            document: doc._id,
            action: "Delete Document",
            performedBy: req.userId,
            details: "Document deleted"
        })

        res.json({ message: "Document Deleted." })

    } catch (error) {
        console.error("Delete Document Error!", error)
        res.status(500).json({ message: "Server Error!" })
    }
}

