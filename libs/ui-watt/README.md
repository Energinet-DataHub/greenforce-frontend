# ui-watt

This library was generated with [Nx](https://nx.dev).

## Running the project

Run `yarn run designsystem:start`.

## Running unit tests

Run `nx test ui-watt` to execute the unit tests.

## Creating components

It is recommended to run `nx workspace-generator watt-component` to generate
the files needed for new components in the library (it can also be executed
from the “generate” command in Nx Console),

_When asked for a component name, any "casing" can be used (e.g. `my-button`, `MyButton`), but prefer the former (kebab-case) for now._

Using the example name above, the generator will create a `my-button` folder in `libs/ui-watt/src/components` with the following files:

- `index.ts`
- `watt-my-button.component.html`
- `watt-my-button.component.scss`
- `watt-my-button.component.spec.ts`
- `watt-my-button.component.ts`
- `watt-my-button.module.ts`
- `watt-my-button.stories.ts`

It will also automatically update the `libs/ui-watt/src/index.ts` with an
`export` declaration that re-exports everything from `my-button/index.ts`.

The generated files contain some sensible defaults for getting started and
it should have a working story out of the box.
