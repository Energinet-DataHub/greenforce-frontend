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
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { WattTopBarService } from './watt-top-bar.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-top-bar',
  template: `
    <ng-template #template>
      <ng-content></ng-content>
    </ng-template>
  `,
  standalone: true,
})
export class WattTopBarComponent implements AfterViewInit, OnDestroy {
  @ViewChild('template') template!: TemplateRef<unknown>;
  private topBarService = inject(WattTopBarService);

  ngAfterViewInit(): void {
    this.topBarService.template.next(this.template);
  }

  ngOnDestroy(): void {
    this.topBarService.template.next(null);
  }
}
