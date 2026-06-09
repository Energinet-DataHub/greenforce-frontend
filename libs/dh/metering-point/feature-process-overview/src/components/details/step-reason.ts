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
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

import { VaterStackComponent } from '@energinet/watt/vater';

@Component({
  selector: 'dh-step-reason',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoPipe, VaterStackComponent],
  styles: `
    p {
      margin: var(--watt-space-m) 0 0;
    }
  `,
  template: `
    @if (comment(); as commentText) {
      @let reasonLabelKey = 'meteringPoint.processOverview.stepReasonLabels.' + step();
      @let reasonLabel = reasonLabelKey | transloco;

      <!--
        A step shows its reason only when it has a reason-label translation, keyed by step id like the
        step names. Without one the pipe returns the key, so the reason is suppressed rather than
        rendering a raw key. A new step opts in by adding a stepReasonLabels translation.
      -->
      @if (reasonLabel !== reasonLabelKey) {
        <p vater-stack align="start" class="watt-text-s">
          <strong class="watt-text-s-highlighted">{{ reasonLabel }}</strong>
          {{ commentText }}
        </p>
      }
    }
  `,
})
export class DhStepReason {
  readonly step = input.required<string>();
  readonly comment = input<string | null>();
}
