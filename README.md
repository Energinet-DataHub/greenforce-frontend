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

## Front-end apps

The front-end apps are built with Angular in an Nx Workspace. They are located under `apps` folder:

- `app-dh` - "DataHub" app
- `e2e-dh` - End-to-end tests for `app-dh`
- `app-ett` - "Energy Track and Trace" app.
- `e2e-ett` - End-to-end tests for `app-ett`

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
