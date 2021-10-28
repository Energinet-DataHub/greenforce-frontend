import { NgModule } from '@angular/core';

import { WattButtonModule } from '../../button/watt-button.module';
import { WattEmptyStateModule } from '../empty-state.module';
import { StorybookEmptyStateOverviewComponent } from './storybook-empty-state-overview.component';

@NgModule({
  declarations: [StorybookEmptyStateOverviewComponent],
  exports: [StorybookEmptyStateOverviewComponent],
  imports: [WattEmptyStateModule, WattButtonModule],
})
export class StorybookEmptyStateOverviewModule {}
