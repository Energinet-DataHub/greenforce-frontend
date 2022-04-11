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
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { ProcessDetailError } from '@energinet-datahub/dh/shared/domain';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-process-error-list',
  templateUrl: './dh-process-error-list.component.html',
  styleUrls: ['./dh-process-error-list.component.scss'],
})
export class DhProcessErrorListComponent {
  private _errors: ProcessDetailError[] = [];

  get errors(): ProcessDetailError[] {
    return this._errors;
  }

  @Input()
  set errors(value: ProcessDetailError[]) {
    if (value === undefined) {
      throw new Error('ProcessDetailError is undefined');
    }
    this._errors = value;
  }
}

@NgModule({
  declarations: [DhProcessErrorListComponent],
  imports: [CommonModule, TranslocoModule],
  exports: [DhProcessErrorListComponent],
})
export class DhProcessDetailItemScam {}
