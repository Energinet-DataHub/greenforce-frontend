# Project targets

`e2e` target configurations using a `development` application configuration will
load the `eo-api-environment.local.json` configuration file which can be
configured to target a feature environment.

`e2e` target configurations using a `production` application configuration will
load the `eo-api-environment.json` configuration file which targets local/same
environment `/api` endpoints which we stub using Cypress interceptors for now.

## Run end-to-end tests once in Cypress app with remote backend (feature environment)

nx run e2e-eo:e2e

## Run end-to-end tests once in Cypress app with stubbed backend (`/api`)

nx run e2e-eo:e2e:production

## Open end-to-end tests in Cypress app with remote backend (feature environment)

nx run e2e-eo:e2e:watch

## Open end-to-end tests in Cypress app with stubbed backend (`/api`)

nx run e2e-eo:e2e:watch-production

## Run end-to-end tests headless once with remote backend (feature environment)

nx run e2e-eo:e2e:ci-development

## Run end-to-end tests headless once with stubbed backend (`/api`)

nx run e2e-eo:e2e:ci
