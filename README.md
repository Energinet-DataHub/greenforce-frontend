[nx]: https://nx.dev
[angular]: https://angular.io

# GreenForce

[![GitHub Workflow Status (event)](https://img.shields.io/github/workflow/status/Energinet-DataHub/greenforce-frontend/DH%20Frontend%20CD?event=push)](https://github.com/Energinet-DataHub/greenforce-frontend/actions/workflows/dh-frontend-cd.yml)
[![Sonar Quality Gate](https://img.shields.io/sonar/quality_gate/geh-frontend-app/main?server=https%3A%2F%2Fsonarcloud.io)](https://sonarcloud.io/summary/new_code?id=geh-frontend-app)
[![Codecov](https://img.shields.io/codecov/c/github/Energinet-DataHub/greenforce-frontend)](https://app.codecov.io/gh/Energinet-DataHub/greenforce-frontend)
[![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/Energinet-DataHub/greenforce-frontend/@angular/core?label=angular)](https://github.com/angular/angular/blob/main/CHANGELOG.md)

Monorepo for the [DataHub](https://en.energinet.dk/Energy-data/DataHub) and
[Energy Origin](https://en.energinet.dk/Energy-data/DataHub/Energy-Origin)
frontends backed by [Nx] and [Angular].

## Table of Contents

- [General](#general)
- [Prerequisites](#prerequisites)
- [DataHub](#datahub)
  - [Documentation](#documentation)
  - [Getting Started](#getting-started)
  - [Development](#development)
  - [Backend For Frontend (BFF)](#backend-for-frontend-bff)
  - [Configuration](#configuration)
- [Energy Origin](#energy-origin)
- [Watt Design System](#watt-design-system)
- [Workspace](#workspace)
  - [Applications](#applications)
  - [Libraries](#libraries)
  - [Tools](#tools)
- [Scripts](#scripts)
- [Workflows (CI/CD)](#workflows-cicd)
- [Visual Studio Code](#visual-studio-code)

## General

> The documentation in this README assumes the reader has a general understanding
> of [Nx] and [Angular]. For beginners in these technologies, the
> [Core Nx Tutorial](https://nx.dev/getting-started/core-tutorial) and
> [Angular Tour of Heroes](https://angular.io/tutorial) serves as a good
> introduction.

This repository is a monorepo which hosts serveral applications that all share
the same dependencies (for example, every application is running the same
version of Angular).

_Note: Since this is an [Nx](https://nx.dev) workspace, the Nx CLI should be used
over the Angular CLI._

## Prerequisites

<dl>
  <dt><a href="https://volta.sh">Volta</a></dt>
  <dd>Manager for JavaScript command-line tools like Node.js® and Yarn.</dd>
  <dt><a href="https://dotnet.microsoft.com/en-us/download">.NET SDK</a></dt>
  <dd>Required for running and developing the Backend For Frontend.</dd>
  <dt><a href="https://www.java.com/en/download/">Java</a></dt>
  <dd>Required for generating HttpClients and DTOs based on Swagger definition.</dd>
</dl>

## DataHub

The application is deployed to five different environments as listed below:

| Development       | Development\*     | Test              |
| ----------------- | ----------------- | ----------------- |
| [U-001][dh-u-001] | [U-002][dh-u-002] | [T-001][dh-t-001] |

[dh-u-001]: https://jolly-sand-03f839703.azurestaticapps.net
[dh-u-002]: https://wonderful-field-057109603.1.azurestaticapps.net
[dh-t-001]: https://lively-river-0f22ad403.azurestaticapps.net

<sub>\* This is identical to **U-001**, except it also hosts
[B2C](https://azure.microsoft.com/en-us/services/active-directory/external-identities/b2c/).
This service can be accessed from **localhost**, **U-001** and **U-002**.</sub>

### Documentation

Be sure to check out the additional DataHub documentation for the following
areas:

- [Testing](docs/dh/testing.md)
- [Mocking](docs/dh/mocking.md)
- [Feature Flags](libs/dh/shared/feature-flags/README.md)
- [Logging with Application Insights](docs/dh/logging.md)

### Getting Started

Use the following command to serve the DataHub application locally:

```sh
yarn nx serve app-dh
```

The application utilizes request mocking for some of the requests to the
[backend for frontend (BFF)](#backend-for-frontend-bff), but there are still
features that are not mocked. When working with those features, it might be
required to serve the BFF locally as well. To do so, run the following command
(requires some initial setup, see
[Setup of BFF](apps/dh/api-dh/documents/development.md#setup-of-bff)).

```sh
yarn nx serve api-dh
```

_Note: It is recommended to use mocking as much as possible, see
[mocking.md](docs/dh/mocking.md)._

### Development

When it is time to add a new library, refrain from writing files manually or
copying from existing libraries. Instead, use the provided workspace generators
that takes care of all the manual work and avoids common pitfalls.

_Note: Make sure to read the [Workspace](#workspace) section beforehand to understand
which library type to generate. **It is currently not possible to generate
libraries of type `assets` and `styles`**._

To generate a new library, run the below command\* and follow the instructions:

```sh
yarn nx workspace-generator dh-library-generator
```

While rarely needed, it is also possible to generate an entirely new domain.
Running the following command\* will create a new domain with
`data-access-api`, `feature`, `routing` and `shell` libraries included:

```sh
yarn nx workspace-generator dh-domain-generator
```

<sub>\* Also available in [Nx Console](https://nx.dev/core-features/integrate-with-editors).</sub>

### Backend For Frontend (BFF)

There is currenly only one BFF located in `api-dh` under `apps/dh`.
It is for `app-dh` and is using .NET 6.x.
Check the [Development notes](./apps/dh/api-dh/documents/development.md)
for how to get started.

### Configuration

Configuration files are located in the `libs/dh/shared/assets/src/configuration`
folder. These local configurations have a `.local` filename suffix, but is
overridable by a configuration file without the suffix. For example,
`dh-api-environment.local.json` configures the DataHub frontend to use a local
DataHub API. To use a remote DataHub API, place a `dh-api-environment.json` file
in the same folder and set the remote address in the relevant property.

## Energy Origin

Use the following command to serve the Energy Origin application locally:

```sh
yarn nx serve app-eo
```

## Watt Design System

> Contributing? Check the [Watt Design System README](libs/ui-watt/README.md)
> for developer documentation.

This is a shared UI library meant to be used by all frontend apps and it
contains basic components and functionality for speeding up app development.
It is located in `libs/ui-watt` and can be imported from
`@energinet-datahub/watt` in other libraries.

The design system is showcased using [Storybook](https://storybook.js.org),
which is currently deployed to four different environments:

| Development         | Test                |
| ------------------- | ------------------- |
| [U-001][watt-u-001] | [T-001][watt-t-001] |

[watt-u-001]: https://lively-ocean-04c4e1403.1.azurestaticapps.net
[watt-t-001]: https://green-hill-085d93003.1.azurestaticapps.net/

_Note: There is currently no differences between the environments, but this
might change in the future._

To use components or other functionality from Watt, import as in the following
example:

```ts
import { WattButtonModule } from '@energinet-datahub/watt/button';
```

## Workspace

The structure of the monorepo is based on general conventions from
[Nx](https://nx.dev) with a few extensions. On the highest level the
workspace is separated into **apps** and **libs**, with most of the logic
placed within the **libs** folder. The **apps** should mostly be slim
containers that links to functionality implemented in libraries.

On the top level, the workspace is divided into the following folders:

```|
Energinet-DataHub/greenforce-frontend
├── apps      # Source code for applications
├── build     # Infrastructure related to deployment
├── dist      # Output files when building artifacts
├── docs      # General documentation
├── libs      # Source code for libraries
├── scripts   # Code needed for running certain commands
└── tools     # Logic for executing or generating code
```

### Applications

Within the **apps** folders resides the applications, which includes frontends,
BFF and E2E tests. These applications are prefixed with their type and further
grouped by a product root folder. Expanding the **apps** folder looks like this:

```|
...
└── apps            # Source code for applications
   ├── dh           # DataHub application (product root)
   │  ├── api-dh    # - BFF for DataHub
   │  ├── app-dh    # - Frontend for DataHub
   │  └── e2e-dh    # - E2E tests for DataHub
   └── eo           # Energy Origin (product root)
      ├── app-eo    # - Frontend for Energy Origin
      └── e2e-eo    # - E2E tests for Energy Origin
```

In other words, all applications must follow the naming scheme
`apps/<product>/<type>-<product>`.

Below is an exhaustive list of permitted application types, along with their
intended purpose, folder name and which [library types](#library-types) they are
allowed to have direct dependendies to:

| Type      | Description                    | Name            | Allowed Dependencies                     |
| --------- | ------------------------------ | --------------- | ---------------------------------------- |
| **`api`** | Serves as BFF for the product  | `api‑<product>` | -                                        |
| **`app`** | Entry point for the frontend   | `app‑<product>` | `shell` `environments` `assets` `styles` |
| **`e2e`** | Runs E2E tests on the frontend | `e2e‑<product>` | `e2e-util`                               |

### Libraries

As mentioned above, libraries are where most of the logic goes. They are all
either related to a single product or shared across multiple products\*.
There are many different library types which are listed further below, but they
all follow the same naming convention:

<sub>\* The special `gf` product can be used for libraries that must be shared
across multiple products.</sub>

```|
...
└── libs                                      # Source code for libraries
   └── <product>                              # Libraries are grouped by a product root folder
      └── <domain>                            # Products can contain several domains ex. auth, core, etc.
         └── <library type>-<library name>    # Domains can contain several libraries prefixed by type
   └── ui-watt                                # Special product, see "Watt Design System" section
```

_Note: Certain library types should not have a name; in that case simply omit
the `-<library name>` suffix._

Following is an exhaustive list of permitted library types, what they should
contain, their name and which other **library**\* types they are allowed to
depend on:

<sub>\* Only
libraries of type `data-access` may have dependencies to apps and only apps of type
`api`.</sub>

<a name="library-types"></a>

| Type                | Contains                                                                                                                               | Name                   | Allowed Dependencies                                                                                               |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **`feature`**       | Smart UI (with access to data sources) for specific business use cases or pages in an application.                                     | `feature‑<name>`       | `assets` `configuration` `feature` `ui` `data‑access` `domain` `routing` `util` `test‑util` `environments`         |
| **`ui`**            | Presentational logic (presentational components, pipes, presentational services, directives).                                          | `ui‑<name>`            | `ui` `util` `test-util` `domain` `assets` `styles`                                                                 |
| **`data‑access`**   | Code for interacting with a back-end system. It also includes all the code related to state management, routing and HTTP interceptors. | `data‑access‑<name>`   | `data-access` `routing` `util` `test-util` `domain` `environments`                                                 |
| **`routing`**       | Code related to routing (routes, route paths, route guards, route resolvers, route reuse strategies, preloading strategies).           | `routing`              | `data-access` `routing` `util` `test-util` `shell` `domain`                                                        |
| **`util`**          | Low-level utilities used by many libraries and applications (services, pure functions, contants).                                      | `util‑<name>`          | `util` `test-util` `environments`                                                                                  |
| **`test‑util`**     | Stubs, jest matchers, testing modules and test library configuration.                                                                  | `test‑util‑<name>`     | `data-access` `util` `test-util` `domain` `configuration` `assets`                                                 |
| **`e2e‑util`**      | Cypress commands and fixtures.                                                                                                         | `e2e‑util‑<name>`      | `util` `test-util` `e2e-util`                                                                                      |
| **`domain`**        | Interfaces, types, constants, functions and services related to domain objects.                                                        | `domain`               | `domain` `util` `test-util`                                                                                        |
| **`shell`**         | Entrypoint for an application or domain. Orchestration and routing.                                                                    | `shell`                | `feature` `ui` `data-access` `routing` `util` `test-util` `shell` `configuration` `environments` `assets` `styles` |
| **`configuration`** | Configuration and setup of libraries and concerns (for example i18n).                                                                  | `configuration‑<name>` | `data-access` `routing` `util` `test-util` `configuration` `environments` `domain`                                 |
| **`environments`**  | Code related to loading different environment configurations.                                                                          | `environments`         | `util` `test-util` `environments` `assets`                                                                         |
| **`assets`**        | Icons, images, fonts, JSON etc.                                                                                                        | `assets`               | `assets`                                                                                                           |
| **`styles`**        | SCSS functions, mixins, variables, partials, and global stylesheets.                                                                   | `styles`               | `assets` `styles`                                                                                                  |

### Tools

This folder contains code only meant for use during development or within
workflows. Expanding it looks like this:

```|
...
└── tools
   ├── <product>     # Various non-nx tools separated by product
   ├── executors     # Perform all sorts of actions on your code
   └── generators    # Automate tasks using code generation
```

Executors and generators are [Nx] inventions; for
documentation on how to work with them, see
[Use Task Executors](https://nx.dev/plugin-features/use-task-executors) and
[Use Code Generators](https://nx.dev/plugin-features/use-code-generators).

## Scripts

<dl>
  <dt><code>yarn dep-graph</code></dt>
  <dd>Generate a dependency graph for the applications in the monorepo.</dd>
</dl>

## Workflows (CI/CD)

The repository is using [GitHub Actions workflows](https://docs.github.com/en/actions/using-workflows/about-workflows)
for automation including CI/CD pipelines for each application.
Workflows are located in `.github/workflows` which currently contains the following:

<dl>
  <dt><code>app-dh-healthchecks.yml</code></dt>
  <dd>
    Used for running health check and E2E tests every hour against all DataHub
    environments.
  </dd>
  <dt><code>dh-backend-cd.yml</code></dt>
  <dd>
    Used by DataHub for publishing a release, dispatching a deployment request,
    and updating BFF code coverage.
  </dd>
  <dt><code>dh-backend-ci.yml</code></dt>
  <dd>Used by the BFF for <code>app-dh</code>.</dd>
  <dt><code>dh-frontend-cd.yml</code></dt>
  <dd>
    Used by DataHub frontend for publishing a release and dispatching a
    deployment request.
  </dd>
  <dt><code>eo-cd.yml</code></dt>
  <dd>Used by "Energy Origin" app.</dd>
  <dt><code>frontend-ci.yml</code></dt>
  <dd>Used to build, test, format and lint all frontend apps.</dd>
  <dt><code>license-check-ci.yml</code></dt>
  <dd>Used to check for license headers in files and adding them if missing.</dd>
  <dt><code>production-dependencies-license-check.yml</code></dt>
  <dd>Used for documenting used versions and licenses of production dependencies.</dd>
  <dt><code>watt-backend-cd.yml</code></dt>
  <dd>
    Used by Watt for publishing a release and dispatching a deployment request
    of infrastructure as code (IaC).
  </dd>
  <dt><code>watt-backend-ci.yml</code></dt>
  <dd>Used by Watt for creating a pre-release of IaC.</dd>
  <dt><code>watt-frontend-cd.yml</code></dt>
  <dd>
    Used by Watt for deploying to Chromatic, publishing a release, and
    dispatching a deployment request.
  </dd>
</dl>

_Bots are used for certain trivial tasks such as adding license headers to files,
formatting code, fixing lint errors, and generating API clients based on OpenAPI.
For this to work, bots have to use the repository secret `PAT_TOKEN` when pushing
changes or creating releases that trigger a workflow. Only do this for idempotent
tasks to prevent circular workflows from causing inifinite workflow runs._

## Visual Studio Code

It is recommended to use the [Visual Studio Code](https://code.visualstudio.com)
editor, as it supports the entire toolchain of this repository and has
been preconfigured with a list of recommended extensions stored in
`.vscode/extensions.json`. The editor will automatically prompt for installing
these extensions when the project is opened for the first time, but they can
later be found by executing the `Show recommended extensions` command.
