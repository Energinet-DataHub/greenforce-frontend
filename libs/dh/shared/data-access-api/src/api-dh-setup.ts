import { setup as setupDevServer } from 'jest-dev-server';

export default async function globalSetup() {
  await setupDevServer({
    command: 'nx serve api-dh',
    debug: true,
    launchTimeout: 15000,
    port: 5001,
    path: 'v1/WeatherForecast',
    protocol: 'https',
  });
}
