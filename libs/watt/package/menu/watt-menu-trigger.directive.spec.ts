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
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { WattMenuComponent } from './watt-menu.component';
import { WattMenuItemComponent } from './watt-menu-item.component';
import { WattMenuTriggerDirective } from './watt-menu-trigger.directive';

@Component({
  imports: [WattMenuComponent, WattMenuItemComponent, WattMenuTriggerDirective],
  template: `
    <button [wattMenuTriggerFor]="menu">Open Menu</button>
    <watt-menu #menu>
      <watt-menu-item>Option 1</watt-menu-item>
      <watt-menu-item>Option 2</watt-menu-item>
    </watt-menu>
  `,
})
class TestComponent {}

describe('WattMenuTriggerDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let triggerDirective: WattMenuTriggerDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        WattMenuComponent,
        WattMenuItemComponent,
        WattMenuTriggerDirective,
        TestComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const triggerElement = fixture.debugElement.query(By.directive(WattMenuTriggerDirective));
    triggerDirective = triggerElement.injector.get(WattMenuTriggerDirective);
  });

  it('should create', () => {
    expect(triggerDirective).toBeTruthy();
  });

  it('should have menu closed initially', () => {
    expect(triggerDirective.menuOpen).toBe(false);
  });

  it('should open menu when trigger is clicked', () => {
    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();
    fixture.detectChanges();

    expect(triggerDirective.menuOpen).toBe(true);
  });

  it('should toggle menu state', () => {
    expect(triggerDirective.menuOpen).toBe(false);

    triggerDirective.toggleMenu();
    fixture.detectChanges();
    expect(triggerDirective.menuOpen).toBe(true);

    triggerDirective.toggleMenu();
    fixture.detectChanges();
    expect(triggerDirective.menuOpen).toBe(false);
  });
});
