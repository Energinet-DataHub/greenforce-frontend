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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { WattShellComponent } from '@energinet-datahub/watt/shell';
import { EoShellComponent } from './eo-shell.component';

describe(EoShellComponent.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        EoShellComponent,
        // Because of primary navigation relying on AuthHttp
        HttpClientTestingModule,
        MatDialogModule,
      ],
    });

    fixture = TestBed.createComponent(EoShellComponent);
  });

  let fixture: ComponentFixture<EoShellComponent>;

  it('displays the Watt shell', () => {
    // Assert
    const wattShell = fixture.debugElement.query(By.directive(WattShellComponent));
    expect(wattShell.componentInstance).toBeInstanceOf(WattShellComponent);
  });
});
