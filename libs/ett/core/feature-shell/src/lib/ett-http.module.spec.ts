import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { EttHttpModule, EttHttpRootModule } from './ett-http.module';

describe(EttHttpModule.name, () => {
  it(`provides ${HttpClient.name}`, () => {
    TestBed.configureTestingModule({
      imports: [EttHttpModule.forRoot()],
    });

    const http = TestBed.inject(HttpClient, null);

    expect(http).not.toBeNull();
  });

  it('guards against direct import', () => {
    expect(EttHttpModule).toGuardAgainstDirectImport();
  });
});

describe(EttHttpRootModule.name, () => {
  it('guards against being registered in multiple injectors', () => {
    expect(EttHttpRootModule).toGuardAgainstMultipleInjectorRegistration();
  });
});
