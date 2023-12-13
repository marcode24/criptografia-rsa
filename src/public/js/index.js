const d = document;

const $form = d.getElementById('form');

const redirect = (code) => {
  const options = {
    200: '/rsa',
    401: '/',
    500: '/',
  };
  window.location.href = options[code] || '/';
};

$form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const user = $form.user.value;
  const password = $form.password.value;

  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `user=${user}&password=${password}`,
  });
  const json = await response.json();

  redirect(json.status);
});

