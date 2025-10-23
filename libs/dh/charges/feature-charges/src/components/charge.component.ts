//#region License
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
//#endregione';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChargesSubPaths, getPath } from '@energinet-datahub/dh/core/routing';
import { WATT_LINK_TABS } from '@energinet-datahub/watt/tabs';
import { VaterSpacerComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'dh-charge',
  styles: `
    @use '@energinet-datahub/watt/utils' as watt;

    :host {
      display: block;
      height: 100%;
    }

    .page-grid {
      display: grid;
      grid-template-rows: auto 1fr;
      height: 100%;
    }

    .page-header {
      background-color: var(--watt-color-neutral-white);
      border-bottom: 1px solid var(--watt-color-neutral-grey-300);
      padding: var(--watt-space-m) var(--watt-space-ml);
    }

    .page-tabs {
      position: relative;
      overflow: auto;
    }
  `,
  imports: [TranslocoDirective, VaterStackComponent, VaterSpacerComponent, WATT_LINK_TABS],
  template: `<div class="page-grid">
    <div class="page-header" vater-stack direction="row" gap="m" wrap align="end">
      <div *transloco="let t; prefix: 'charges.charge'">
        <h2 vater-stack direction="row" gap="m" class="watt-space-stack-s">headline</h2>

        <vater-stack direction="row" gap="ml">
          <span class="watt-text-s"> info </span>

          <span direction="row" gap="s" class="watt-text-s"> info </span>

          <span direction="row" gap="s" class="watt-text-s"> info </span>

          <span direction="row" gap="s" class="watt-text-s"> info </span>
        </vater-stack>
      </div>

      <vater-spacer />

      <div>actions</div>
    </div>

    <div class="page-tabs" *transloco="let t; prefix: 'charges.charge.tabs'">
      <watt-link-tabs vater inset="0">
        <watt-link-tab [label]="t('pricesLabel')" [link]="getLink('prices')" />
      </watt-link-tabs>
    </div>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhChargeComponent {
  getLink = (path: ChargesSubPaths) => getPath(path);
}
