import jwt from 'jsonwebtoken';
import configEnv from '../config/env.js';

const { JWT_SECRET } = configEnv;

const generateJWT = (user) => new Promise((resolve, reject) => {
  jwt.sign({ user }, JWT_SECRET, { expiresIn: '4h' }, (err, token) => {
    err ? reject(new Error('Error generating JWT')) : resolve(token);
  });
});

export default generateJWT;
