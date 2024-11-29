import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TRANSLOCO_CONFIG, TRANSLOCO_LOADER } from '@ngneat/transloco';

import { translocoProviders } from './dh-transloco.providers';

describe('translocoProviders', () => {
  it('TRANSLOCO_CONFIG is provided', () => {
    TestBed.configureTestingModule({
      providers: [translocoProviders],
    });

    const config = TestBed.inject(TRANSLOCO_CONFIG);

    expect(config?.availableLangs).not.toBeUndefined();
  });

  it(`Given HttpClient is provided
    Then TRANSLOCO_LOADER is provided`, () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [translocoProviders],
    });

    const config = TestBed.inject(TRANSLOCO_LOADER);

    expect(config).not.toBeNull();
  });
});
