import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  NgModule,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

import { WattButtonModule } from '../../button';
import { WattToastModule } from '../watt-toast.module';
import { WattToastService } from '../watt-toast.service';
import { WattToastComponent, WattToastConfig, WattToastType } from '../watt-toast.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'storybook-toast',
  templateUrl: './storybook-toast.html',
  styleUrls: ['./storybook-toast.scss']
})
export class StorybookToastComponent implements AfterViewInit {
  @ViewChildren(WattToastComponent) toasts!: QueryList<WattToastComponent>;

  @Input() config!: WattToastConfig;

  constructor(private toast: WattToastService, private cd: ChangeDetectorRef) {}

  open() {
    this.toast.open(this.config);
    console.log(this.config);
  }

  ngAfterViewInit(): void {
    this.setConfig(0, 'success');
    this.setConfig(1, 'info');
    this.setConfig(2, 'warning');
    this.setConfig(3, 'danger');
    this.setConfig(4, 'loading');
    this.setConfig(5);
  }

  private setConfig(index: number, type?: WattToastType): void {
    const toast = this.toasts.get(index);
    if (toast) {
      toast.config = {
        type,
        message: type !== 'danger' ? 'Text Message' : 'Error #456: There was a problem processing Batch ID 232-2335 and the task was stopped.',
        action: () => alert('Some custom action!'),
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
