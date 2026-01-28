const express = require("express")
const { inviteUser, joinProject } = require("../controllers/invite.controller")
const auth = require("../middlewares/auth.middleware")

const router = express.Router()

router.use(auth)

router.post("/:projectId/inviteUser", inviteUser)
router.post("/joinProject", joinProject )

module.exports = router