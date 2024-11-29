import { Component } from '@angular/core';

import { WattButtonComponent } from '../watt-button.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'storybook-button-overview',
  styles: [
    `
      .content-grid {
        display: flex;
        gap: 2rem;
        margin-bottom: 1rem;
      }
    `,
  ],
  templateUrl: './storybook-button-overview.component.html',
  imports: [WattButtonComponent],
  standalone: true,
})
export class StorybookButtonOverviewComponent {}
