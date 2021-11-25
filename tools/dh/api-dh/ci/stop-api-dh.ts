import { killPortProcess } from 'kill-port-process';

import { apiDhPort } from './api-dh-port';

async function stopApiDh() {
  await killPortProcess(apiDhPort);
}

stopApiDh().then(
  () => {
    console.log('api-dh stopped');

    process.exit(0);
  },
  error => {
    console.error(error);

    process.exit(1)
  });
