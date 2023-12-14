const d = document;

const $btnSend = d.getElementById('send');
const $chkType = d.getElementById('type-encrypt');
const $inputFile = d.getElementById('file');

const $form = d.getElementById('form');

const MAX_SIZE = 1024 * 1024 * 5; // 5MB
const ALLOWED_EXTENSIONS_ENCRYPT = ['txt'];
const ALLOWED_EXTENSIONS_DECRYPT = ['rsa'];

const showMessages = ({ parent, message, className }) => {
  const messageEl = `<span class="message ${className}">${message}</span>`;
  parent.insertAdjacentHTML('afterend', messageEl);
};

const clearMessages = () => {
  const errors = d.querySelectorAll('.message');
  errors && errors.forEach((el) => el.remove());
};

$chkType.addEventListener('change', () => {
  $btnSend.textContent = $chkType.checked ? 'Descifrar' : 'Cifrar';
});

const encrypt = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch('/rsa/encrypt', {
    method: 'POST',
    body: formData,
  });

  const blob = await response.blob();

  const link = d.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = 'encrypted.rsa';
  link.click();

  window.URL.revokeObjectURL(link.href);

  showMessages({
    parent: $btnSend,
    message: 'Archivo cifrado correctamente',
    className: 'success',
  });
};

const decrypt = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch('/rsa/decrypt', {
    method: 'POST',
    body: formData,
  });

  await response.json();

  showMessages({
    parent: $btnSend,
    message: 'Archivo descifrado correctamente',
    className: 'success',
  });
};

const validate = (file) => {
  const { size, name } = file;
  const extension = name.split('.').pop();
  if (size > MAX_SIZE) {
    showMessages({
      parent: $inputFile,
      message: `Tamaño máximo permitido: ${MAX_SIZE / 1024 / 1024}MB`,
      className: 'error',
    });
    return false;
  }
  if (!ALLOWED_EXTENSIONS_ENCRYPT.includes(extension)) {
    showMessages({
      parent: $inputFile,
      message: 'Solo se permiten archivos de tipo:'
        + `${ALLOWED_EXTENSIONS_ENCRYPT.join(', ')}`,
      className: 'error',
    });
    return false;
  }
  return true;
};

const validateDecrypt = (file) => {
  const { name } = file;
  const extension = name.split('.').pop();
  if (!ALLOWED_EXTENSIONS_DECRYPT.includes(extension)) {
    showMessages({
      parent: $inputFile,
      message: 'Solo se permiten archivos de tipo:'
        + `${ALLOWED_EXTENSIONS_DECRYPT.join(', ')}`,
      className: 'error',
    });
    return false;
  }
  return true;
};

$form.addEventListener('submit', (e) => {
  e.preventDefault();
  clearMessages();
  const file = e.target.file.files[0];

  if (!file) {
    showMessages({
      parent: $inputFile,
      message: 'Debe seleccionar un archivo',
      className: 'error',
    });
    return;
  }

  const valuechkType = $chkType.checked;
  if (!valuechkType) {
    validate(file) && encrypt(file);
  } else {
    validateDecrypt(file) && decrypt(file);
  }
});

