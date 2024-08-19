# Testing

## Unit / Integration Testing

To run all test for every application and library, use the following command:

```sh
bun test
```

While this command can be useful when working with shared libraries to test for
any regression, it is slow and not recommended during developing. Instead, the
test execution can be scoped to a specific application or library:

```sh
bun nx run app-dh:test
bun nx run dh-metering-point-feature-overview:test
```

For running the tests in watch mode, add the `--watch` flag to the command:

```sh
bun test --watch
bun nx run app-dh:test --watch
```

Currently the test suites are running agains a mocked BFF, meaning that any code
that requests the BFF will automatically receive the mocked data. This mocked
data must be configured manually, check the [mocking documentation](mocking.md)
for instructions.

### Special test configuration

#### When the feature under test uses translations

In this case import `getTranslocoTestingModule` function in the testing setup. This will preload the translation files and set the default language to "English". So the English translation file should be used when looking for specific strings. For example:

```ts
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';

import { en as enTranslations } from '@energinet-datahub/dh/globalization/assets-localization';

async function setup() {
  await render(MyComponent.name, {
    imports: [
      getTranslocoTestingModule(),
      // ...
    ],
  }
};
```

#### When the feature under test uses toast(s)

In this case import `MatSnackBarModule` function in the testing setup. This will make sure that the base API is configured correctly. For example:

```ts
import { MatSnackBarModule } from '@angular/material/snack-bar';

async function setup() {
  await render(MyComponent.name, {
    providers: [importProvidersFrom(MatSnackBarModule)],
  }
};
```

#### When the feature under test sends requests to the BFF

In this case import `DhApiModule.forRoot()` and `HttpClientModule` in the test setup. This will make sure that the base API is configured correctly. For example:

```ts
import { HttpClientModule } from '@angular/common/http';

import { DhApiModule } from '@energinet-datahub/dh/shared/data-access-api';

async function setup() {
  await render(MyComponent.name, {
    imports: [
      HttpClientModule,
      DhApiModule.forRoot(),
      // ...
    ],
  }
};
```

**\*NOTE**: All requests to the BFF first go through MSW and a mock is returned if there's a match. If there's no match, the request falls through and continues to the BFF. In this case an error will be seen in the console.

#### When the feature under test uses WattDatepicker or WattTimepicker components

In this case import `danishDatetimeProviders` in the test setup. This will add the necessary providers needed for the datepicker/timepicker to work. For example:

```ts
import { danishDatetimeProviders } from '@energinet-datahub/watt/core/datetime';

async function setup() {
  await render(MyComponent, {
    providers: [
      danishDatetimeProviders,
      // ...
    ]
  }
};
```

### Debugging Jest tests

You can use [Jest Preview](https://github.com/nvh95/jest-preview) to visually debug Jest tests in a browser.

In order to do that, you need to:

1. Start the Jest Preview Server by running `bun jest-preview` in a Terminal. A new page will open in the browser where failing tests can be previewed.
2. Add `debug()` to the test you want to debug.

```ts
import { debug } from 'jest-preview';

describe('AppComponent', () => {
  it('should work as expected', () => {
    // ...
    debug();
    // ...
  });
});
```

## E2E Testing

To be able to running the tests locally, you will need to rename `apps/e2e-dh/cypress.env.json.sample` to `apps/e2e-dh/cypress.env.json` and insert the required information. The `DH_E2E_B2C_URL` should reflect the application B2C config `libs/dh/shared/assets/src/assets/configuration/dh-b2c-environment.json`. To run the tests use following command:

`bun nx e2e e2e-dh`

To debug / watch-mode E2E tests:

`bun nx e2e e2e-dh --watch`
