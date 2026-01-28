const Invite = require('../models/invite.model')
const Project = require('../models/project.model')

// GENERATE A DYNAMIC CODE
module.exports.inviteUser = async (req, res) => {
    try {
        const { projectId } = req.params
        const { role } = req.body // Must be "collaborators" or "viewers" 
        console.log(projectId, role)

        // 1. Generate a clean 6-digit alphanumeric code
        const code = Math.random().toString(36).substring(2, 8).toUpperCase()

        // 2. Create invite with 10-minute TTL (handled by Invite Schema)
        const invite = await Invite.create({
            projectId,
            code,
            role
        })

        res.status(201).json({
            code: invite.code,
            role: invite.role,
            expiresAt: new Date(Date.now() + 10 * 60000)
        })
    } catch (err) {
        res.status(500).json({ error: "Failed to generate invite" })
    }
}

// JOIN PROJECT VIA CODE
module.exports.joinProject = async (req, res) => {
    try {
        const { code, userId } = req.body
        // 1. Check if invite exists and hasn't expired
        const invite = await Invite.findOne({ code: code })
        console.log(invite)
        if (!invite) {
            return res.status(404).json({ error: "Code invalid or expired." })
        }

        const updatedProject = await Project.findByIdAndUpdate(
            invite.projectId,
            { $addToSet: { [invite.role]: userId } },
            { new: true }
        )

        if (!updatedProject) {
            return res.status(404).json({ error: "Project no longer exists." });
        }

        // 3. Delete invite so it can't be reused (Optional: One-time use)
        await invite.deleteOne()

        res.status(200).json({
            message: `Joined successfully as ${invite.role}`,
            projectId: updatedProject._id
        })
    } catch (err) {
        res.status(500).json({ error: "Join failed" })
    }
}
