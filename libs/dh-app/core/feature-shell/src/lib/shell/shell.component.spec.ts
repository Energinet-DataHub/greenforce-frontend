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
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ShellComponent as WattShellComponent } from '@energinet/watt';

import { ShellComponent } from './shell.component';
import { ShellModule } from './shell.module';

describe(ShellComponent.name, () => {
  let fixture: ComponentFixture<ShellComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ShellModule, NoopAnimationsModule, RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShellComponent);
    fixture.detectChanges();
  });

  it('renders a shell component from Watt Design System', () => {
    const { componentInstance: shellComponent } = fixture.debugElement.query(
      By.directive(WattShellComponent)
    );

    expect(shellComponent).toBeInstanceOf(WattShellComponent);
  });
});
