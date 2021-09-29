import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterOutlet } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { DataHubAppComponent } from './datahub-app.component';
import { DataHubAppModule } from './datahub-app.module';

describe(DataHubAppComponent.name, () => {
  let fixture: ComponentFixture<DataHubAppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DataHubAppModule, NoopAnimationsModule, RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataHubAppComponent);
    fixture.detectChanges();
  });

  it('has a router outlet', () => {
    const { componentInstance: routerOutletHost } = fixture.debugElement.query(
      By.directive(RouterOutlet)
    );

    expect(routerOutletHost).toBeInstanceOf(DataHubAppComponent);
  });
});
