const tokenDAO = require('../daos/token');

module.exports.isLoggedIn = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).send('Unauthorized - Not logged in');
        } else {
            const token = authHeader.split(' ')[1];
            const user = await tokenDAO.getUserFromJwt(token);
            if (!user) {
                res.status(401).send('Unauthorized - Incorrect login info');
            } else {
                req.user = user;
                next();
            }
        }
    }
    catch (e) {
            res.status(401).send(e.message);
    }
}

module.exports.isAdmin = async (req, res, next) => {
    if (req.user.roles.includes("admin")) {
        next();
    }
    else {
        res.sendStatus(403);
    }
}
