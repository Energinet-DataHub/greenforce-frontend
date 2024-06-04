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
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { EttListedTransfer } from './ett-transfers.service';
import { EttActivityLogComponent } from '@energinet-datahub/ett/activity-log';
import { ActivityLogEntryResponse } from '@energinet-datahub/ett/activity-log/data-access-api';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ett-transfers-history',
  imports: [EttActivityLogComponent],
  styles: [
    `
      h3,
      watt-empty-state {
        margin-bottom: var(--watt-space-m);
      }

      h3 {
        display: flex;
        align-items: center;
      }

      watt-badge {
        margin-left: var(--watt-space-s);
        border-radius: 50%;
        color: var(--watt-on-light-high-emphasis);
        text-align: center;
        white-space: nowrap;
        vertical-align: baseline;
        border-radius: 9999px;
        min-width: 28px;
        padding: var(--watt-space-xs) var(--watt-space-s);
      }

      .spinner-container {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: var(--watt-space-xl);
      }
    `,
  ],
  standalone: true,
  template: `
    <ett-activity-log
      #log
      variant="solid"
      [showFilters]="false"
      [eventTypes]="['TransferAgreement']"
      [filter]="filter.bind(this)"
      [period]="{ start: null, end: null }"
    />
  `,
})
export class EttTransfersHistoryComponent implements OnChanges {
  @Input() transfer?: EttListedTransfer;
  @ViewChild(EttActivityLogComponent) log!: EttActivityLogComponent;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transfer']?.currentValue && this.log && this.log.refresh) {
      this.log.refresh();
    }
  }

  filter(logEntries: ActivityLogEntryResponse[]) {
    return logEntries.filter((entry) => {
      return entry.entityId === this.transfer?.id;
    });
  }

  refresh() {
    if (this.log && this.log.refetch) {
      this.log.refetch();
    }
  }
}
