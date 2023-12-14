import fs from 'fs';
import { response } from 'express';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';

import { encryptData, decryptData } from '../utils/rsa.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const encrypt = (req, res = response) => {
  try {
    const { file } = req;
    const encryptedResults = encryptData(file.buffer.toString('utf-8'));
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

const decrypt = (req, res) => {
  try {
    const { file } = req;
    const decryptedResult = decryptData(file.buffer);
    res.json({ result: decryptedResult, status: 200 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error durante el descifrado:', error);
    res.status(500).send('Error durante el descifrado');
  }
};

export { encrypt, decrypt };
