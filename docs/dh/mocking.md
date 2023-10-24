# Mocking

`app-dh` is using [Mock Service Worker](https://mswjs.io/docs/), also known as MSW, to mock HTTP requests against the backend-for-frontend (BFF). Mocks are located here:
`libs/dh/shared/data-access-mocks/src/lib` and registered here: `libs/dh/shared/data-access-mocks/src/index.ts`.

![Dep graph](./mocking-dep-graph.png)

## Bypass mocks in development

Mocks are enabled by default but can be bypassed by running the `development` target. This will disable the mocks and call the BFF configured in `libs/dh/shared/assets/src/assets/configuration/dh-api-environment.local.json`.

`yarn nx run app-dh:serve:development`

## Add new mocks

Mocks should be added here `libs/dh/shared/data-access-mocks/src/lib` and you can find information about how to mock here.
After your mocks has been created you need to import your mocks here `libs/dh/shared/data-access-mocks/src/index.ts`

You can find more information of how to define mocks [here](https://mswjs.io/docs/getting-started/mocks/rest-api).

## Testing

Mocks are shared between the development and testing environment. This means that you usually don't need specific mocks in your tests as these should be testable manually as well by running the application.

However MSW needs to be configured in your `test-setup.ts` file:

```ts
  import { setupMSWServer } from '@energinet-datahub/gf/test-util-msw';
  import { dhLocalApiEnvironment } from '@energinet-datahub/dh/shared/assets';
  import { mocks } from '@energinet-datahub/dh/shared/data-access-mocks';

  setupMSWServer(dhLocalApiEnvironment.apiBase, mocks);
  ...
```

If you however need specific mocks for your tests you are able to overwrite the existing mocks or adding new ones by adding a [runtime request handler](https://mswjs.io/docs/api/setup-server/use).
