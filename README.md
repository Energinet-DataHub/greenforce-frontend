[nx]: https://nx.dev
[angular]: https://angular.io

# GreenForce

Monorepo for the [DataHub](https://en.energinet.dk/Energy-data/DataHub) and
[Energy Origin](https://en.energinet.dk/Energy-data/DataHub/Energy-Origin)
frontends backed by [Nx] and [Angular].

## Table of Contents

- [General](#general)
- [DataHub](#datahub)
  - [Getting Started](#getting-started)
  - [Development](#development)
- [Energy Origin](#energy-origin)
- [Workspace](#development)
  - [Applications](#applications)
  - [Library Types](#library-types)
- [Tools](#development)

## General

> The documentation in this README assumes the reader has a general understanding
> of [Nx] and [Angular]. For beginners in these technologies, the
> [Core Nx Tutorial](https://nx.dev/getting-started/core-tutorial) and the
> [Angular Tour of Heroes](https://angular.io/tutorial) can serve as a good
> introduction.

This repository is a monorepo which hosts serveral applications that all share
the same dependencies (for example, every application is running the same
version of Angular).

_Note: Since this is an [Nx](https://nx.dev) workspace, the Nx CLI should be used
over the Angular CLI._

## DataHub

The application is deployed to five different environments as listed below:

| Development | Development\* | Test    | Pre-production | Production |
| ----------- | ------------- | ------- | -------------- | ---------- |
| [U-001]     | [U-002]       | [T-001] | [B-001]        | [B-002]    |

[u-001]: https://jolly-sand-03f839703.azurestaticapps.net
[u-002]: https://wonderful-field-057109603.1.azurestaticapps.net
[t-001]: https://lively-river-0f22ad403.azurestaticapps.net
[b-001]: https://blue-rock-05b7e5e03.azurestaticapps.net
[b-002]: https://purple-forest-07e41fb03.azurestaticapps.net

<sub>\* This is identical to **U-001**, except it also hosts
[B2C](https://azure.microsoft.com/en-us/services/active-directory/external-identities/b2c/).
This service can be accessed from **localhost**, **U-001** and **U-002**.</sub>

### Getting Started

Use the following command to serve the DataHub application locally:

```sh
yarn nx serve app-dh
```

The application utilizes request [mocking](mocking.md) for some of the requests
to the backend-for-frontend (BFF), but there are still features that are not
mocked. When working with those features, it might be required to serve the
BFF locally as well. To do so, run the following command (requires some initial
setup, see [Setup of BFF](#TODOTHISLINK)).

```sh
yarn nx serve api-dh
```

_Note: It is recommended to use mocking as much as possible, see
[mocking.md](TODOTHISLINK)._

### Development

To generate a new library, run `yarn nx workspace-generator dh-library-generator` and follow the instructions or use the "workspace-generator - dh-library-generator" option under "generate" command in Nx Console extension.

```sh
yarn nx workspace-generator dh-library-generator
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
grouped by a product root folder. This is what expanding the **apps** folder
looks like:

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

Below is an exhaustive list of permitted application types, along with their
intended purpose and which [library types](#libraries) they are allowed to have direct
dependendies to:

| Prefix    | Description                              | Path                           | Allowed Dependencies                     |
| --------- | ---------------------------------------- | ------------------------------ | ---------------------------------------- |
| **`api`** | Serves as BFF for the product            | `apps/<product>/api-<product>` | -                                        |
| **`app`** | Entry point for the frontend application | `apps/<product>/app-<product>` | `shell` `environments` `assets` `styles` |
| **`e2e`** | Runs E2E tests for the frontend and BFF  | `apps/<product>/e2e-<product>` | `e2e-util`                               |

```
   ├── executors     # - Executors perform actions on your code. This can include building, linting, testing, serving.
   └── generators    # - Generators provide a way to automate tasks you regularly perform as part of your development workflow. This can include: scafolding
```

### Folder Structure - library

```|
...
└── libs                                     # Contains source code for libraries
   └── <product>                             # All libraries are grouped by a product root folder
      └── <domain>                           # A product can contain serveral domains ex. auth, core, etc.
         └── <library type>-<library name>   # A domain can contain serveral libraries which are prefixed by type
   └── ui-watt                               # See "Watt Design System" section
```

## App Types

- api (BFF)
- app (Frontend)
- e2e

### API apps (BFFs)

An API app contains the BFF of a product. API apps are located under `apps/<product>` and are prefixed with `api-<product>`.

### Frontend Apps

A Frontend app contains the frontend application of a product. Frontend apps are located under `apps/<product>` and are prefixed with `app-<product>`.
Allowed dependencies: `shell`, `environments`, `assets`, `styles` libraries.

### E2E apps

An E2E app contains the e2e application of a product. E2E apps are located under `apps/<product>` and are prefixed with `e2e-<product>`
Allowed dependencies: `e2e-util` libraries and always an implicit dependency on an app, and an API (BFF).

## Library Types

All libraries are related to a product or shared across multiple products. The libraries are located under `libs/<product>` and are prefixed with `<library type>-<library name>`.
For shared libraries `gf` should be used as `product`.

Only libraries of type `data-access` may have dependencies to apps, and only apps of type `api`. Depending on the type of a library, a library can have dependencies to other types of libraries:

- feature
- ui
- data-access
- routing
- util
- test-util
- e2e-util
- domain
- shell
- configuration
- environments
- assets
- styles

### Feature libraries

Developers should consider feature libraries as libraries that implement smart UI (with access to data sources) for specific business use cases or pages in an application.
Allowed dependencies to: `feature`, `ui`, `data-access`, `routing`, `util`, `test-util`, `domain`, `environments`, `assets`.

### UI libraries

A UI library contains only presentational logic (presentational components, pipes, presentational services, directives).
Allowed dependencies to: `ui`, `util`, `test-util`, `domain`, `assets`, `styles`.

### Data-access libraries

A data-access library contains code for interacting with a back-end system. It also includes all the code related to state management, routing and HTTP interceptors.
Allowed dependencies to: `data-access`, `routing`, `util`, `test-util`, `domain`, `environments`.

### Routing libraries

A routing library contains code related for routing (routes, route paths, route guards, route resolvers, route reuse strategies, preloading strategies).
Allowed dependencies to: `data-access`, `routing`, `util`, `test-util`, `shell`, `domain`.

### Utility libraries

A utility library contains low-level utilities used by many libraries and applications (services, pure functions, contants).
Allowed dependencies to: `util`, `test-util`, `environments`.

### Test-util libraries

Stubs, jest matchers, testing modules, test library configuration
Allowed dependencies to: `data-access`, `util`, `test-util`, `domain`, `configuration`, `assets`.

### E2E-util libraries

Cypress commands or fixtures
Allowed dependencies to: `util`, `test-util`, `e2e-util`.

### Domain libraries

Interfaces, types, constants, functions and services related to domain objects.
Allowed dependencies to: `domain`, `util`, `test-util`.

### Shell libraries

Entrypoint for an application or domain. Orchestration and routing.
Allowed dependencies to: `feature`, `ui`, `data-access`, `routing`, `util`, `test-util`, `shell`, `configuration`, `environments`, `assets`, `styles`.

### Configuration libraries

A library containing configuration and setup of libraries and conerns, for example i18n
Allowed dependencies to: `data-access`, `routing`, `util`, `test-util`, `configuration`, `environments`, `domain`.

### Environments libraries

Angular environment files.
Allowed dependencies to: `util`, `test-util`, `environments`, `assets`.

### Assets libraries

Icons, images, fonts, etc.
Allowed dependencies to: `assets`.

### Styles libraries

SCSS functions, mixins, variables, partials, and global stylesheets.
Allowed dependencies to: `assets`, `styles`.

### Generating a library

To generate a new library, run `yarn nx workspace-generator dh-library-generator` and follow the instructions or use the "workspace-generator - dh-library-generator" option under "generate" command in Nx Console extension.

_Note_: This command currently supports generating the following library types:

- feature
- ui
- data-access
- routing
- util
- test-util
- e2e-util
- domain
- shell
- configuration
- environments

### Generating a new domain

It is also possible to generate an entire domain. To do so, run `yarn nx workspace-generator dh-domain-generator`. This will generate a new domain
with the following library types included:

- data-access-api
- feature
- routing
- shell

_Note_: You will have to enter a name for the feature library.

## Frontend apps

The frontend apps are built with Angular in an Nx Workspace. They are located under `apps` folder:

- `dh/app-dh` - "DataHub" app
- `dh/e2e-dh` - End-to-end tests for `app-dh`
- `eo/app-eo` - "Energy Origin" app.
- `eo/e2e-eo` - End-to-end tests for `app-eo`

Besides the `apps` folder, there's also a `libs` folder that contains features used by the apps. This is where most of the code lives.

### Frontend configuration files

#### DataHub frontend

Configuration files are located in the `assets/configuration` folder. Local configurations have a `.local` filename suffix but is overridable by a configuration file without a prefix. For example, `dh-api-environment.local.json` configures the DataHub frontend to use a local DataHub API. To use a remote DataHub API, place a `dh-api-environment.json` file in the same folder
and set the remote address in the relevant property.

## Backend-for-frontend (BFF)

There's currenly only one BFF located in `api-dh` under `apps/dh`. It is for `app-dh` and is using .NET 5.0. See [Development notes](./apps/dh/api-dh/documents/development.md). When developing `app-dh`, run `nx serve api-dh` to start
the BFF. This is required for both local development and tests.

## Watt Design System

"Watt" is a Design System that is used by all frontend apps. It is located in `ui-watt` under `libs`.

## CI/CD pipelines

Located under `.github/workflows`. There are:

- `api-dh-ci.yml` - Used by the BFF for `app-dh`.
- `eo-cd.yml` - Used by "Energy Origin" app
- `license-check-ci.yml` - Used for adding license to files
- `frontend-ci.yml` - Used to build, test, format and lint all frontend apps

We use bots for certain trivial tasks such as adding license headers to files, formatting code, fixing lint errors, and generating API clients based on OpenAPI. For this to work, bots have to use the repository secret `PAT_TOKEN` when pushing changes or creating releases that trigger a workflow. Only do this for idempotent tasks to
prevent circular workflows from causing inifinite workflow runs.
