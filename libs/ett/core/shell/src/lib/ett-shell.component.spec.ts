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
import { WattShellComponent } from '@energinet-datahub/watt';
import { AuthOidcHttp, GetProfileResponse, UserProfile } from '@energinet-datahub/ett/auth/data-access-api';
import { of } from 'rxjs';
import { MockService } from 'ng-mocks';

import { EttShellComponent, EttShellScam } from './ett-shell.component';


describe(EttShellComponent.name, () => {
  beforeEach(() => {
    const profile = {
      id: '123',
      name: 'Mock',
      company: 'Energinet'
    } as UserProfile;

    const response = {
      success: true,
      profile: profile,
    } as GetProfileResponse;

    mockAuthOidcHttp = MockService(AuthOidcHttp);

    (mockAuthOidcHttp.getProfile as jest.Mock).mockReturnValue(of(response));

    TestBed.configureTestingModule({
      imports: [EttShellScam],
      providers: [
        {
          provide: AuthOidcHttp,
          useValue: mockAuthOidcHttp,
        }
      ]
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
