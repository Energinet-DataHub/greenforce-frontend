import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TRANSLOCO_CONFIG, TRANSLOCO_LOADER } from '@ngneat/transloco';

import {
  DhTranslocoModule,
  DhTranslocoRootModule,
} from './dh-transloco.module';

describe(DhTranslocoModule.name, () => {
  it('provides TRANSLOCO_CONFIG', () => {
    TestBed.configureTestingModule({
      imports: [DhTranslocoModule.forRoot()],
    });

    const config = TestBed.inject(TRANSLOCO_CONFIG, null);

    expect(config).not.toBeNull();
  });

  it(`Given HttpClient is provided
    Then it provides TRANSLOCO_LOADER`, () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, DhTranslocoModule.forRoot()],
    });

    const config = TestBed.inject(TRANSLOCO_LOADER, null);

    expect(config).not.toBeNull();
  });

  it('guards against direct import', () => {
    expect(DhTranslocoModule).toGuardAgainstDirectImport();
  });

  it('guards against being registered in multiple injectors', () => {
    expect(DhTranslocoRootModule).toGuardAgainstMultipleInjectorRegistration();
  });
});
