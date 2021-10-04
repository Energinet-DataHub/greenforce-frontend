import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { WattButtonModule } from './watt-button.module';

describe(WattButtonModule.name, () => {
  function setup(template: string) {
    @Component({
      template,
    })
    class TestHostComponent {}

    TestBed.configureTestingModule({
      declarations: [TestHostComponent],
      imports: [WattButtonModule],
    });

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    return {
      fixture,
    };
  }

  it('exports shared Watt Design System buttons', () => {
    const text = 'Primary button';
    const template = `
      <watt-button type="primary">
        ${text}
      </watt-button>
    `;
    const { fixture } = setup(template);

    expect(fixture.nativeElement.textContent).toContain(text);
  });
});
