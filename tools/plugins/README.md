# Nx Plugins

This folder contains custom Nx plugins for the workspace.

## implicit-libs

The `implicit-libs.ts` plugin automatically infers Nx projects from the folder structure, eliminating the need for individual `project.json` files in each library.

### How it works

The plugin scans for `index.ts` files in the `libs/` directory and creates Nx projects based on the folder structure. Each detected library gets:

- A project name derived from the path (e.g., `libs/dh/admin/feature-user-management` becomes `dh-admin-feature-user-management`)
- Tags for product, domain, and type (e.g., `product:dh`, `domain:admin`, `type:feature`)
- A `lint` target using ESLint
- A `test` target using Vitest

### Supported patterns

| Pattern | Example | Project Name |
|---------|---------|--------------|
| `libs/{product}/{name}` | `libs/dh/grid-areas` | `dh-grid-areas` |
| `libs/{product}/{domain}/{name}` | `libs/dh/admin/feature-user-management` | `dh-admin-feature-user-management` |
| `libs/{product}/{category}/{domain}/{name}` | `libs/gf/msw/util-msw` | `gf-msw-util-msw` |

### Excluded libraries

The following libraries are **not** inferred by this plugin and retain explicit `project.json` files:

- **`watt`** - The design system is a buildable/publishable library
- **GraphQL-only libraries** - Libraries without an `index.ts` (only `.graphql` files) such as `libs/dh/*/data-access-graphql`

### Shared configuration

Instead of individual config files per library, shared configurations are located at the product level:

```
libs/
├── dh/
│   ├── .eslintrc.json      # Shared ESLint config for dh libs
│   ├── tsconfig.json       # Shared TypeScript config
│   ├── tsconfig.lib.json   # TypeScript config for library builds
│   ├── tsconfig.spec.json  # TypeScript config for tests
│   ├── vite.config.mts     # Shared Vitest config
│   └── test-setup.ts       # Shared test setup
├── gf/
│   └── (same structure)
```

### Creating new libraries

Use the workspace generators to create new libraries:

```sh
# Create a single library
bun nx g ./tools/workspace:library --product=dh --domain=admin --libraryType=feature --name=my-feature

# Create an entire domain (feature + data-access + shell)
bun nx g ./tools/workspace:domain --product=dh --domain=my-domain --name=overview
```

### Verifying projects

To see all inferred projects:

```sh
bun nx show projects
```

To see details for a specific project:

```sh
bun nx show project dh-admin-feature-user-management
```

### Reference

This implementation follows the pattern described in the [Marmicode Nx Cookbook - Implicit Libraries](https://cookbook.marmicode.io/nx/implicit-libraries).
