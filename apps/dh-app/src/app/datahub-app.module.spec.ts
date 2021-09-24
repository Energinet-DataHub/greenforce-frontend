import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { DataHubAppComponent } from './datahub-app.component';
import { DataHubAppModule } from './datahub-app.module';

function setup() {
  TestBed.configureTestingModule({
    imports: [DataHubAppModule, RouterTestingModule],
  }).compileComponents();

  let rootFixture: ComponentFixture<DataHubAppComponent>;
  const initializeRootFixture = () => {
    if (rootFixture == null) {
      rootFixture = TestBed.createComponent(DataHubAppComponent);
    }
  };

  return {
    get router() {
      initializeRootFixture();

      return TestBed.inject(Router);
    },
    run<TResult>(task: () => TResult) {
      initializeRootFixture();

      return rootFixture.ngZone == null ? task() : rootFixture.ngZone.run(task);
    },
  };
}

describe('Applicaton smoke test', () => {
  it('the application boots up', () => {
    const bootApplication = () => {
      const { router, run } = setup();

      run(() => router.initialNavigation());
    };

    expect(bootApplication).not.toThrow();
  });

  it('navigation works', async () => {
    const { router, run } = setup();

    const canNavigate = await run(() => router.navigateByUrl('/'));

    expect(canNavigate).toBe(true);
  });
});
