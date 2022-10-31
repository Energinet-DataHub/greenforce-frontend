# Watt Design System

## Running the project

Run `yarn run designsystem:start`.

## Building the project

Run `yarn run designsystem:build`.

## Running unit tests

Run `yarn nx test ui-watt`.

## Creating components

It is recommended to run `yarn nx workspace-generator watt-component` to generate the files needed for new components in the library (it can also be executed from the “generate” command in Nx Console extension).

_When asked for a component name, any "casing" can be used (e.g. `my-button`, `MyButton`), but prefer the former (kebab-case) for now._

Using the example name above, the generator will create a `my-button` folder in `libs/ui-watt/src/components` with the following files:

- `index.ts`
- `watt-my-button.component.html`
- `watt-my-button.component.scss`
- `watt-my-button.component.spec.ts`
- `watt-my-button.component.ts`
- `watt-my-button.module.ts`
- `watt-my-button.stories.ts`

It will also automatically update the `libs/ui-watt/src/index.ts` with an `export` declaration that re-exports everything from `my-button/index.ts`.

The generated files contain some sensible defaults for getting started and it should have a working story out of the box.

## Design System

The design system is deployed through Chromatic, and can be found here:  
[Latest version (main)](https://main--61765fc47451ff003afe62ff.chromatic.com/)

You can also find a deployed version of your specific branch here (direct link, can also be found under checks in a pull-request):
`https://<branch>--61765fc47451ff003afe62ff.chromatic.com`
