const express = require("express")
const { createProject, getProjectById, updateProject, deleteProject, getMyProjects, addViewer, addCollaborator, removeViewer, deleteViewer, deleteCollaborator } = require("../controllers/project.controller")
const auth = require("../middlewares/auth.middleware")

const router = express.Router()

router.use(auth)

// CRUD
router.post("/", createProject)
router.get("/", getMyProjects)
router.get("/:id", getProjectById)
router.put("/:id", updateProject)
router.delete("/:id", deleteProject)

// PROJECT MEMBERS
router.post("/:id/collaborators", addCollaborator)
router.delete("/:id/collaborators", deleteCollaborator)

router.post("/:id/viewers", addViewer)
router.delete("/:id/viewers", deleteViewer)

module.exports = router