# DataHub feature flags

You can disable functionality for specified environments: `dev, test, prod.`

<mark>Notice: feature flags treat the pre-prod environment as prod.</mark>

Feature flags are not supposed to live long; therefore, they have a **maximum lifetime of 62 days** (If a feature flag is older than 62 days, an automated test will fail).

## Create a feature flag

Feature flags are located here: `libs/dh/shared/feature-flags/src/lib/feature-flags.ts` -> Find the constant: `dhFeatureFlagsConfig`

The feature flags require two properties, `created` and `disabledEnvironments`.

**Example:**

```ts
'my-awesome-feature-flag': {
  created: '01-01-2022',
  disabledEnvironments: [DhAppEnvironment.prod],
}
```

The `created` property is danish locale `dd-mm-yyyy`. Feature flags use this property internally to check for old feature flags.

The `disabledEnvironments` property is an array of the environments you want to disable a feature in, e.g. `prod`.

## Remove a feature flag

The recommended way to remove a feature flag is to remove the entry from the `dhFeatureFlagsConfig.` The compiler will then error in all the files using that feature flag, making it easier to identify the usage of the feature flag.

## Using a feature flag

Feature flags can be used by the `*dhFeatureflag` directive or the `DhFeatureFlagsService.`

<mark>Notice: Unknown feature flags not added to the feature flag configuration are treated as enabled.</mark>

### From the template

Use the feature flags within templates with the feature flag structural directive.

```html
<ng-container *dhFeatureFlag="my-awesome-feature-flag">
  SOME CONTENT
</ng-container>
```

<mark>Notice: Using feature flags with the structural directive, you will need to import the `DhFeatureFlagDirectiveModule`</mark>

### From TypeScript (Controllers, Guards, etc.)

Use the feature flags within TypeScript with the feature flag service.

1. Inject the service (The service is provided in the root, so you don't have to import any module):

```ts
  constructor(private featureFlagsService: DhFeatureFlagsService) {}
```

2. Use the `isEnabled` method on the service:

```ts
this.featureFlagsService.isEnabled('my-awesome-feature-flag');
```
