import fs from 'fs';
import { response } from 'express';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';

import { encryptData } from '../utils/rsa.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const encrypt = (req, res = response) => {
  try {
    const { file } = req;

    const publicPEM = fs.readFileSync('public_key.pem', 'utf-8');
    const encryptedResults = encryptData(file.buffer.toString('utf-8'), publicPEM);
    const combinedBuffer = Buffer.concat(encryptedResults);
    const srcDir = resolve(__dirname, '..');
    const time = new Date().getTime();
    const absolutePath = join(srcDir, 'uploads', `${file.fieldname}_${time}.rsa`);
    fs.writeFileSync(absolutePath, combinedBuffer);

    res.download(absolutePath, {}, (err) => {
      fs.unlinkSync(absolutePath);

      if (err) {
        // eslint-disable-next-line no-console
        console.error('Error al enviar el archivo cifrado:', err);
        res.status(500).send('Error al enviar el archivo cifrado');
      }
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error durante el cifrado:', error);
    res.status(500).send('Error durante el cifrado');
  }
};

// eslint-disable-next-line no-unused-vars
const decrypt = (req, res) => {
  // eslint-disable-next-line no-console
  console.log('llego a decrypt');
};

export { encrypt, decrypt };
