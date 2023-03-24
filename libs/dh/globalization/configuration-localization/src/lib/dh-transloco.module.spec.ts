/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TRANSLOCO_CONFIG, TRANSLOCO_LOADER } from '@ngneat/transloco';

import { DhTranslocoModule, DhTranslocoRootModule } from './dh-transloco.module';

describe(DhTranslocoModule.name, () => {
  it('TRANSLOCO_CONFIG is provided', () => {
    TestBed.configureTestingModule({
      imports: [DhTranslocoModule.forRoot()],
    });

    const config = TestBed.inject(TRANSLOCO_CONFIG, null);

    expect(config).not.toBeNull();
  });

  it(`Given HttpClient is provided
    Then TRANSLOCO_LOADER is provided`, () => {
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
