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
import { WattMenuGroupComponent } from './watt-menu-group.component';
import { WattMenuTriggerDirective } from './watt-menu-trigger.directive';

@Component({
  standalone: true,
  imports: [WattMenuComponent, WattMenuItemComponent, WattMenuTriggerDirective],
  template: `
    <button [wattMenuTriggerFor]="menu">Open Menu</button>
    <watt-menu #menu>
      <watt-menu-item>Option 1</watt-menu-item>
      <watt-menu-item [disabled]="true">Option 2 (disabled)</watt-menu-item>
      <watt-menu-item>Option 3</watt-menu-item>
    </watt-menu>
  `,
})
class TestComponent {}

@Component({
  standalone: true,
  imports: [
    WattMenuComponent,
    WattMenuItemComponent,
    WattMenuGroupComponent,
    WattMenuTriggerDirective,
  ],
  template: `
    <button [wattMenuTriggerFor]="menu">Open Menu</button>
    <watt-menu #menu>
      <watt-menu-group label="Group 1">
        <watt-menu-item>Option 1.1</watt-menu-item>
        <watt-menu-item>Option 1.2</watt-menu-item>
      </watt-menu-group>
      <watt-menu-group label="Group 2">
        <watt-menu-item>Option 2.1</watt-menu-item>
        <watt-menu-item>Option 2.2</watt-menu-item>
      </watt-menu-group>
    </watt-menu>
  `,
})
class TestWithGroupsComponent {}

describe('WattMenuComponent', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        WattMenuComponent,
        WattMenuItemComponent,
        WattMenuGroupComponent,
        TestComponent,
        TestWithGroupsComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have menu component', () => {
    const menuElement = fixture.debugElement.query(By.directive(WattMenuComponent));
    expect(menuElement).toBeTruthy();
    expect(menuElement.componentInstance).toBeInstanceOf(WattMenuComponent);
  });

  it('should have menu trigger', () => {
    const triggerElement = fixture.debugElement.query(By.directive(WattMenuTriggerDirective));
    expect(triggerElement).toBeTruthy();
  });

  it('should expose mat-menu instance', () => {
    const menuElement = fixture.debugElement.query(By.directive(WattMenuComponent));
    const menu = menuElement.componentInstance.menu();
    expect(menu).toBeTruthy();
  });
});

describe('WattMenuComponent with groups', () => {
  let fixture: ComponentFixture<TestWithGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        WattMenuComponent,
        WattMenuItemComponent,
        WattMenuGroupComponent,
        TestWithGroupsComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestWithGroupsComponent);
    fixture.detectChanges();
  });

  it('should render menu groups with headings', () => {
    const trigger = fixture.debugElement.query(By.css('button'));
    trigger.nativeElement.click();
    fixture.detectChanges();

    const groupHeadings = fixture.debugElement.queryAll(By.css('.watt-menu-group-heading'));
    expect(groupHeadings.length).toBe(2);
    expect(groupHeadings[0].nativeElement.textContent).toBe('Group 1');
    expect(groupHeadings[1].nativeElement.textContent).toBe('Group 2');
  });
});
