import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { DataHubAppComponent } from './datahub-app.component';
import { DataHubAppModule } from './datahub-app.module';

describe('Application smoke test', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DataHubAppModule, NoopAnimationsModule, RouterTestingModule],
    }).compileComponents();

    rootFixture = TestBed.createComponent(DataHubAppComponent);
    router = TestBed.inject(Router);

    rootFixture.autoDetectChanges(true);
  });

  let rootFixture: ComponentFixture<DataHubAppComponent>;
  let router: Router;

  it('navigation works', async () => {
    expect.assertions(1);

    const whenNavigatedToDefaultRoute = rootFixture.ngZone?.run(() =>
      router.navigateByUrl('/')
    );

    await expect(whenNavigatedToDefaultRoute).resolves.toBe(true);
  });
});
