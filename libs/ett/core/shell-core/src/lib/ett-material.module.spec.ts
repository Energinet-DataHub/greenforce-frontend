import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  EttMaterialModule,
  EttMaterialRootModule,
} from './ett-material.module';

describe(EttMaterialModule.name, () => {
  it(`provides ${MatSnackBar.name}`, () => {
    TestBed.configureTestingModule({
      imports: [EttMaterialModule.forRoot()],
    });

    const snackBar = TestBed.inject(MatSnackBar, null);

    expect(snackBar).not.toBeNull();
  });

  it('guards against direct import', () => {
    expect(EttMaterialModule).toGuardAgainstDirectImport();
  });
});

describe(EttMaterialRootModule.name, () => {
  it('guards against being registered in multiple injectors', () => {
    expect(EttMaterialRootModule).toGuardAgainstMultipleInjectorRegistration();
  });
});
