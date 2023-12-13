import crypto from 'crypto';
import fs from 'fs';

const generateKeyPair = () => {
  try {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    fs.writeFileSync('public_key.pem', publicKey);
    fs.writeFileSync('private_key.pem', privateKey);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error generando el par de claves:', error);
    throw error; // Puedes manejar el error según tus necesidades
  }
};

const encryptData = (data, publicKey) => {
  try {
    const buffer = Buffer.from(data, 'utf-8');
    const MAX_SIZE = 4096 / 8 - 42; // 256 bytes
    const encryptedResults = [];
    for (let i = 0; i < buffer.length; i += MAX_SIZE) {
      const chunk = buffer.subarray(i, i + MAX_SIZE);
      const encrypted = crypto.publicEncrypt(publicKey, chunk);
      encryptedResults.push(encrypted);
    }

    return encryptedResults;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error durante el cifrado:', error);
    throw error; // Puedes manejar el error según tus necesidades
  }
};

export {
  generateKeyPair,
  encryptData,
};
