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
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';

import { render, screen } from '@testing-library/angular';

import {
  getTranslocoTestingModule,
  provideMsalTesting,
} from '@energinet-datahub/dh/shared/test-util';
import { danishDatetimeProviders } from '@energinet/watt/danish-date-time';
import { WattModalService } from '@energinet/watt/modal';
import { dhAppEnvironmentToken } from '@energinet-datahub/dh/shared/environments';

import { DhSearchComponent } from '../src/components/dh-search.component';

function createPasteEvent(): ClipboardEvent {
  return new ClipboardEvent('paste');
}

function createPasteEventWithText(text: string): ClipboardEvent {
  const event = new ClipboardEvent('paste', {
    clipboardData: new DataTransfer(),
    cancelable: true,
  });
  // happy-dom's DataTransfer may not fully support setData/getData,
  // so we override getData to return the desired text.
  vi.spyOn(event.clipboardData!, 'getData').mockReturnValue(text);
  return event;
}

async function setup() {
  const { fixture } = await render(DhSearchComponent, {
    providers: [
      provideHttpClient(withInterceptorsFromDi()),
      danishDatetimeProviders,
      provideMsalTesting(),
      WattModalService,
      { provide: ComponentFixtureAutoDetect, useValue: true },
      { provide: dhAppEnvironmentToken, useValue: { current: 'test' } },
    ],
    imports: [getTranslocoTestingModule()],
  });

  return fixture;
}

describe('DhSearchComponent paste handling', () => {
  it('should strip leading apostrophe from Excel paste', async () => {
    const fixture = await setup();
    const component = fixture.componentInstance;

    const event = createPasteEventWithText("'570715000000458323");
    component.onPaste(event);

    expect(component.searchControl.value).toBe('570715000000458323');
    expect(event.defaultPrevented).toBe(true);
  });

  it('should strip all non-digit characters', async () => {
    const fixture = await setup();
    const component = fixture.componentInstance;

    const event = createPasteEventWithText('  570 715 000 000 458 323  ');
    component.onPaste(event);

    expect(component.searchControl.value).toBe('570715000000458323');
  });

  it('should truncate to 18 digits', async () => {
    const fixture = await setup();
    const component = fixture.componentInstance;

    const event = createPasteEventWithText('5707150000004583231234');
    component.onPaste(event);

    expect(component.searchControl.value).toBe('570715000000458323');
    expect(component.searchControl.value.length).toBe(18);
  });

  it('should allow default paste when clipboardData has no text', async () => {
    const fixture = await setup();
    const component = fixture.componentInstance;

    const event = createPasteEvent();
    component.onPaste(event);

    expect(event.defaultPrevented).toBe(false);
  });

  it('should handle plain numeric paste without modification', async () => {
    const fixture = await setup();
    const component = fixture.componentInstance;

    const event = createPasteEventWithText('570715000000458323');
    component.onPaste(event);

    expect(component.searchControl.value).toBe('570715000000458323');
  });
});
