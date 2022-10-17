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

import { DhDrawerDatepickerComponent } from './dh-drawer-datepicker.component';

describe('DrawerDatepickerComponent', () => {
  let component: DhDrawerDatepickerComponent;
  let fixture: ComponentFixture<DhDrawerDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DhDrawerDatepickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DhDrawerDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it.todo('initial date values should contain dates');
  it.todo('changes to date values should sync to subscribers');
  it.todo('changes to chip state should sync to subscribers');
  it.todo('should have 5 chips with values "d", "w", "m", "q", "y"');
});
