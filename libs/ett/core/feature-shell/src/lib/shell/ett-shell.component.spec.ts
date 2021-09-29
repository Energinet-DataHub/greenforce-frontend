import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ShellComponent as WattShellComponent } from '@energinet/watt';

import { EttShellComponent, EttShellScam } from './ett-shell.component';

describe(EttShellComponent.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EttShellScam, NoopAnimationsModule, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(EttShellComponent);
  });

  let fixture: ComponentFixture<EttShellComponent>;

  it('displays the Watt shell', () => {
    const wattShell = fixture.debugElement.query(
      By.directive(WattShellComponent)
    );

    expect(wattShell.componentInstance).toBeInstanceOf(WattShellComponent);
  });
});
