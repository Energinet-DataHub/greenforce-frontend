import { APP_BASE_HREF } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { EttBrowserConfigurationModule } from './ett-browser-configuration.module';

describe(EttBrowserConfigurationModule.name, () => {
  it('APP_BASE_HREF is not provided when the Angular module is not imported', () => {
    const actualAppBaseHref = TestBed.inject(APP_BASE_HREF, null);
    expect(actualAppBaseHref).toBeNull();
  });

  it('APP_BASE_HREF is provided when the Angular module is imported', () => {
    TestBed.configureTestingModule({
      imports: [EttBrowserConfigurationModule],
    });

    const actualAppBaseHref = TestBed.inject(APP_BASE_HREF, null);
    expect(actualAppBaseHref).not.toBeNull();
  });
});
