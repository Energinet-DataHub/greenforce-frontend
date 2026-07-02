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
//#endregion
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattBadgeComponent } from '@energinet/watt/badge';
import { WattCopyToClipboardDirective } from '@energinet/watt/clipboard';
import { WattDatePipe } from '@energinet/watt/date';
import { WATT_DESCRIPTION_LIST } from '@energinet/watt/description-list';
import { WATT_DRAWER } from '@energinet/watt/drawer';
import { WattIconComponent } from '@energinet/watt/icon';
import { VaterStackComponent } from '@energinet/watt/vater';

import { DhNavigationService } from '@energinet-datahub/dh/shared/util-navigation';

import {
  dhFailedProcessOwnerLabel,
  dhFailedProcessTypeLabel,
  dhSuspendReasonBadgeType,
} from '../labels';
import { DhFailedProcessesStore } from './failed-processes.store';

@Component({
  selector: 'dh-failed-process-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    VaterStackComponent,
    WATT_DESCRIPTION_LIST,
    WATT_DRAWER,
    WattBadgeComponent,
    WattCopyToClipboardDirective,
    WattDatePipe,
    WattIconComponent,
  ],
  styles: `
    :host {
      .dh-copy-link {
        border: 0;
        background: transparent;
        padding: 0;
        display: inline-flex;
        align-items: center;
        gap: var(--watt-space-xs);
      }

      .dh-suspend-context {
        overflow-wrap: anywhere;
      }
    }
  `,
  template: `
    <watt-drawer
      size="large"
      autoOpen
      [key]="id()"
      *transloco="let t; prefix: 'failedProcesses'"
      (closed)="navigation.navigate('list')"
    >
      @let failedProcess = process();
      <watt-drawer-topbar>
        @if (failedProcess) {
          <watt-badge [type]="badgeType()">
            {{ t('suspendReason.' + failedProcess.suspendReason) }}
          </watt-badge>
        }
      </watt-drawer-topbar>
      <watt-drawer-heading>
        <h2 class="watt-space-stack-s">{{ typeLabel() }}</h2>
        <watt-description-list variant="inline-flow" [groupsPerRow]="4">
          <watt-description-list-item
            [label]="t('drawer.registeredInDataHub')"
            [value]="failedProcess?.createdAt | wattDate: 'long'"
          />
          <watt-description-list-item [label]="t('drawer.processId')">
            <button type="button" class="watt-link-s dh-copy-link" [wattCopyToClipboard]="id()">
              <watt-icon size="xs" name="contentCopy" />
              {{ t('drawer.copy') }}
            </button>
          </watt-description-list-item>
          <watt-description-list-item [label]="t('drawer.startedBy')" [value]="ownerLabel()" />
          <watt-description-list-item
            [label]="t('drawer.meteringPointId')"
            [value]="failedProcess?.meteringPointId"
          />
        </watt-description-list>
      </watt-drawer-heading>
      <watt-drawer-content>
        @if (failedProcess) {
          <vater-stack align="start" gap="s">
            <watt-badge [type]="badgeType()">
              {{ t('suspendReason.' + failedProcess.suspendReason) }}
            </watt-badge>
            <watt-description-list variant="stack">
              <watt-description-list-item
                [label]="t('drawer.registered')"
                [value]="failedProcess.suspendedAt | wattDate: 'long'"
              />
              <watt-description-list-item
                [label]="t('drawer.orchestrationId')"
                [value]="failedProcess.orchestrationInstanceId"
              />
            </watt-description-list>
            @if (failedProcess.suspendContext) {
              <p class="dh-suspend-context">{{ failedProcess.suspendContext }}</p>
            }
          </vater-stack>
        }
      </watt-drawer-content>
    </watt-drawer>
  `,
})
export class DhFailedProcessDetails {
  protected readonly navigation = inject(DhNavigationService);
  private readonly store = inject(DhFailedProcessesStore);

  // Param value
  readonly id = input.required<string>();

  // There is no by-id query; the drawer finds its row in the store's FULL loaded
  // list (not the filtered one) so it stays open when filters exclude the row.
  protected readonly process = computed(() => {
    const id = this.id();
    return this.store.processes().find((process) => process.id === id);
  });

  protected readonly typeLabel = computed(() =>
    dhFailedProcessTypeLabel(this.process()?.processType)
  );
  protected readonly ownerLabel = computed(() =>
    dhFailedProcessOwnerLabel(this.process()?.createdBy)
  );
  protected readonly badgeType = computed(() => {
    const process = this.process();
    return process ? dhSuspendReasonBadgeType(process.suspendReason) : 'skeleton';
  });
}
