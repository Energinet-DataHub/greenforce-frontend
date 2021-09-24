import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ShellComponent as WattShellComponent } from '@energinet/watt';

import { ShellComponent } from './shell.component';
import { ShellModule } from './shell.module';

describe(ShellComponent.name, () => {
  let fixture: ComponentFixture<ShellComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ShellModule, NoopAnimationsModule],
      }).compileComponents();
    })
  );

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
