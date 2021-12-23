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
import { ConnectionState, MeteringPointSimpleCimDto, MeteringPointType } from '@energinet-datahub/dh/shared/data-access-api';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { runOnPushChangeDetection } from '@energinet-datahub/dh/shared/test-util-metering-point';
import { render, screen } from '@testing-library/angular';
import { MatcherOptions } from '@testing-library/dom';
import { en as enTranslations } from '@energinet-datahub/dh/globalization/assets-localization';

import { DhChildMeteringPointComponent, DhChildMeteringPointComponentScam } from './dh-child-metering-point.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';

describe('DhChildMeteringPointComponent', () => {
  let component: DhChildMeteringPointComponent;
  let fixture: ComponentFixture<DhChildMeteringPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DhChildMeteringPointComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DhChildMeteringPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

const TestData: MeteringPointSimpleCimDto[] = [
  {
    gsrnNumber: '2',
    effectiveDate: '2020-01-02T00:00:00Z',
    connectionState: ConnectionState.D03,
    meteringPointId: '20',
    meteringPointType: MeteringPointType.D01,
  },
  {
    gsrnNumber: '3',
    effectiveDate: '2020-04-01T00:00:00Z',
    connectionState: ConnectionState.D02,
    meteringPointId: '30',
    meteringPointType: MeteringPointType.D02,
  },
  {
    gsrnNumber: '1',
    effectiveDate: '2020-01-03T00:00:00Z',
    connectionState: ConnectionState.E22,
    meteringPointId: '10',
    meteringPointType: MeteringPointType.D09,
  }
];

describe(DhChildMeteringPointComponent.name, () => {
  async function setup(childMeteringPoints: Array<MeteringPointSimpleCimDto>) {
    const { fixture } = await render(DhChildMeteringPointComponent, {
      componentProperties: {
        sortedData: childMeteringPoints,
        childMeteringPoints
      },
      imports: [
        DhChildMeteringPointComponentScam,
        getTranslocoTestingModule(),
        MatTableModule,
        MatSortModule
      ],
    });
    runOnPushChangeDetection(fixture);
  }

  describe('do things', () => {
    it('do stuff', async () => {
      const childMeteringPoints: Array<MeteringPointSimpleCimDto> = TestData;
      
      await setup(childMeteringPoints);

      const disableQuerySuggestions: MatcherOptions = { suggest: false };
      const actualMeteringPointType = screen.getAllByTestId('gsrn', disableQuerySuggestions);
      const firstRow = actualMeteringPointType[0].textContent;
      
      expect(firstRow).toContain('2');
      expect(actualMeteringPointType.length).toBe(3);
    });
  });
});
