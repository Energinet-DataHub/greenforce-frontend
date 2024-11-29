import { Component, Input, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

import { WattButtonComponent } from '../../button';
import { WattToastService } from '../watt-toast.service';
import { WattToastComponent, WattToastConfig } from '../watt-toast.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'storybook-toast',
  templateUrl: './storybook-toast.html',
  styleUrls: ['./storybook-toast.scss'],
  standalone: true,
  imports: [WattButtonComponent, WattToastComponent],
  providers: [{ provide: MAT_SNACK_BAR_DATA, useValue: {} }],
})
export class StorybookToastComponent {
  private toast = inject(WattToastService);

  @Input()
  config!: WattToastConfig;

  open() {
    this.toast.open(this.config);

    if (this.config.type === 'loading') {
      setTimeout(() => {
        this.toast.update({ message: 'Finished loading :-)', type: 'success' });
      }, 1000);
    }
  }
}
