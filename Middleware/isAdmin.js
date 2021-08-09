
const userDAO = require('../daos/user');
const user = require("../models/user");

module.exports = async (req, res, next) => {
    try {
        console.log("ISADMIN ---> START");
        if (!req.tokenIsValid) { 
            throw new Error('Token is Invalid');
        }
        // req.user = await userDAO.getByIdAndEmail(req.payload._id);
        if (req.user.roles) {
            //TODO: see if is an admin
            const result = req.user.roles.find(role => role === "admin") 
            req.isAdmin = (result == "admin");
        }
        next();
    } catch (e) {
        next(e);
    }
 };
