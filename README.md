# GreenForce

Monorepo that hosts:

- Front-end apps
- Backend-for-frontends (BFFs)
- Watt Design System
- CI/CD pipelines
- Infrastructure

## Front-end apps

The front-end apps are built with Angular in an Nx Workspace. They are located under `apps` folder:

- `dh-app` - New "DataHub" app
- `dh-app-e2e` - End-to-end tests for `dh-app`
- `ett-app` - "Energy Track and Trace" app.
- `ett-app-e2e` - End-to-end tests for `ett-app`

Besides the `apps` folder, there's also a `libs` folder that contains features used by the apps. This is where most of the code lives.

## Backend-for-frontend (BFF)

There's currenly only one BFF located in `api-dh-app` under `libs`. It is for `dh-app` and is using .NET Core 5.0.

## Watt Design System

"Watt" is a Design System that is used by all front-end apps. It is located in `ui-watt` under `libs`.

## CI/CD pipelines

Located under `.github/workflows`. There are:

- `ett.yml` - Used by "Energy Track and Trace" app
- `license-check-ci.yml` - Used for adding license to files
- `workspace.yml` - Used to build, test, format and lint all front-end apps

## Intro

This should be replaced by content that fits your domain.

Before you start editing this repository, please read the [TEMPLATE README](./docs/template-readme/README.md)

## Architecture

![design](ARCHITECTURE.png)
