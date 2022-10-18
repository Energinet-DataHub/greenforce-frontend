# Frontend Authorization

Authorization in the frontend app is used to disable features and actions that the current user is not permitted to perform. There are several ways to achieve this, depending on the needs of the user interface:

- `DhPermissionRequiredDirective`: An Angular directive that toggles rendering of components.
- `PermissionGuard`: A routing guard to prevent navigation.
- `PermissionService.hasPermission()`: A function for manually checking permissions.

The directive and the guard take an array of permissions in. Authorization succeeds if the user has any of the specified permissions in the list (permissions are OR'ed). If authorization should succeed only when the user has all the listed permissions (permissions are AND'ed), repeat the guard or directive for each permission.

> WARNING: This feature does not provide any form of security! Remember to configure authorization on the backend.

## Hide a feature

The example assumes a button that must not be visible if the user does not have the 'testPermission' permission. A directive can then be set up as follows.

```ts
    <ng-container *dhPermissionRequired="['testPermission']">
      <button>...</button>
    </ng-container>
```

## Block a route

The example assumes that a route must not be accessible if the user does not have the 'testPermission' permission. A routing guard can prevent the user from navigating to the page.

> NOTE: Hiding a (navigation) button alone does not prevent access. The user could navigate directly by URL.

```ts
  const routes: Routes = [{
    path: ...,
    canActivate: [PermissionGuard(['organization'])],
    children: [ {...} ]
  }]
```

## Ask for permission

In case of some advanced permission scenario, inject `PermissionService` and check permission manually.

```ts
class Example {
  constructor(
    private permissionService: PermissionService
  ) {}

  function do() {
    const observableBoolean = this
      .permissionService
      .hasPermission('organization');

    ...
  }
}
```

## How it works

Permissions are provided as 'roles' claim in the access token. MSAL `acquireTokenSilent` is used to request the access token. If the token is valid, it will be returned from cache; otherwise an attempt to obtain a new token will be made by the library. In case of error, no authorization will be granted to the user.

NOTE: This will change when support for switching between actors is implemented.
