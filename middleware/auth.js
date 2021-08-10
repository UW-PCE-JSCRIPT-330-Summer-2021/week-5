const { Router } = require('express');
const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token');
const jwt = require('jsonwebtoken');
const secret = 'secret_master_keyword';

const isAuthenticated = async (req, res, next) => {
  try {
    const bearer = req.headers.authorization;

    if (bearer) {
      const token = bearer.replace('Bearer ', '');
      const user = jwt.verify(token, secret);

      if (user) {
        req.user = user;
        next();
      } else {
        throw new Error('User not logged in');
      }
    } else {
      throw new Error('Bad Token');
    }
  } catch (e) {
    next(e);
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.roles.includes('admin')) {
      next();
    } else {
      throw new Error('Access Denied');
    }
  } catch (e) {
    next(e);
  }
};

module.exports = { isAuthenticated, isAdmin };
