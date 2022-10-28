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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { DhApiModule } from '@energinet-datahub/dh/shared/data-access-api';
import { DhChargesChargeMessagesTabComponent } from './dh-charges-charge-messages-tab.component';
import { MatNativeDateModule } from '@angular/material/core';
import { DhFeatureFlagDirectiveModule } from '@energinet-datahub/dh/shared/feature-flags';

describe('DhChargesMessagesTabComponent', () => {
  let component: DhChargesChargeMessagesTabComponent;
  let fixture: ComponentFixture<DhChargesChargeMessagesTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        getTranslocoTestingModule(),
        HttpClientModule,
        DhApiModule.forRoot(),
        MatNativeDateModule,
        DhFeatureFlagDirectiveModule,
      ],
      declarations: [DhChargesChargeMessagesTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DhChargesChargeMessagesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });
});
