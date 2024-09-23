# Graphql Codegen

This library is for custom GraphQL Codegen plugins.

## Development

Paths to plugins are specificed in the `codegen.ts` file. These files must be in CommonJS
format, which is why this project has a custom `build` target. When the desired changes
have been made to the TypeScript file, run the below command to generate the CommonJS
file in the `dist` folder:

```sh
bun nx run dh-shared-feature-graphql-codegen:build 
```

_For convenience and a simpler setup, the contents of the `dist` folder is intentionally
checked into source control._
