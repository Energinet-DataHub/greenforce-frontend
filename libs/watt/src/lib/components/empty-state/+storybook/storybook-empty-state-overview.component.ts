import { Component } from '@angular/core';
import { WattEmptyStateComponent } from '../empty-state.component';
import { WattButtonComponent } from '../../button';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'storybook-empty-state-overview',
  templateUrl: './storybook-empty-state-overview.component.html',
  styleUrls: ['./storybook-empty-state-overview.component.scss'],
  standalone: true,
  imports: [WattEmptyStateComponent, WattButtonComponent],
})
export class StorybookEmptyStateOverviewComponent {}
