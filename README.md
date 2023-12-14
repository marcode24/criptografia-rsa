<div align="center">
  <h1>🔐 Criptografía - RSA</h1>

  [Demo](https://criptografia-rsa.onrender.com)

  ![Version](https://img.shields.io/github/package-json/v/marcode24/criptografia-rsa?style=popout&logo=npm)
  ![GitHub CI Workflow Status](https://img.shields.io/github/actions/workflow/status/marcode24/criptografia-rsa/linter.yml?branch=main&style=popout&logo=testcafe&label=linter)
  ![GitHub repo size](https://img.shields.io/github/repo-size/marcode24/criptografia-rsa?style=popout&logo=github&label=repo%20size)
  ![GitHub](https://img.shields.io/github/license/marcode24/criptografia-rsa?style=popout&logo=github&label=license)
  ![GitHub Repo stars](https://img.shields.io/github/stars/marcode24/criptografia-rsa?style=popout&logo=apachespark&color=yellow&logoColor=yellow)
  ![Github repo views](https://img.shields.io/github/search/marcode24/criptografia-rsa/criptografia-rsa?style=popout&logo=github&label=repo%20views)
  ![GitHub last commit](https://img.shields.io/github/last-commit/marcode24/criptografia-rsa?style=popout&logo=git&label=last%20commit)
</div>

## 📝 Requisitos

- [![Node](https://img.shields.io/badge/Node-gray?style=popout&logo=node.js)](https://nodejs.org/en/)
- [![NPM](https://img.shields.io/badge/NPM-blue?style=popout&logo=npm)](https://www.npmjs.com/)
- [![Git](https://img.shields.io/badge/Git-gray?style=popout&logo=git)](https://git-scm.com/)

Optional tools:

- [![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-blue?style=popout&logo=visual-studio-code)](https://code.visualstudio.com/)
- [![Postman](https://img.shields.io/badge/Postman-orange?style=popout&logo=postman&color=black)](https://www.postman.com/)

## 🚀 Instalación

```bash
# Clonar el repositorio
$ git clone https://github.com/marcode24/criptografia-rsa.git

# Entrar al directorio del proyecto
$ cd criptografia-rsa

# Instalar las dependencias
$ npm install

# Preparar husky
$ npm run prepare

# Iniciar el servidor de desarrollo
$ npm run start:dev
```

**Nota:** El servidor necesita un archivo `.env` con las siguientes variables de entorno:

```bash
# Puerto del servidor
PORT=3000
# AUTH_USER que se usará para autenticar al usuario
AUTH_USER=marcode24
# AUTH_PASSWORD que se usará para autenticar al usuario
AUTH_PASSWORD=123456
#JW_SECRET que se usará para firmar el token
JWT_SECRET=secret
```

**Nota:**Como buena practica se necesitaría alojarlo en algun lugar mas seguro, pero para este caso se usará un archivo `.env`

## 📚 Explicación

**El problema es el siguiente:**

Realizar una aplicación con interfaz gráfica que pida un inicio de sesión para un usuario, una
vez iniciada la sesión al usuario se le desplegará un menú de 2 opciones el cual se verá de
la siguiente manera:

1. Cifrado RSA
2. Descifrado RSA

El cifrado que se implementará en esta ocasión será el “RSA”, para obtener más información
acerca de lo que es RSA pueden visitar el siguiente link https://searchsecurity.techtarget.com/definition/RSA

Al insertar la opción 1 del menú se deberá desplegar un selector de archivos y escoger el
archivo que a continuación se adjuntará “cifrar.txt”, el cual contendrá los datos a cifrar
obtener su contenido y guardar un nuevo archivo que incluya la extensión “.rsa” con la
nueva información cifrada.

Posteriormente al seleccionar la opción 2 de nuestro menú se deberá de abrir el selector de
archivos y escoger ese mismo archivo generado en el punto 1 para descifrarlo y mostrar en
pantalla el contenido del mismo en texto claro.

Para la realización de esta práctica se deberá de elaborar un video el cual explique el
procedimiento que se está llevando a cabo durante el cifrado y descifrado del archivo en
comento, incluir en el video cómo se generó el archivo con extensión “.rsa” y su contenido,
así mismo para el archivo descifrado, se deberá de mostrar la generación de ese nuevo
documento y su contenido.

- Para la elaboración del cifrado se deberá de generar una llave pública de 4096 bit
- Para la elaboración del descifrado una llave privada de 4096 bit
- Para la elaboración de esta práctica se puede hacer uso de las librerías destinadas
para RSA
- El lenguaje de programación será el que ustedes elijan
- Entregar código fuente

## 📝 Solución

Para la solución de este problema se usó el lenguaje de programación `JavaScript` con el framework `Node.js` y las siguientes librerías:

- [![Express](https://img.shields.io/badge/Express-gray?style=popout&logo=express)](https://expressjs.com/)
- [![Dotenv](https://img.shields.io/badge/Dotenv-gray?style=popout&logo=npm)](https://www.npmjs.com/package/dotenv)
- [![Jsonwebtoken](https://img.shields.io/badge/Jsonwebtoken-gray?style=popout&logo=npm)](https://www.npmjs.com/package/jsonwebtoken)
- [![Multer](https://img.shields.io/badge/Multer-gray?style=popout&logo=npm)](https://www.npmjs.com/package/multer)

1. Para la autenticación se usó el método `Basic Auth` de `HTTP` con las variables de entorno `AUTH_USER` y `AUTH_PASSWORD` para el usuario y contraseña respectivamente. Para esto se usó la librería `Dotenv` para cargar las variables de entorno desde el archivo `.env` y la librería `Jsonwebtoken` para generar el token de autenticación. El token se genera con el método `sign` de la librería `Jsonwebtoken` y se envía en las cookies de la respuesta con el método `cookie` de la librería `Express`.

2. Para el cifrado nos enfocaremos en el archivo `src/utils/rsa.js`

```js
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

const encryptData = (data) => {
  const PUBLIC_KEY = fs.readFileSync('public_key.pem', 'utf-8');
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
  const PRIVATE_KEY = fs.readFileSync('private_key.pem', 'utf-8');
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

```

- Primeramente se genera el par de claves con el método `generateKeyPairSync` de la librería `crypto` y se guardan en los archivos `public_key.pem` y `private_key.pem` con el método `writeFileSync` de la librería `fs`. Aqui se usó el algoritmo `RSA` con una longitud de 4096 bits.

```js
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
```

- Para el cifrado se usó el método `publicEncrypt` de la librería `crypto` con el algoritmo `RSA_PKCS1_OAEP_PADDING` y el tamaño máximo de datos a cifrar es de 245 bytes. Para esto se usó el método `readFileSync` de la librería `fs` para leer el archivo `public_key.pem` y obtener la llave pública.

```js
const encryptData = (data) => {
  const PUBLIC_KEY = fs.readFileSync('public_key.pem', 'utf-8');
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
```

- Para el descifrado se usó el método `privateDecrypt` de la librería `crypto` con el algoritmo `RSA_PKCS1_OAEP_PADDING` y el tamaño máximo de datos a descifrar es de 512 bytes. Para esto se usó el método `readFileSync` de la librería `fs` para leer el archivo `private_key.pem` y obtener la llave privada.

```js
function decryptData(data) {
  const PRIVATE_KEY = fs.readFileSync('private_key.pem', 'utf-8');
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
```

3. Para el cifrado y descifrado de archivos se usó la librería `Multer` para subir los archivos al servidor y la librería `fs` para leer y escribir los archivos.
