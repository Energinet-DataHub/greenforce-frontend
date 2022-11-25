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
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { WattModalModule } from '@energinet-datahub/watt/modal';
import { finalize, map, take, timer } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WattButtonModule, WattModalModule, CommonModule],
  selector: 'eo-idle-timer-modal',
  standalone: true,
  styles: [
    `
      :host {
        height: 500px; // Magic UX number
        position: relative;
        display: grid;
        padding: var(--watt-space-s);
        gap: var(--watt-space-s);
        align-items: center;
        grid-template-columns: 1fr auto;
        grid-template-rows: 44px 1fr auto;
        grid-template-areas:
          'title close'
          'content content'
          '. actions';
      }

      .modal-title {
        grid-area: title;
      }

      .modal-close {
        grid-area: close;
        justify-self: end;
        color: var(--watt-color-primary);
      }

      .content {
        grid-area: content;
        border-top: 1px solid var(--watt-primary-light);
        border-bottom: 1px solid var(--watt-primary-light);
        color: var(--watt-color-primary-dark);
        padding-top: var(--watt-space-m);
        align-self: start;
        height: 100%;
      }

      .actions {
        padding-top: var(--watt-space-m);
        display: flex;
        grid-area: actions;
        gap: var(--watt-space-m);
      }
    `,
  ],
  template: `
    <h3 class="modal-title">Automatic logout</h3>
    <div class="content">
      <p>For security reasons you have been automatically logged out.</p>
    </div>
    <div class="actions">
      <watt-button aria-selected="true">Ok</watt-button>
    </div>
  `,
})
export class EoIdleTimerModalComponent {
  remainingTime$ = timer(0, 1000).pipe(
    take(6),
    map((t) => 5000 - t * 1000),
    finalize(() => alert('countdown done'))
  );
}
