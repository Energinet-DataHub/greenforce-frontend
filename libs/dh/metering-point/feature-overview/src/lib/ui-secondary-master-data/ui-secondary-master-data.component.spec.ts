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
 import { render, screen } from '@testing-library/angular';
 import { MatcherOptions } from '@testing-library/dom';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { 
  MeteringPointCimDto,
  DisconnectionType
} from '@energinet-datahub/dh/shared/data-access-api';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { en as enTranslations } from '@energinet-datahub/dh/globalization/assets-localization';
import { runOnPushChangeDetection } from '@energinet-datahub/dh/shared/test-util-metering-point';

import {
  UiSecondaryMasterDataComponent,
  UiSecondaryMasterDataComponentScam,
} from './ui-secondary-master-data.component';
import { emDash } from '../identity/em-dash';

describe('UiSecondaryMasterDataComponent', () => {
  let component: UiSecondaryMasterDataComponent;
  let fixture: ComponentFixture<UiSecondaryMasterDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiSecondaryMasterDataComponent],
      imports: [
        UiSecondaryMasterDataComponentScam,
        getTranslocoTestingModule(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiSecondaryMasterDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe(UiSecondaryMasterDataComponent.name, () => {
  async function setup(secondaryMasterData: MeteringPointCimDto) {
    const { fixture } = await render(UiSecondaryMasterDataComponent, {
      componentProperties: {
        secondaryMasterData,
      },
      imports: [UiSecondaryMasterDataComponentScam, getTranslocoTestingModule()],
    });

    runOnPushChangeDetection(fixture);
  }

  describe('disconnection type', () => {
    it('displays correct value', async () => {
      const disconnectionType: DisconnectionType = 'D01';
      const secondaryMasterData: Partial<MeteringPointCimDto> = {
        disconnectionType
      };
      await setup(secondaryMasterData);
      const disableQuerySuggestions: MatcherOptions = { suggest: false };
      const actualDisconnectionType = screen.getByTestId("disconnectionType", disableQuerySuggestions).textContent;
      const expectedDisconnectionType = enTranslations.meteringPoint.disconnectionType[disconnectionType];
      expect(actualDisconnectionType).toContain(expectedDisconnectionType)
    });

    it('displays fallback value when undefined', async () => {
      const secondaryMasterData: Partial<MeteringPointCimDto> = {
        disconnectionType: undefined
      };
      await setup(secondaryMasterData);
      const disableQuerySuggestions: MatcherOptions = { suggest: false };
      const actualDisconnectionType = screen.getByTestId("disconnectionType", disableQuerySuggestions).textContent;
      expect(actualDisconnectionType).toBe(emDash)
    });
  }); 
});