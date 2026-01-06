const Project = require("../models/project.model");

// CREATE PROJECT
module.exports.createProject = async (req, res) => {
    try {
        const { name, description } = req.body

        const project = await Project.create({
            name,
            description,
            owner: req.userId
        })

        res.status(201).json({ message: "Project Created.", project: project })

    } catch (err) {
        console.error("Create Project Error.", err)
        res.status(500).json({ message: "Server error" })
    }
}

//   GET MY PROJECTS
module.exports.getMyProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            $or: [
                { owner: req.userId },
                { collaborators: req.userId },
                { viewers: req.userId }
            ]
        }).sort({ updatedAt: -1 })

        res.json({ message: "My Projects Fetched.", projects: projects })

    } catch (err) {
        console.error("Fetch My Projects Error.", err)
        res.status(500).json({ message: "Server error" })
    }
}

// GET PROJECT BY ID
module.exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate("owner", "username email")
            .populate("collaborators", "username email")
            .populate("viewers", "username email")

        if (!project)
            return res.status(404).json({ message: "Project not found" })

        const userId = req.userId

        const isOwner = project.owner._id.toString() === userId
        const isCollaborator = project.collaborators.some(u => u._id.toString() === userId)
        const isViewer = project.viewers.some(u => u._id.toString() === userId)

        if (!isOwner && !isCollaborator && !isViewer)
            return res.status(403).json({ message: "Access denied" })

        res.json({
            project,
            permissions: {
                canEdit: isOwner || isCollaborator,
                isOwner
            }
        })

    } catch (err) {
        console.error("Get Projects Error", err)
        res.status(500).json({ message: "Server error" })
    }
}

// UPDATE PROJECT (owner only)
module.exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)

        if (!project)
            return res.status(404).json({ message: "Project not found" })

        if (project.owner.toString() !== req.userId)
            return res.status(403).json({ message: "Only owner can update project" })

        project.name = req.body.name || project.name
        project.description = req.body.description || project.description

        await project.save()
        res.json(project)

    } catch (err) {
        console.error("Update Project Error.", err)
        res.status(500).json({ message: "Server error" })
    }
}

// DELETE PROJECT (owner only)
module.exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)

        if (!project)
            return res.status(404).json({ message: "Project not found" })

        if (project.owner.toString() !== req.userId)
            return res.status(403).json({ message: "Only owner can delete project" })

        await project.deleteOne();
        res.json({ message: "Project deleted" })
    } catch (err) {
        console.error("Project Delete Error.", err)
        res.status(500).json({ message: "Server error" });
    }
}

// ADD COLLABORATOR (owner only)
module.exports.addCollaborator = async (req, res) => {
    try {
        const { userId } = req.body
        const project = await Project.findById(req.params.id)

        if (!project)
            return res.status(404).json({ message: "Project not found" })

        if (project.owner.toString() !== req.userId)
            return res.status(403).json({ message: "Only owner can add collaborators" })

        if (!project.collaborators.includes(userId))
            project.collaborators.push(userId)

        await project.save()
        res.json(project)

    } catch (err) {
        console.error("Add Collaborator Error.", err)
        res.status(500).json({ message: "Server error" })
    }
}

// DELETE COLLABORATOR (owner only)
module.exports.deleteCollaborator = async (req, res) => {
    try {
        const { userId } = req.body
        const project = await Project.findById(req.params.id)

        if (!project)
            return res.status(404).json({ message: "Project not found" })

        if (project.owner.toString() !== req.userId)
            return res.status(403).json({ message: "Only owner can delete collaborators" })

        // Cannot remove owner
        if (userId === project.owner.toString())
            return res.status(400).json({ message: "Owner cannot be removed" });

        project.collaborators = project.collaborators.filter(
            id => id.toString() !== userId
        )

        await project.save()
        res.json({message: "Collaborator Removed."})

    } catch (err) {
        console.error("Delete Collaborator Error.", err)
        res.status(500).json({ message: "Server error" })
    }
}

//   ADD VIEWER (owner + collaborator)
exports.addViewer = async (req, res) => {
    try {
        const { userId } = req.body
        const project = await Project.findById(req.params.id)

        if (!project)
            return res.status(404).json({ message: "Project not found" })

        const canAdd = project.owner.toString() === req.userId || project.collaborators.includes(req.userId)

        if (!canAdd)
            return res.status(403).json({ message: "Allowed By Owner and Collaborator" })

        if (!project.viewers.includes(userId))
            project.viewers.push(userId)

        await project.save()
        res.json(project)

    } catch (err) {
        console.error("Add Viewer Error.", err)
        res.status(500).json({ message: "Server error" })
    }
}

// REMOVE VIEWER (owner + collaborator)
exports.deleteViewer = async (req, res) => {
    try {
      const { userId } = req.body; 
      const project = await Project.findById(req.params.id)
  
      if (!project)
        return res.status(404).json({ message: "Project not found" })
  
      const isOwner = project.owner.toString() === req.userId
      const isCollaborator = project.collaborators.includes(req.userId)
  
      if (!isOwner && !isCollaborator)
        return res.status(403).json({ message: "Access denied" })
  
      project.viewers = project.viewers.filter(
        id => id.toString() !== userId
      )
  
      await project.save()
  
      res.json({
        message: "Viewer removed successfully",
        project
      })
    } catch (err) {
      console.error("REMOVE VIEWER ERROR:", err)
      res.status(500).json({ message: "Server error" })
    }
  }
