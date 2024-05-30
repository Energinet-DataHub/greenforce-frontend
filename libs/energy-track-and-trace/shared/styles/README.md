# Energy Track And Trace shared styles

## Global styles

The global stylesheet for the Energy Track And Trace application is in `src/index.scss`.

The global stylesheet is added to the application project by adding the following setting to the `projects.json#targets.build.options` configuration:

```json
"styles": ["libs/energy-track-and-trace/shared/styles/src/index.scss"]
```

## Tools

Tools, that is Sass variables, functions, and mixins, are exported in separate public modules.

| Module name | How to load the module                                              |
| ----------- | ------------------------------------------------------------------- |
| Layout      | `@use '@energinet-datahub/eo/shared/styles/layout' as eo-layout;`   |
| Spacing     | `@use '@energinet-datahub/eo/shared/styles/spacing' as eo-spacing;` |

The tools are available to component stylesheets because the following setting is added to the application project's `projects.json#targets.build.options` configuration:

```json
"stylePreprocessorOptions": {
  "includePaths": [
    "libs/energy-track-and-trace/shared/styles/src/lib",
    "libs/watt/src/lib/styles"
  ]
}
```

This makes the exported Sass modules of both Watt and Energy Track And Trace available to component stylesheets.
