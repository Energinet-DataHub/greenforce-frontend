# DataHub Release Toggle

Managing release toggles.

## Quick Start

### 1. Basic Usage in Templates

```ts
import { Component } from '@angular/core';
import { DhReleaseToggleDirective } from '@energinet-datahub/dh/shared/release-toggle';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [DhReleaseToggleDirective],
  template: `
    <!-- Single toggle -->
    <div *dhReleaseToggle="'feature-dashboard'">
      <h2>New Dashboard</h2>
      <p>This is the new dashboard feature!</p>
    </div>

    <!-- Multiple toggles (all must be enabled) -->
    <div *dhReleaseToggle="['feature-analytics', 'feature-charts']">
      <h2>Analytics Dashboard</h2>
      <p>Advanced analytics with charts</p>
    </div>

    <!-- Inverse toggle (show when disabled) -->
    <div *dhReleaseToggle="'!legacy-feature'">
      <h2>New Feature</h2>
      <p>This shows when legacy feature is disabled</p>
    </div>
  `
})
export class ExampleComponent {}
```

### 2. Route Protection

```typescript
import { Routes } from '@angular/router';
import { dhReleaseToggleGuard } from '@energinet-datahub/dh/shared/release-toggle';

export const routes: Routes = [
  {
    path: 'awesome-feature',
    component: BetaFeatureComponent,
    canActivate: [dhReleaseToggleGuard('awesome-feature-release-toggle')]
  }
];
```

## API Reference

### DhReleaseToggleDirective

A structural directive that conditionally renders content based on toggle states.

#### Syntax

```html
<element *dhReleaseToggle="expression">Content</element>
```

#### Expression Types

| Type | Example | Description |
|------|---------|-------------|
| Single Toggle | `'feature-name'` | Shows content when toggle is enabled |
| Multiple Toggles | `['toggle-a', 'toggle-b']` | Shows content when ALL toggles are enabled |
| Inverse Toggle | `'!feature-name'` | Shows content when toggle is DISABLED |
| Empty Expression | `''` | Always hides content |

#### Examples

```html
<!-- Basic feature toggle -->
<div *dhReleaseToggle="'new-ui'">
  <app-new-interface></app-new-interface>
</div>

<!-- Complex feature requiring multiple toggles -->
<div *dhReleaseToggle="['premium-features', 'analytics-module']">
  <app-premium-analytics></app-premium-analytics>
</div>

<!-- Show legacy UI when new UI is disabled -->
<div *dhReleaseToggle="'!new-ui'">
  <app-legacy-interface></app-legacy-interface>
</div>

<!-- Dynamic toggle names -->
<div *dhReleaseToggle="dynamicToggleName">
  Dynamic content
</div>
```

### DhReleaseToggleService

Injectable service for programmatic access to toggle states.

#### Methods

##### `isEnabled(name: string): boolean`

Checks if a specific toggle is enabled.

```typescript
constructor(private toggleService: DhReleaseToggleService) {}

checkFeature() {
  if (this.toggleService.isEnabled('premium-features')) {
    // Enable premium functionality
  }
}
```

##### `hasAllEnabled(names: string[]): boolean`

Checks if all specified toggles are enabled.

```typescript
const requiredToggles = ['feature-a', 'feature-b', 'feature-c'];
if (this.toggleService.hasAllEnabled(requiredToggles)) {
  // All features are available
}
```

##### `hasAnyEnabled(names: string[]): boolean`

Checks if at least one of the specified toggles is enabled.

```typescript
const optionalFeatures = ['theme-dark', 'theme-light', 'theme-auto'];
if (this.toggleService.hasAnyEnabled(optionalFeatures)) {
  // At least one theme option is available
}
```

##### `getEnabledToggles(): string[]`

Returns an array of all currently enabled toggle names.

```typescript
const enabledFeatures = this.toggleService.getEnabledToggles();
console.log('Available features:', enabledFeatures);
```

##### `refetch(): Promise<ApolloQueryResult<GetReleaseTogglesQuery>>`

Manually refreshes toggle data from the server.

```typescript
async refreshToggles() {
  try {
    await this.toggleService.refetch();
    console.log('Toggles refreshed successfully');
  } catch (error) {
    console.error('Failed to refresh toggles:', error);
  }
}
```

#### Reactive Properties

The service exposes several reactive signals for monitoring state:

```typescript
// Access toggle data
readonly toggles = computed(() => this.toggleService.toggles());

// Monitor loading state
readonly isLoading = this.toggleService.loading;

// Handle errors
readonly hasError = this.toggleService.hasError;

// Check if polling has failed
readonly pollingFailed = this.toggleService.pollingFailed;
```

### dhReleaseToggleGuard

Route guard function factory for protecting routes based on toggle states.

#### Usage

```typescript
import { dhReleaseToggleGuard } from '@energinet-datahub/dh/shared/release-toggle';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [dhReleaseToggleGuard('admin-panel')]
  },
  {
    path: 'beta',
    loadComponent: () => import('./beta/beta.component'),
    canActivate: [dhReleaseToggleGuard('beta-features')]
  }
];
```

## Configuration

### Polling Configuration

The service automatically polls for toggle updates every 60 seconds. It includes intelligent failure handling:

- **Polling Interval**: 60 seconds (configurable via `POLLING_INTERVAL_MS`)
- **Max Retries**: 10 consecutive failures before stopping (configurable via `MAX_CONSECUTIVE_RETRIES`)
- **Auto-recovery**: Resumes polling when manual `refetch()` succeeds

## Error Handling

### Service-Level Error Handling

```typescript
export class AppComponent implements OnInit {
  constructor(private toggleService: DhReleaseToggleService) {}

  ngOnInit() {
    // Monitor toggle service health
    effect(() => {
      if (this.toggleService.hasError()) {
        this.handleToggleError();
      }
      
      if (this.toggleService.pollingFailed()) {
        this.handlePollingFailure();
      }
    });
  }

  private async handleToggleError() {
    console.warn('Toggle service error detected');
    // Implement fallback behavior
  }

  private async handlePollingFailure() {
    console.error('Toggle polling has stopped');
    // Show user notification or attempt manual recovery
    try {
      await this.toggleService.refetch();
    } catch (error) {
      // Handle manual retry failure
    }
  }
}
```

### Template Error Handling

```html
<div class="app-content">
  <!-- Main content with fallbacks -->
  <div *dhReleaseToggle="'new-dashboard'; else legacyDashboard">
    <app-new-dashboard></app-new-dashboard>
  </div>
  
  <ng-template #legacyDashboard>
    <app-legacy-dashboard></app-legacy-dashboard>
  </ng-template>
  
  <!-- Error states -->
  <div *ngIf="toggleService.hasError()" class="error-banner">
    <p>Some features may be unavailable. <button (click)="retryToggles()">Retry</button></p>
  </div>
</div>
```
