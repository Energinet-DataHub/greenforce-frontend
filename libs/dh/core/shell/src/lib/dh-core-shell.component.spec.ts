//#region License
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
//#endregion
import { By } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { render, RenderResult } from '@testing-library/angular';
import { provideRouter } from '@angular/router';

import { graphQLProvider } from '@energinet-datahub/dh/shared/data-access-graphql';

import { danishDatetimeProviders } from '@energinet/watt/danish-date-time';
import { WattShellComponent } from '@energinet/watt/shell';
import {
  getTranslocoTestingModule,
  provideMsalTesting,
} from '@energinet-datahub/dh/shared/test-util';
import { WattModalService } from '@energinet/watt/modal';

import { DhCoreShellComponent } from './dh-core-shell.component';

describe(DhCoreShellComponent, () => {
  beforeEach(async () => {
    view = await render(DhCoreShellComponent, {
      imports: [getTranslocoTestingModule()],
      providers: [
        provideMsalTesting(),
        danishDatetimeProviders,
        WattModalService,
        provideHttpClient(),
        provideHttpClientTesting(),
        graphQLProvider,
        provideRouter([]),
      ],
    });
  });

  let view: RenderResult<DhCoreShellComponent>;

  it('displays the Watt shell', () => {
    const wattShell = view.fixture.debugElement.query(By.directive(WattShellComponent));

    expect(wattShell.componentInstance).toBeInstanceOf(WattShellComponent);
  });
});
