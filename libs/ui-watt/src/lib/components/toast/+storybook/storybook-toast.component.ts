import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  NgModule,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

import { WattButtonModule } from '@energinet-datahub/watt';

import { WattToastModule } from '../watt-toast.module';
import { WattToastService } from '../watt-toast.service';
import { WattToastComponent, WattToastType } from '../watt-toast.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'storybook-toast',
  templateUrl: './storybook-toast.html',
  styleUrls: ['./storybook-toast.scss']
})
export class StorybookToastComponent implements AfterViewInit {
  @ViewChildren(WattToastComponent) toasts!: QueryList<WattToastComponent>;

  constructor(private toast: WattToastService, private cd: ChangeDetectorRef) {}

  open() {
    this.toast.open();
  }

  ngAfterViewInit(): void {
    this.setConfig(0, 'success');
    this.setConfig(1, 'info');
    this.setConfig(2, 'warning');
    this.setConfig(3, 'danger');
    this.setConfig(4, 'loading');
  }

  private setConfig(index: number, type?: WattToastType): void {
    const toast = this.toasts.get(index);
    if (toast) {
      toast.config = {
        type,
        message: type !== 'danger' ? 'Text Message' : 'Error #456: There was a problem processing Batch ID 232-2335 and the task was stopped.',
        action: () => alert('some action!'),
      };
    }
  }
}

@NgModule({
  imports: [WattToastModule, WattButtonModule],
  declarations: [StorybookToastComponent],
  providers: [{ provide: MAT_SNACK_BAR_DATA, useValue: {} }],
  exports: [StorybookToastComponent],
})
export class StorybookToastModule {}
