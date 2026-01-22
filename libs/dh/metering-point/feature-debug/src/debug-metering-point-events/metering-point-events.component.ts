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
import { Component, computed, effect } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import { VaterFlexComponent } from '@energinet/watt/vater';
import { WattTextFieldComponent } from '@energinet/watt/text-field';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import {
  GetMeteringPointEventsDebugViewDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { dhIsValidMeteringPointId, DhResultComponent } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-metering-point-events',
  imports: [
    ReactiveFormsModule,
    VaterFlexComponent,
    WattTextFieldComponent,
    DhResultComponent,
    JsonPipe,
  ],
  styles: `
    :host {
      display: block;
      height: 100%;
      width: 100%;
      padding: var(--watt-space-ml);
    }
  `,
  template: `
    <vater-flex autoSize fill="both" gap="l">
      <watt-text-field
        label="Metering Point Id"
        [formControl]="meteringPointIdFormControl"
        [maxLength]="18"
      />

      <dh-result [loading]="query.loading()" [hasError]="query.hasError()">
        @if (debugViewV2()) {
          <h1>Metering Point</h1>
          <pre>{{ debugViewV2()!.meteringPointJson }}</pre>

          <h1>Events</h1>
          <pre>{{ debugViewV2()!.events | json }}</pre>
        } @else {
          <p>No data</p>
        }
      </dh-result>
    </vater-flex>
  `,
})
export class DhMeteringPointEventsComponent {
  query = lazyQuery(GetMeteringPointEventsDebugViewDocument);

  debugViewV2 = computed(() => {
    const debugView = this.query.data()?.eventsDebugView;

    if (!debugView) return undefined;

    return {
      meteringPointJson: debugView.meteringPointJson,
      events: debugView?.events.map((e) => ({
        id: e.id,
        type: e.type,
        timestamp: e.timestamp,
        data: safeJsonParse(e.jsonData),
        jsonData: undefined,
      })),
    };
  });

  meteringPointIdFormControl = new FormControl();

  meteringPointId = toSignal(this.meteringPointIdFormControl.valueChanges);

  constructor() {
    effect(() => {
      const meteringPointId = this.meteringPointId();

      if (!dhIsValidMeteringPointId(meteringPointId)) {
        if (this.query.data()) {
          this.query.reset();
        }

        return;
      }

      this.query.query({
        variables: { meteringPointId: meteringPointId },
      });
    });
  }
}

function safeJsonParse(str: string): unknown {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.error('Failed to parse JSON:', str, error);
    return str;
  }
}
