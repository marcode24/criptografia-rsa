const d = document;

const $btnSend = d.getElementById('send');
const $chkType = d.getElementById('type-encrypt');
const $inputFile = d.getElementById('file');
const $btnLogout = d.getElementById('logout');

const $form = d.getElementById('form');

const MAX_SIZE = 1024 * 1024 * 5; // 5MB
const ALLOWED_EXTENSIONS_ENCRYPT = ['txt'];
const ALLOWED_EXTENSIONS_DECRYPT = ['rsa'];

$btnLogout.addEventListener('click', async () => {
  const response = await fetch('/auth/logout', {
    method: 'POST',
  });
  const json = await response.json();
  if (json.status === 200) {
    window.location.href = '/';
  }
});

const showMessages = ({ parent, message, className }) => {
  const messageEl = `<span class="message ${className}">${message}</span>`;
  parent.insertAdjacentHTML('afterend', messageEl);
};

const clearMessages = () => {
  const errors = d.querySelectorAll('.message');
  errors && errors.forEach((el) => el.remove());
};

const showLoader = () => {
  const loader = `
  <svg xmlns="http://www.w3.org/2000/svg"
    class="icon icon-tabler icon-tabler-loader"
    width="24" height="24" viewBox="0 0 24 24"
    stroke-width="2" stroke="currentColor" fill="none"
    stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 6l0 -3" />
    <path d="M16.25 7.75l2.15 -2.15" />
    <path d="M18 12l3 0" />
    <path d="M16.25 16.25l2.15 2.15" />
    <path d="M12 18l0 3" />
    <path d="M7.75 16.25l-2.15 2.15" />
    <path d="M6 12l-3 0" />
    <path d="M7.75 7.75l-2.15 -2.15" />
  </svg>`;
  $btnSend.innerHTML = loader;
  $btnSend.disabled = true;
};

const hideLoader = () => {
  $btnSend.textContent = $chkType.checked ? 'Descifrar' : 'Cifrar';
  $btnSend.disabled = false;
};

$chkType.addEventListener('change', () => {
  $btnSend.textContent = $chkType.checked ? 'Descifrar' : 'Cifrar';
  $inputFile.accept = $chkType.checked
    ? ALLOWED_EXTENSIONS_DECRYPT.map((ext) => `.${ext}`).join(', ')
    : ALLOWED_EXTENSIONS_ENCRYPT.map((ext) => `.${ext}`).join(', ');
  $inputFile.value = '';
  clearMessages();
  d.querySelector('.result') && d.querySelector('.result').remove();
});

const encrypt = async (file) => {
  showLoader();
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

  hideLoader();
};

const buildResult = (data) => {
  const result = `
    <div class="result">
      <h3>Resultado</h3>
      <textarea readonly>${data}</textarea>
    </div>
  `;
  return result;
};

const decrypt = async (file) => {
  showLoader();
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch('/rsa/decrypt', {
    method: 'POST',
    body: formData,
  });

  const { result } = await response.json();
  const message = buildResult(result);
  $form.insertAdjacentHTML('afterend', message);
  hideLoader();
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

