
import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { Component } from '@angular/core';
import { Router, RouterModule, provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';

import { WATT_BREADCRUMBS, WattBreadcrumbsComponent } from './watt-breadcrumbs.component';

// Test route components
const ROUTE_PREFIX = 'Route:';

@Component({
  standalone: true,
  template: `${ROUTE_PREFIX}Overview`
})
class OverviewComponent {}

@Component({
  standalone: true,
  template: `${ROUTE_PREFIX}Components`
})
class ComponentsComponent {}

@Component({
  standalone: true,
  template: `${ROUTE_PREFIX}Breadcrumbs`
})
class BreadcrumbsRouteComponent {}

describe(WattBreadcrumbsComponent.name, () => {
  async function setup(clickSpy?: () => void) {
    @Component({
      standalone: true,
      imports: [RouterModule, WATT_BREADCRUMBS],
      template: `
        <p>"Components" has a click handler, see "Actions" tab.</p>
        <p>"Breadcrumbs" has a routerLink.</p>
        <p>"Overview" has neither.</p>
        <br>

        <watt-breadcrumbs>
          <watt-breadcrumb (click)="onClick()">Components</watt-breadcrumb>
          <watt-breadcrumb [routerLink]="['breadcrumbs']">Breadcrumbs</watt-breadcrumb>
          <watt-breadcrumb>Overview</watt-breadcrumb>
        </watt-breadcrumbs>

        <br>
        <router-outlet></router-outlet>
      `
    })
    class TestComponent {
      onClick = clickSpy || (() => { /* noop */ });
    }

    const result = await render(TestComponent, {
      providers: [
        provideLocationMocks(),
        provideRouter([
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          { path: 'components', component: ComponentsComponent },
          { path: 'breadcrumbs', component: BreadcrumbsRouteComponent },
          { path: 'overview', component: OverviewComponent }
        ])
      ]
    });

    // Perform initial navigation
    const router = result.fixture.debugElement.injector.get(Router);
    router.initialNavigation();

    return result;
  }

  const getSeperators = () => screen.getAllByRole('img'); // role of watt-icon is img
  const getBreadcrumbWithRouterLink = () => screen.queryByText('Breadcrumbs');
  const getBreadcrumbWithClick = () => screen.queryByText('Components');
  const getNoninteractiveBreadcrumb = () => screen.queryByText('Overview');

  it('should render correct amount of seperators', async () => {
    await setup();
    expect(getSeperators()).toHaveLength(2);
  });

  it('should render correct amount of links', async () => {
    await setup();
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('should not render "Overview" as link', async () => {
    await setup();
    expect(getNoninteractiveBreadcrumb()).not.toHaveAttribute('role', 'link');
  });

  it('should mark breadcrumb with [routerLink] as interactive', async () => {
    await setup();
    expect(getBreadcrumbWithRouterLink()).toHaveClass('interactive');
  });

  it('should mark breadcrumb with (click) as interactive', async () => {
    await setup();
    expect(getBreadcrumbWithClick()).toHaveClass('interactive');
  });

  it('should navigate on click, when routerLink is added', async () => {
    await setup();
    
    // Initially should show overview route
    await waitFor(() => {
      expect(screen.getByText(`${ROUTE_PREFIX}Overview`)).toBeInTheDocument();
    });

    userEvent.click(getBreadcrumbWithRouterLink() as HTMLElement);
    
    // Should navigate to breadcrumbs route
    await waitFor(() => {
      expect(screen.getByText(`${ROUTE_PREFIX}Breadcrumbs`)).toBeInTheDocument();
    });
    
    // Overview route should be removed
    expect(screen.queryByText(`${ROUTE_PREFIX}Overview`)).not.toBeInTheDocument();
  });

  it('should trigger click callback, when (click) is added', async () => {
    const mockFn = vi.fn();
    await setup(mockFn);

    userEvent.click(getBreadcrumbWithClick() as HTMLElement);

    expect(mockFn).toHaveBeenCalled();
  });
});
