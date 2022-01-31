import { setup as setupDevServer } from 'jest-dev-server';

import { apiDhPort } from './api-dh-port';

async function startApiDh() {
  await setupDevServer({
    command: 'npm run nx -- serve api-dh',
    debug: true,
    launchTimeout: 60000,
    port: apiDhPort,
    path: 'health',
    protocol: 'https',
    usedPortAction: 'error',
  });

  console.log('HEYO dasd-.asd.-sadælasdæadæasldaæsldsaæld')
}

startApiDh().then(
    () => {
      console.log('api-dh started');

      process.exit(0);
    },
    error => {
      console.error(error);

      process.exit(0)
    });
