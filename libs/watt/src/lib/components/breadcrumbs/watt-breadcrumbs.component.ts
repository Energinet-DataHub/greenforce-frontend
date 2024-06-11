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
import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  TemplateRef,
  ViewEncapsulation,
  contentChildren,
  output,
  viewChild,
} from '@angular/core';

import { WattIconComponent } from '../../foundations/icon/icon.component';

@Component({
  selector: 'watt-breadcrumb',
  standalone: true,
  imports: [WattIconComponent],
  encapsulation: ViewEncapsulation.None,
  template: `<ng-template #templateRef><ng-content /></ng-template>`,
})
export class WattBreadcrumbComponent {
  templateRef = viewChild.required<TemplateRef<unknown>>('templateRef');
  // Used to determine if the breadcrumb is interactive or not
  click = output<unknown>(); // eslint-disable-line @angular-eslint/no-output-native
}

/**
 * Usage:
 * `import { WATT_BREADCRUMBS } from '@energinet-datahub/watt/breadcrumbs';`
 */
@Component({
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [NgTemplateOutlet, WattIconComponent],
  selector: 'watt-breadcrumbs',
  styleUrls: ['./watt-breadcrumbs.component.scss'],
  template: `
    <nav>
      @for (breadcrumb of breadcrumbs(); track breadcrumb; let isLast = $last) {
        <span
          class="watt-breadcrumb"
          (click)="breadcrumb.click.emit($event)"
          [class.interactive]="breadcrumb.click"
          [attr.role]="breadcrumb.click ? 'link' : null"
        >
          <ng-container *ngTemplateOutlet="breadcrumb.templateRef()" />
          @if (!isLast) {
            <watt-icon name="right" />
          }
        </span>
      }
    </nav>
  `,
})
export class WattBreadcrumbsComponent {
  /**
   * @ignore
   */
  breadcrumbs = contentChildren<WattBreadcrumbComponent>(WattBreadcrumbComponent);
}

export const WATT_BREADCRUMBS = [WattBreadcrumbsComponent, WattBreadcrumbComponent] as const;
