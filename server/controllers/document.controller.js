const Document = require("../models/document.model")

// CREATE DOCUMENT
module.exports.createDocument = async (req, res) => {
    try {
        const { name, content } = req.body

        if (!name)
            return res.status(400).json({ message: "Document name is required" })

        const newDoc = Document.create({
            name,
            content: content || "C Code",
            owner: req.userId
        })
        res.status(201).json({ message: "Document created", document: newDoc })

    } catch (error) {
        console.error("Document Creation Error!", error)
        res.status(500).json({ message: "Server Error!" })
    }
}

// GET ALL DOCUMENTS
module.exports.getAllMyDocument = async (req, res) => {
    try {
        const docs = await Document.find({
            $or: [{ owner: req.userId }, { collaborators: req.userId }]
        }).sort({ updatedAt: -1 })
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
            return res.status(404).json({ message: "Document Not Found!" })

        if (doc.owner.toString() !== req.userId && !doc.collaborators.includes(req.userId))
            return res.status(403).json({ message: "Access denied" })

        res.json(doc)

    } catch (error) {
        console.error("Fetch Document Error!", error)
        res.status(500).json({ message: "Server Error!" })
    }
}

// UPDATE DOCUMENT
module.exports.updateDocument = async (req, res) => {
    try {
        const { content } = req.body

        const doc = await Document.findById(req.params.id)
        if (!doc)
            return res.status(404).json({ message: "Document not found" })

        if (doc.owner.toString() !== req.userId && !doc.collaborators.includes(req.userId))      //Update By Owner And Collaborators only
            return res.status(403).json({ message: "Access denied" })

        doc.content = content || doc.content

        await doc.save()

        res.json({ message: "Document updated", document: doc })

    } catch (error) {
        console.error("Update Document Error!", error)
        res.status(500).json({ message: "Server Error!" })
    }
}

// DELETE DOCUMENT
module.exports.deleteDocument = async (req, res) => {
    try {
        const doc = await Document.findById(req.params.id)
        if (!doc)
            return res.status(404).json({ message: "Document not found" })

        if (doc.owner.toString() !== req.userId && !doc.collaborators.includes(req.userId))      // Delete By Owner Only
            return res.status(403).json({ message: "Access denied" })

        await doc.deleteOne()    

        res.json({message: "Document Deleted."})

    } catch (error) {
        console.error("Delete Document Error!", error)
        res.status(500).json({ message: "Server Error!" })
    }
}