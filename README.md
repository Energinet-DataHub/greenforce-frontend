# GreenForce

Monorepo that hosts:

- Frontend apps
- Backend-for-frontends (BFFs)
- Watt Design System
- CI/CD pipelines
- Infrastructure

## Getting started

[Read more here](docs/getting-started.md)

## Folder Structure

The folder structure of the repository is based on [Nrwl](https://nrwl.io/) [NX](https://nx.dev/angular) mono-repository project.

```|
Energinet-DataHub/greenforce-frontend
├── apps                    # Contains source code for applications. This includes frontends, BFF and E2E. Apps are grouped by a product root folder, and type prefixed sub-folder(s).
|  ├── dh                   # DataHub application (product)
|  |  ├── api-dh            # - BFF for DataHub
|  |  ├── app-dh            # - Frontend for DataHub
|  |  └── e2e-dh            # - E2E tests for DataHub
|  └── eo                   # Energy Origin (product)
|     ├── app-eo            # - Frontend for Energy Origin
|     └── e2e-eo            # - E2E tests for Energy Origin
├── build                   # Contains infrastructure for DataHub and the design system
├── dist                    # Contains output files when building artifacts (for distribution)
|  ├── apps                 #
|  └── libs                 #
├── docs                    # Contains general documentation
├── infrastructure          # Contains infrastructure for Energy Origin
├── libs                    # Contains source code for libraries. See "Folder Structure - library" section for more information
└── tools                   # Contains various tools
   ├── executors            # - Executors perform actions on your code. This can include building, linting, testing, serving.
   └── generators           # - Generators provide a way to automate tasks you regularly perform as part of your development workflow. This can include: scafolding
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
