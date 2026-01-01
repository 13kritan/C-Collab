const jwt = require("jsonwebtoken")

module.exports = (req, res) => {
    const header = req.headers.authorization
    if (!header || !header.startsWith("Bearer"))
        return res.status(401).json({ message: "Unauthorized" })

    const token = header.split(" ")[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.userId
    } catch (error) {
        res.status(401).json({message: "Invalid Token!"})

    }
}