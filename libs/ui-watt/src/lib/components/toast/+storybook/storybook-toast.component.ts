/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
import { WattToastService } from '../watt-toast.service';
import {
  WattToastComponent,
  WattToastConfig,
  WattToastType,
} from '../watt-toast.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'storybook-toast',
  templateUrl: './storybook-toast.html',
  styleUrls: ['./storybook-toast.scss'],
})
export class StorybookToastComponent implements AfterViewInit {
  @ViewChildren(WattToastComponent) toasts!: QueryList<WattToastComponent>;

  @Input() config!: WattToastConfig;

  constructor(private toast: WattToastService, private cd: ChangeDetectorRef) {}

  open() {
    this.toast.open(this.config);

    if (this.config.type === 'loading') {
      setTimeout(() => {
        this.toast.update({ message: 'Finished loading :-)', type: 'success' });
      }, 1000);
    }
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
        message:
          type !== 'danger'
            ? 'Text Message'
            : 'Error #456: There was a problem processing Batch ID 232-2335 and the task was stopped.',
        action: () => alert('Some custom action!'),
        actionLabel: 'action',
      };
    }
  }
}

@NgModule({
  imports: [WattToastComponent, WattButtonModule],
  declarations: [StorybookToastComponent],
  providers: [{ provide: MAT_SNACK_BAR_DATA, useValue: {} }],
  exports: [StorybookToastComponent],
})
export class StorybookToastModule {}
