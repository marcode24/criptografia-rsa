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
    throw error;
  }
};

const PRIVATE_KEY = fs.readFileSync('private_key.pem', 'utf-8');
const PUBLIC_KEY = fs.readFileSync('public_key.pem', 'utf-8');

const encryptData = (data) => {
  try {
    const MAX_SIZE = 245; // Tamaño máximo para cifrar con RSA de 4096 bits
    const encryptChunkWithRSA = (chunk) => crypto.publicEncrypt({
      key: PUBLIC_KEY,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    }, Buffer.from(chunk, 'utf-8'));

    return Array.from({ length: Math.ceil(data.length / MAX_SIZE) }, (_, i) => {
      const start = i * MAX_SIZE;
      const end = start + MAX_SIZE;
      return encryptChunkWithRSA(data.slice(start, end));
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error durante el cifrado:', error);
    throw error; // Puedes manejar el error según tus necesidades
  }
};

function decryptData(data) {
  try {
    const CHUNK_SIZE = 512;
    const chunks = [];

    for (let i = 0; i < data.length; i += CHUNK_SIZE) {
      const chunk = data.slice(i, i + CHUNK_SIZE);
      const decryptedBuffer = crypto.privateDecrypt({
        key: PRIVATE_KEY,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      }, chunk);

      chunks.push(decryptedBuffer);
    }

    return Buffer.concat(chunks).toString('utf-8');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error durante el descifrado:', error);
    throw error; // Puedes manejar el error según tus necesidades
  }
}

export {
  generateKeyPair,
  encryptData,
  decryptData,
};
