const d = document;

const $btnSend = d.getElementById('send');
const $chkType = d.getElementById('type-encrypt');

const $form = d.getElementById('form');

const MAX_SIZE = 1024 * 1024 * 5; // 5MB
const ALLOWED_EXTENSIONS = ['txt'];

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
};

const validate = (file) => {
  const { size, name } = file;
  const extension = name.split('.').pop();

  if (size > MAX_SIZE) {
    alert('File size limit exceeded');
    return false;
  }

  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    alert('Invalid file extension');
    return false;
  }

  return true;
};

$form.addEventListener('submit', (e) => {
  e.preventDefault();

  const file = e.target.file.files[0];

  if (!file) {
    alert('No file uploaded');
    return;
  }

  if (!validate(file)) {
    return;
  }

  const valuechkType = $chkType.checked;

  if (!valuechkType) {
    encrypt(file);
  } else {
    // eslint-disable-next-line no-console
    console.log('decrypt');
  }
});

