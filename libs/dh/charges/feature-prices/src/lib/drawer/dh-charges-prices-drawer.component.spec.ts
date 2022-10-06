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

import { DhChargesPricesDrawerComponent } from './dh-charges-prices-drawer.component';

describe('DhChargesPricesDrawerComponent', () => {
  let component: DhChargesPricesDrawerComponent;
  let fixture: ComponentFixture<DhChargesPricesDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DhChargesPricesDrawerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DhChargesPricesDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
