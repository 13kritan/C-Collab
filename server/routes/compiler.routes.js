const express = require("express")
const { runCCode } = require("../controllers/compiler.controller")
const auth = require("../middlewares/auth.middleware")

const router = express.Router()

router.use(auth)

// Compile
router.post("/c", runCCode)

module.exports = router