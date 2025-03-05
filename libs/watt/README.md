# Watt Design System

The design system is deployed through Chromatic, and can be found here: [Latest version (main)](https://main--61765fc47451ff003afe62ff.chromatic.com/)

## Running the project

Run `bun run designsystem:start`.

## Building the project

Run `bun run designsystem:build`.

## Running unit tests

Run `bun nx test watt`.

## Creating components

It is recommended to run `bun nx g @energinet-datahub/tools/workspace:watt-component` to generate the files needed for new components in the library (it can also be executed from the “generate” command in Nx Console extension).

_When asked for a component name, any "casing" can be used (e.g. `my-button`, `MyButton`), but prefer the former (kebab-case) for now._

Using the example name above, the generator will create a `my-button` folder in `libs/watt/src/components` with the following files:

- `index.ts`
- `watt-my-button.component.spec.ts`
- `watt-my-button.component.ts`
- `watt-my-button.stories.ts`

The generated files contain some sensible defaults for getting started and it should have a working story out of the box.
