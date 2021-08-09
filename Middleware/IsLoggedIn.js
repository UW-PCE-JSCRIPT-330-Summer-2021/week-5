
const userDAO = require('../daos/user');
const user = require("../models/user");

const jwt = require('jsonwebtoken');
const secret = 'KEQZOjws7PPb2pPoFIIn';

module.exports = async (req, res, next) => {
    try {
        console.log("ISLOGGEDIN ---> START");
        const AuthHeader = req.headers.authorization;
        //console.log(`AuthHeader = ${AuthHeader}`);
        if (AuthHeader && typeof(AuthHeader !== 'undefined')){
            const auth = AuthHeader.split(' ');
            req.token = auth[1];

            const verified = jwt.verify(req.token, secret);
            if (verified){
                const decoded = jwt.decode(req.token);
                req.payload = decoded;
            }
        }
        if (req.payload) {
            req.user = await userDAO.getByIdAndEmail(req.payload._id, req.payload.email);
        }

        req.tokenIsValid = (req.token && req.user && req.payload);
        next();
    } catch (e) {
        next(e);
    }
 };
