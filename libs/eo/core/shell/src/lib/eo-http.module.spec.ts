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
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { EoHttpModule, EoHttpRootModule } from './eo-http.module';

describe(EoHttpModule.name, () => {
  it(`provides ${HttpClient.name}`, () => {
    // Arrange
    TestBed.configureTestingModule({
      imports: [EoHttpModule.forRoot()],
    });

    // Act
    const http = TestBed.inject(HttpClient, null);

    // Assert
    expect(http).not.toBeNull();
  });

  it('guards against direct import', () => {
    // Assert
    expect(EoHttpModule).toGuardAgainstDirectImport();
  });
});

describe(EoHttpRootModule.name, () => {
  it('guards against being registered in multiple injectors', () => {
    // Assert
    expect(EoHttpRootModule).toGuardAgainstMultipleInjectorRegistration();
  });
});
