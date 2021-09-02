const jwt = require("jsonwebtoken")
const SECRET = "hiuoideup"; 


module.exports = {};

module.exports.getJwtForUser = async (user) => {
    const data = {_id: user._id, email: user.email, roles: user.roles};
    const token = await jwt.sign(data, SECRET); 
    return token;
}

module.exports.getUserFromJwt = async (token) => {
    const user = await jwt.verify(token, SECRET); 
    return user;
}
