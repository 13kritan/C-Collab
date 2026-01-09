const express = require("express")
const { createDocument, getDocumentById, updateDocument, deleteDocument, getAllDocuments } = require("../controllers/document.controller")
const auth = require("../middlewares/auth.middleware")

const router = express.Router()

router.use(auth)

// CRUD
router.get("/:id", getDocumentById)
router.put("/:id", updateDocument)
router.delete("/:id", deleteDocument)
router.post("/project/:projectId", createDocument)

router.get("/:projectId/docs", getAllDocuments)

module.exports = router