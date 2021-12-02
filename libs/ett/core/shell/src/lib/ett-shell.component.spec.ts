/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  AuthOidcHttp,
  AuthProfile,
  AuthProfileResponse,
} from '@energinet-datahub/ett/auth/data-access-api';
import { WattShellComponent } from '@energinet-datahub/watt';
import { render, RenderResult } from '@testing-library/angular';
import { MockService } from 'ng-mocks';
import { of } from 'rxjs';

import { EttShellComponent, EttShellScam } from './ett-shell.component';

describe(EttShellComponent.name, () => {
  beforeEach(() => {
    const profile: AuthProfile = {
      id: '123',
      name: 'Mock',
      company: 'Energinet',
    };

    const response = {
      success: true,
      profile: profile,
    } as AuthProfileResponse;

    mockAuthOidcHttp = MockService(AuthOidcHttp);

    (mockAuthOidcHttp.getProfile as jest.Mock).mockReturnValue(of(response));

    TestBed.configureTestingModule({
      imports: [EttShellScam],
      providers: [
        {
          provide: AuthOidcHttp,
          useValue: mockAuthOidcHttp,
        },
      ],
    });

    fixture = TestBed.createComponent(EttShellComponent);
  });

  let fixture: ComponentFixture<EttShellComponent>;
  let mockAuthOidcHttp: AuthOidcHttp;

  it('displays the Watt shell', () => {
    const wattShell = fixture.debugElement.query(
      By.directive(WattShellComponent)
    );

    expect(wattShell.componentInstance).toBeInstanceOf(WattShellComponent);
  });
});

describe(EttShellComponent.name, () => {
  beforeEach(async () => {
    const profile: AuthProfile = {
      id: '123',
      name: profileName,
      company: 'Energinet',
    };

    const response = {
      success: true,
      profile: profile,
    } as AuthProfileResponse;

    mockAuthOidcHttp = MockService(AuthOidcHttp);

    (mockAuthOidcHttp.getProfile as jest.Mock).mockReturnValue(of(response));

    view = await render(EttShellComponent, {
      imports: [EttShellScam],
      providers: [
        {
          provide: AuthOidcHttp,
          useValue: mockAuthOidcHttp,
        },
      ],
    });
  });

  let view: RenderResult<EttShellComponent, EttShellComponent>;
  let mockAuthOidcHttp: AuthOidcHttp;
  const profileName = 'Mock User';

  it("displays the user's name", async () => {
    expect(
      await view.findByRole('button', {
        name: new RegExp(profileName, 'i'),
      })
    ).toBeInTheDocument();
  });
});
