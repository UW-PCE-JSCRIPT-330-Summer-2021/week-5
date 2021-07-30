const { Router } = require("express")
const router = Router()
const bcrypt = require("bcrypt")
const { isAuthorized, SECRET_TOKEN } = require('../middleware/auth')
const { handleErrors } = require('../middleware/errorhandler')
const userDAO = require('../daos/user')
const jwt = require('jsonwebtoken')

router.post("/signup", async (req, res, next) => {
    const { email, password } = req.body
    if (!email || email.length === 0) {
        res.status(400).send("No email provided")
        return
    }
    if (!password || password.length === 0) {
        res.status(400).send("No password provided")
        return
    }
    try {
        const encryptedPw = await bcrypt.hash(password, 10)
        const createdUser = await userDAO.createUser({email, password: encryptedPw})
        res.status(200).send(createdUser)
    }
    catch(e) {
        if (e.message.includes("validation")) {
            e.statusCode = 400
            e.message = "User info was invalid"
        } else if (e.message.includes("duplicate")) {
            e.statusCode = 409
        } 
        next(e)
    }
})

router.post("/", async (req, res, next) => {
    try {
        const { email, password } = req.body
        
        if (!email) {
            res.status(400).send("No email provided")
            return
        }
        if (!password) {
            res.status(400).send("No password provided")
            return
        }
        const foundUser = await userDAO.getUser(email)
        if (!foundUser || foundUser.length === 0) {
            res.sendStatus(401)
            return
        }

        bcrypt.compare(password, foundUser.password, async function(bcryptErr, bcryptRes) {
            if (bcryptErr) {
                res.sendStatus(401)
            }
            if (bcryptRes) {
                jwt.sign({
                    email: foundUser.email,
                    roles: foundUser.roles,
                    _id: foundUser._id
                }, SECRET_TOKEN, (err, token) => {
                    res.json({token})
                });
            }
            else {
                res.sendStatus(401)
            }
        })
    }
    catch(e) {
        next(e)
    }
})

router.post("/logout", async (req, res, next) => {
    res.sendStatus(404);
})

router.use(isAuthorized);

router.post("/password", async (req, res, next) => {
    try {
        const password = req.body.password
        if (!password || password.length < 1) {
            res.status(400).send("No password provided")
            return
        }
        const encryptedPw = await bcrypt.hash(password, 10)
        await userDAO.updateUserPassword(req.user._id, encryptedPw)
        res.sendStatus(200)
    }
    catch (e) {
        next(e)
    }
})

router.use(handleErrors)

module.exports = router
