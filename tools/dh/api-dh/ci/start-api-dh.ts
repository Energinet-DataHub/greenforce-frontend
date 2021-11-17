import { setup as setupDevServer } from 'jest-dev-server';

async function startApiDh() {
  await setupDevServer({
    command: 'nx serve api-dh',
    debug: true,
    launchTimeout: 15000,
    port: 5001,
    path: 'v1/WeatherForecast',
    protocol: 'https',
    usedPortAction: 'error',
  });
}

startApiDh().then(
    () => {
      console.log('api-dh started');

      process.exit(0);
    },
    error => {
      console.error(error);

      process.exit(1)
    });
