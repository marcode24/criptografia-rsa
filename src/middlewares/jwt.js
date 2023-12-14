import jwt from 'jsonwebtoken';
import configEnv from '../config/env.js';

const { JWT_SECRET } = configEnv;

const validateJWT = (req, res, next) => {
  const token = req.headers.cookie?.split('=')[1];

  if (!token) {
    return res.redirect('/');
  }

  try {
    const { uid } = jwt.verify(token, JWT_SECRET);
    req.uid = uid;
    return next();
  } catch (error) {
    return res.redirect('/');
  }
};

export default validateJWT;
