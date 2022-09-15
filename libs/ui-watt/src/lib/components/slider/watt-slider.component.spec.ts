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
import { WattSliderModule } from './watt-slider.module';
import { WattSliderComponent } from './watt-slider.component';
import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

describe(WattSliderComponent.name, () => {
  it('renders', async () => {
    @Component({
      template: `<watt-slider></watt-slider>`,
    })
    class TestComponent {}

    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [WattSliderModule],
    });

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const sliders = fixture.debugElement.queryAll(By.css('[role="slider"]'));

    expect(sliders).toHaveLength(2);
  });
});
