const jwt = require('jsonwebtoken')

const authorize = (req, res, next) => {
    const token = req.session.token
    if (!token) return res.send("Access Denied")
    try {
        const verified = jwt.verify(token, process.env.SECRET_TOKEN)
        req.user = verified
        next();
    } catch (err) {
        res.status(400).send("Invalid Token")
    }
}

module.exports = authorize;