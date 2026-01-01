const express = require("express")
const { createDocument, getAllMyDocument, getDocumentById, updateDocument, deleteDocument } = require("../controllers/document.controller")
const auth = require("../middlewares/auth.middleware")

const router = express.Router()

router.use(auth)

router.post("/", createDocument)
router.get("/mydocuments", getAllMyDocument)
router.get("/:id", getDocumentById)
router.put("/:id", updateDocument)
router.delete("/:id", deleteDocument)

module.exports = router