import app from './server/server';
import config from './config/config';

app.listen(config.port, () => {
  console.info(`Server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
});
