# Test staging utilities

Call these functions in your project's `test-setup.ts`.

Default testing configurations for:
| Technology | API | Description |
| ---------- | --- | ----------- |
| Angular Material | `setUpTestbed` | Disable theme check because it always fails in Jest tests.<br>Fake the icon registry to enable verification of SVG icons. |
| Angular Testing Library | `setUpAngularTestingLibrary` | Assume SCAMs and require semantic queries. |
| ng-mocks | `setUpNgMocks` | Support Jest. |
| RxAngular Template | `setUpTestbed` | Support Jest. |
| The Angular testbed | `setUpTestbed` | Use Angular testing module teardown.<br>Use automatic change detection in tests.<br>Disable animations, provide `APP_BASE_HREF` at runtime, and isolate routing from the DOM. |
