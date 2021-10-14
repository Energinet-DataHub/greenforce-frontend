import { TestBed } from '@angular/core/testing';

import { browserLocationToken } from './browser-location.token';

describe('browserLocationToken', () => {
  it('provides the brower Location API', () => {
    const providedLocation = TestBed.inject(browserLocationToken);

    expect(providedLocation).toBe(location);
  });
});
