# Test staging utilities

Call these functions in the project's `test-setup.ts`.

As a minimum, we must always call `setUpTestbed` to ensure consistent test runs.
Other test staging functions are called based on what is needed by the project's
test suites.

Default testing configurations for:
| Technology | API | Description |
| ---------- | --- | ----------- |
| Angular Material | `setUpTestbed` | Disable theme check because it always fails in Jest tests.<br>Fake the icon registry to enable verification of SVG icons. |
| Angular Testing Library | `setUpAngularTestingLibrary` | Assume SCAMs and require semantic queries. |
| ng-mocks | `setUpNgMocks` | Support Jest. |
| RxAngular Template | `setUpTestbed` | Support Jest. |
| The Angular testbed | `setUpTestbed` | Use Angular testing module teardown.<br>Use automatic change detection in tests.<br>Disable animations, provide `APP_BASE_HREF` at runtime, and isolate routing from the DOM. |
