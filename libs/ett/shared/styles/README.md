# Energy Track and Trace shared styles

## Global styles

The global stylesheet for the Energy Track and Trace application is in `src/index.scss`.

The global stylesheet is added to the application project by adding the following setting to the `projects.json#targets.build.options` configuration:

```json
"styles": ["libs/ett/shared/styles/src/index.scss"]
```

## Tools

Tools, that is Sass variables, functions, and mixins, are exported in separate public modules.

| Module name | How to load the module                                                |
| ----------- |-----------------------------------------------------------------------|
| Layout      | `@use '@energinet-datahub/ett/shared/styles/layout' as ett-layout;`   |
| Spacing     | `@use '@energinet-datahub/ett/shared/styles/spacing' as ett-spacing;` |

The tools are available to component stylesheets because the following setting is added to the application project's `projects.json#targets.build.options` configuration:

```json
"stylePreprocessorOptions": {
  "includePaths": [
    "libs/ett/shared/styles/src/lib",
    "libs/watt/package/core/styles"
  ]
}
```

This makes the exported Sass modules of both Watt and Energy Track and Trace available to component stylesheets.
