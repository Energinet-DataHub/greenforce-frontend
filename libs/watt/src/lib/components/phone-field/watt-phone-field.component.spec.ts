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
import { WattPhoneFieldComponent } from './';
import { FormControl } from '@angular/forms';
import { input } from '@angular/core';

describe(WattPhoneFieldComponent, () => {
  let component: WattPhoneFieldComponent;
  let fixture: ComponentFixture<WattPhoneFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WattPhoneFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WattPhoneFieldComponent);
    component = fixture.componentInstance;
    component.formControl = input(new FormControl());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
