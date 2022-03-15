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
  ChangeDetectionStrategy,
  Component,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';
import { EoTitle } from '@energinet-datahub/ett/shared/util-browser';

const selector = 'eo-dashboard-shell';

@Component({
  selector,
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;
      ${selector} {
        display: block;
      }
      .${selector}__p {
        @include watt.typography-watt-text-m; // This overrides the styles applied from Angular Material on p tags
      }
    `,
  ],
  template: `
    <p class="${selector}__p">
      More functionality will be released on an ongoing basis. If you want to
      influence the new functionality, join us at our
      <a href="https://www.linkedin.com/groups/12643238/" target="_blank">LinkedIn group</a>.
    </p>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EoDashboardShellComponent {
  constructor(private eoTitleService: EoTitle) {
    this.eoTitleService.setTitle('Dashboard');
  }
}

@NgModule({
  declarations: [EoDashboardShellComponent],
  exports: [EoDashboardShellComponent],
})
export class EoDashboardShellScam {}
