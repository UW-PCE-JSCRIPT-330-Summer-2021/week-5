const jwt = require('jsonwebtoken')

const SECRET_TOKEN = "x1x;U0K6R[J^(L&u'Hatu{8%Y<,Voj_2\Q!]dLe(Vu^K+.\Yx`g8q?f'%$CI#&Kccy;bJ~}~>pK@UCzR{>Eo2*-ax&T^(jKDH$nY3FK$*.&TJ#rJ9~owMFc;2;uaR["

async function isAuthorized (req, res, next) {
    const authHeader = req.headers.authorization
    if (!authHeader || authHeader.length < 1) {
        res.sendStatus(401)
        return
    }
    try {
        tokenFromClient = authHeader.replace('Bearer ', '')
        const token = jwt.verify(tokenFromClient, SECRET_TOKEN)
        
        req.user = token

        if (!req.user || !req.user._id) {
            throw new Error("Cannot find token from provided token string")
        }
        next()
    }
    catch (e) {
        res.status(401).send(e.message)
        return
    }
}

async function isAdmin (req, res, next) {
    if (req.user.roles.includes("admin")) {
        req.user.isAdmin = true
    }
    next()
}

module.exports = { SECRET_TOKEN, isAuthorized, isAdmin }
