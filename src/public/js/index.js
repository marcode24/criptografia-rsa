const d = document;

const $form = d.getElementById('form');

const showMessages = ({ parent, message, className }) => {
  const messageEl = `<span class="message ${className}">${message}</span>`;
  parent.insertAdjacentHTML('afterend', messageEl);
};

const clearMessages = () => {
  const errors = d.querySelectorAll('.message');
  errors && errors.forEach((el) => el.remove());
};

$form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearMessages();
  const user = $form.user.value;
  const password = $form.password.value;

  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `user=${user}&password=${password}`,
  });
  const { status } = await response.json();

  if (status !== 200) {
    showMessages({
      parent: $form.password,
      message: 'Usuario y/o contraseña incorrectos',
      className: 'error',
    });
    return;
  }
  window.location.href = '/rsa';
});

