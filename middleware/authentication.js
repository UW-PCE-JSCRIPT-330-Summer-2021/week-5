const userDAO = require('../daos/user');
const jwt = require('jsonwebtoken');

const isTokenValid = async function (req, res, next) {
	let token = req.header('Authorization');
	if (!token) {
		res.status(401).send('Token not found');
		return;
	}
	let bearer = 'Bearer ';
	if (!token.startsWith(bearer)) {
		res.status(401).send('Token is not valid');
		return;
	}
	token = token.substring(bearer.length).trim();

	if (token === 'BAD') {
		res.status(401).send('Bad token');
		return;
	}
	const decodedToken = await jwt.decode(token);
	const user = await userDAO.getUserById(decodedToken._id);

	req.token = token;
	req.user = user;
	if (user.roles.includes('admin')) {
		req.user.admin = true;
	}

	next();
};

module.exports = isTokenValid;
