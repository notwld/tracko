const jwt = require('jsonwebtoken')

const authorize = (req, res, next) => {
    let token = req.session.token || req.headers['x-access-token'] || req.headers['authorization'] || req.cookies['Authorization']
    // const bearer = token.split(' ')
    // let bearerToken = bearer[1]
    // token = bearerToken
    // console.log(req.token)
    if (!token) return res.send("Access Denied")
    try {
        const verified = jwt.verify(token.split(' ')[1], process.env.SECRET_TOKEN)
        req.session.user = verified.user_id
        next()
    } catch (err) {
        res.status(400).send("Invalid Token")
    }
}

module.exports = authorize;