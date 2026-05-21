const express = require("express")

const {loginUser, registerUser, editUser, fetchUser} = require("../controllers/auth.controller")

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/editProfile/:userId", editUser)
router.get("/user/:email", fetchUser)

module.exports = router