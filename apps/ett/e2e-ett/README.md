# Project targets

## Run end-to-end tests once in Cypress app with remote backend (feature environment)

nx run e2e-ett:e2e

## Run end-to-end tests once in Cypress app with stubbed backend (`/api`)

nx run e2e-ett:e2e:production

## Open end-to-end tests in Cypress app with remote backend (feature environment)

nx run e2e-ett:e2e:watch

## Open end-to-end tests in Cypress app with stubbed backend (`/api`)

nx run e2e-ett:e2e:watch-production

## Run end-to-end tests headless once with remote backend (feature environment)

nx run e2e-ett:e2e:ci

## Run end-to-end tests headless once with stubbed backend (`/api`)

nx run e2e-ett:e2e:ci-production
