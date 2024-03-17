function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401) // if there isn't any token

    if (token !== '2024-token-string') return res.sendStatus(403)

    next() // pass the execution off to whatever request the client intended
}

export default authenticateToken;