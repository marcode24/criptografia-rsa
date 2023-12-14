import app from './app.js';
import configEnv from './config/env.js';

const { PORT } = configEnv;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is listening on port ${PORT}`);
});
