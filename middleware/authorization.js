const jwt = require('jsonwebtoken')
//secretkey for jwt
const SECRETKEY = "redrover123";

//middleware that checks authorization of users
//allows us to identify the user making a request
//we are able to find out who they are: name, email, etc.
const isAuthorized = async (req, res, next) => {
    //token is given the credentials that authenticates the user
    const token = req.headers.authorization;
    if (token) {
        //split the credentials
        const tokenString = token.split(' ')[1];
        try {
            //verify a token symmetric
            //returns the payload decoded if the signature is valid
            const user = jwt.verify(tokenString, SECRETKEY);
            //verifies the user that makes the request
            if (user) {
                //request of userInfo matches the user, giving them authorization
                req.userInfo = user;
                next();
            }
            else {
                //should send 401
                res.sendStatus(401);
            }
        }
        catch (e) {
            //should send 401
            res.sendStatus(401);
        }
    }
    else {
        //should send 401
        res.sendStatus(401);
    }
};

//middleware that checks admin status of a user
const isAdmin = async (req, res, next) => {
    //a request made by a user have admin roles if their userInfo role includes admin in it
    req.isAdmin = req.userInfo.roles.includes("admin");
    next();
};

module.exports = { isAuthorized, isAdmin };