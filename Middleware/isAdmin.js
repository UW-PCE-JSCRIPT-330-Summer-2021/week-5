
module.exports = async (req, res, next) => {
    try {
        console.log("ISADMIN ---> START");
        if (!req.tokenIsValid) { 
            throw new Error('Token is Invalid');
        }
        if (req.user.roles) {
            const result = req.user.roles.find(role => role === "admin") 
            req.isAdmin = (result == "admin");
        }
        next();
    } catch (e) {
        next(e);
    }
 };
