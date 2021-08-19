const uuid = require("uuid");
const jwt = require("jsonwebtoken")
const Token = require("../models/token");
const SECRET = "hiuoideup"; 


module.exports = {};

module.exports.getUserIdFromToken = async (tokenString) => {
    const token = await Token.findOne({ token: tokenString }).lean();
    return token.userId;
};

module.exports.removeToken = async (tokenString) => {
    const removed = await Token.deleteOne({ token: tokenString });
    return removed;
};

module.exports.getTokenForUserId = async (userId) => {
    const token = uuid.v4();
    const created = await Token.create({ userId, token });
    return created;
};

module.exports.getJwtForUser = async (user) => {
    const data = {_id: user._id, email: user.email, roles: user.roles};
    const token = await jwt.sign(data, SECRET); 
    return token;
}

module.exports.getUserFromJwt = async (token) => {
    const user = await jwt.verify(token, SECRET); 
    return user;
}
