import { response } from 'express';
import generateJWT from '../utils/jwt.js';
import configEnv from '../config/env.js';

const { AUTH_USER, AUTH_PASSWORD } = configEnv;

const login = async (req, res = response) => {
  try {
    const { user, password } = req.body;
    if (user !== AUTH_USER || password !== AUTH_PASSWORD) {
      return res.status(401).json({ message: 'Invalid credentials', status: 401 });
    }
    const jwt = await generateJWT(user);
    res.cookie('token', jwt, { httpOnly: true });
    return res.json({ message: 'Login success', status: 200 });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', status: 500 });
  }
};

const logout = (req, res = response) => {
  res.json({ message: 'Logout' });
};

export { login, logout };

