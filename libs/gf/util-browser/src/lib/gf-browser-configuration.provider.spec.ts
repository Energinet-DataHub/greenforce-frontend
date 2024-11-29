import { APP_BASE_HREF } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { browserConfigurationProviders } from './gf-browser-configuration.provider';

describe('browserConfigurationProviders', () => {
  it('APP_BASE_HREF is not provided when the BrowserConfigurationProviders are missing', () => {
    const actualAppBaseHref = TestBed.inject(APP_BASE_HREF, null, {});
    expect(actualAppBaseHref).toBeNull();
  });

  it('APP_BASE_HREF is provided', () => {
    TestBed.configureTestingModule({
      providers: [browserConfigurationProviders],
    });

    const actualAppBaseHref = TestBed.inject(APP_BASE_HREF);
    expect(actualAppBaseHref).not.toBeNull();
  });
});
