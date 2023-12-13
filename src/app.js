import express from 'express';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import authRouter from './routes/auth.js';
import rsaRouter from './routes/rsa.js';

import validateJWT from './middlewares/jwt.js';
import { generateKeyPair } from './utils/rsa.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

generateKeyPair();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.use('/auth', authRouter);
app.use('/rsa', rsaRouter);

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/pages/index.html`);
});

app.get('/rsa', validateJWT, (req, res) => {
  res.sendFile(`${__dirname}/public/pages/rsa.html`);
});

export default app;
