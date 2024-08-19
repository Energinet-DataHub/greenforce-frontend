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
import { By } from '@angular/platform-browser';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { render, RenderResult } from '@testing-library/angular';

import { danishDatetimeProviders } from '@energinet-datahub/watt/core/datetime';
import { WattShellComponent } from '@energinet-datahub/watt/shell';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { MsalServiceMock } from '@energinet-datahub/dh/shared/test-util-auth';

import { DhCoreShellComponent } from './dh-core-shell.component';
import { WattModalService } from '@energinet-datahub/watt/modal';
import { MatDialogModule } from '@angular/material/dialog';
import { importProvidersFrom } from '@angular/core';
import { ApolloModule } from 'apollo-angular';

describe(DhCoreShellComponent, () => {
  beforeEach(async () => {
    view = await render(DhCoreShellComponent, {
      imports: [getTranslocoTestingModule(), ApolloModule],
      providers: [
        MsalServiceMock,
        danishDatetimeProviders,
        WattModalService,
        provideHttpClientTesting(),
        importProvidersFrom([MatDialogModule]),
      ],
    });
  });

  let view: RenderResult<DhCoreShellComponent>;

  it('displays the Watt shell', () => {
    const wattShell = view.fixture.debugElement.query(By.directive(WattShellComponent));

    expect(wattShell.componentInstance).toBeInstanceOf(WattShellComponent);
  });
});
