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
