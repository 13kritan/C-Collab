const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/user.model")

// REGISTER USER
module.exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password)
            return res.status(500).json({ message: "All fields required!" })

        const existingUser = await User.findOne({ email })
        if (existingUser)
            return res.status(409).json({ message: "User Already Exists" })

        const hashedPassword = await bcrypt.hash(password, 12)

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })
        res.status(201).json({ message: "User Created Successfully!", userId: user._id })
    } catch (error) {
        console.error("Register Error! :", error)
        res.status(500).json({ message: "Server Error! " })
    }
}

// LOGIN USER
module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password)
            return res.status(400).json({ message: "All fields are required!" })

        const user = User.findOne({ email })
        if (!user)
            return res.status(401).json({ message: "Invalid Credentials!" })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch)
            return res.status(401).json({ message: "Invalid Credentials!" })

        const token = jwt.sign(
            { userId: user._id, },
            process.env.JWT_SECRET,
            {expiresIn: "5d"}
        )

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        console.error("Login Error! : ", error)
        res.status(500).json({message: "Server Error!"})
    }
}