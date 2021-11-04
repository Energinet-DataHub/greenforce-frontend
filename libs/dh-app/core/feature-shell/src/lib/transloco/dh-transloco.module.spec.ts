import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import {
  DhTranslocoModule,
  DhTranslocoRootModule,
} from './dh-transloco.module';

describe(DhTranslocoModule.name, () => {
  it(`provides ${HttpClient.name}`, () => {
    TestBed.configureTestingModule({
      imports: [DhTranslocoModule.forRoot()],
    });

    const http = TestBed.inject(HttpClient, null);

    expect(http).not.toBeNull();
  });

  it('guards against direct import', () => {
    expect(DhTranslocoModule).toGuardAgainstDirectImport();
  });

  it('guards against being registered in multiple injectors', () => {
    expect(DhTranslocoRootModule).toGuardAgainstMultipleInjectorRegistration();
  });
});
