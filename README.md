# GreenForce

Monorepo that hosts:

- Front-end apps
- Backend-for-frontends (BFFs)
- Watt Design System
- CI/CD pipelines
- Infrastructure

## Folder Structure

The folder structure of the repository is based on [Nrwl](https://nrwl.io/) [NX](https://nx.dev/angular) mono-repository project.

```|
Energinet-DataHub/greenforce-frontend
├── apps                    # Contains source code for applications. This includes frontends, BFF and E2E. Apps are grouped by a product root folder, and type prefixed sub-folder(s).
|  ├── dh                   # Data Hub application (product)
|  |  ├── api-dh            # - BFF for Data Hub
|  |  ├── app-dh            # - Frontend for Data Hub
|  |  └── e2e-dh            # - E2E tests for Data Hub
|  └── ett                  # Energy Track and Trace (product)
|  |  ├── app-ett           # - Frontend for Energy Track and Trace
|  |  └── e2e-ett           # - E2E tests for Energy Track and Trace
├── dist                    # Contains output files when building artifacts (for distribution)
|  ├── apps                 #
|  └── libs                 #
├── libs                    # Contains source code for libraries. Libraries are grouped by a product root folder, and type prefixed sub-folder(s).
|  ├── dh                   # - Libraries for Data Hub (product)
|  ├── ett                  # - Libraries for Energy Track and Trace (product)
|  └── ui-watt              # - Actual implementation of the design system
└── tools                   # Contains various tools
   └── executors            # - Executors perform actions on your code. This can include building, linting, testing, serving. Example: "add license"
```

## App Types

- api (BFF)
- app (Frontend)
- e2e

### Api apps (BFF's)

A Api app contains the BFF of a product. Api apps are located under `apps/<product>` and are prefixed with `api-<product>`.

### Frontend App

A Frontend app contains the frontend application of a product. Frontend apps are located under `apps/<product>` and are prefixed with `app-<product>`.
Allowed dependencies: `shell`, `environments`, `assets`, `styles` libraries.

### E2E apps

A E2E app contains the e2e application of a product. Frontend apps are located under `apps/<product>` and are prefixed with `e2e-<product>`
Allowed dependencies: `e2e-util` libraries and always an implicit dependency of an app, and a api (BFF).

## Library Types

All libraries are related to a product or shared across multiple products. The libraries are located under `libs/<product>` and are prefixed with `<library type>-<library name>`.
For shared libraries `gf` should be used as `product`.

No library must have any dependencies to an app. Depending on the type of a library, a library can have dependencies to other certain types of libraries.

- feature
- ui
- data-access
- util
- test-util
- e2e-util
- domain
- shell
- environments
- assets
- styles

### Feature libraries

Developers should consider feature libraries as libraries that implement smart UI (with access to data sources) for specific business use cases or pages in an application.
Allowed dependencies to: `feature`, `ui`, `data-access`, `util`, `test-util`, `domain`, `environments`, `assets`.

### UI libraries

A UI library contains only presentational logic (presentational components, pipes, presentational services, directives).
Allowed dependencies to: `ui`, `util`, `test-util`, `domain`, `assets`, `styles`.

### Data-access libraries

A data-access library contains code for interacting with a back-end system. It also includes all the code related to state management, routing and HTTP interceptors.
Allowed dependencies to: `data-access`, `util`, `test-util`, `domain`, `environments`.

### Utility libraries

A utility library contains low-level utilities used by many libraries and applications (services, pure functions, contants).
Allowed dependencies to: `util`, `test-util`.

### test-util

Stubs, jest matchers, testing modules, test library configuration
Allowed dependencies to: `data-access`, `util`, `test-util`, `domain`.

### e2e-util

Cypress commands or fixtures
Allowed dependencies to: `util`, `test-util`, `e2e-util`.

### domain

interfaces, types, constants, functions and services related to domain objects.
Allowed dependencies to: `domain`, `util`, `test-util`.

### shell

Entrypoint for an application or domain. Orchestration and routing.
Allowed dependencies to: `feature`, `ui`, `data-access`, `util`, `test-util`, `shell`, `environments`, `assets`, `styles`.

### environments

Angular environment files.
Allowed dependencies to: `util`, `test-util`, `environments`.

### assets

Icons, images, fonts etc.
Allowed dependencies to: `assets`.

### styles

SCSS functions, mixins, variables and partials.
Allowed dependencies to: `assets`, `styles`.

## Front-end apps

The front-end apps are built with Angular in an Nx Workspace. They are located under `apps` folder:

- `dh/app-dh` - "DataHub" app
- `dh/e2e-dh` - End-to-end tests for `app-dh`
- `ett/app-ett` - "Energy Track and Trace" app.
- `ett/e2e-ett` - End-to-end tests for `app-ett`

Besides the `apps` folder, there's also a `libs` folder that contains features used by the apps. This is where most of the code lives.

## Backend-for-frontend (BFF)

There's currenly only one BFF located in `api-dh` under `apps/dh`. It is for `app-dh` and is using .NET 5.0. See [Development notes](./libs/api-dh-app/documents/development.md).

## Watt Design System

"Watt" is a Design System that is used by all front-end apps. It is located in `ui-watt` under `libs`.

## CI/CD pipelines

Located under `.github/workflows`. There are:

- `api-dh-ci.yml` - Used by the BFF for `app-dh`.
- `ett.yml` - Used by "Energy Track and Trace" app
- `license-check-ci.yml` - Used for adding license to files
- `workspace.yml` - Used to build, test, format and lint all front-end apps
