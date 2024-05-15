const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = process.env;

const authenticate = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    User.findById(decoded._id).then(user => {
      if (!user) {
        throw new Error();
      }
      req.user = user;
      next();
    });
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).send({ error: 'Access denied.' });
  }
};

module.exports = { authenticate, authorizeAdmin };
