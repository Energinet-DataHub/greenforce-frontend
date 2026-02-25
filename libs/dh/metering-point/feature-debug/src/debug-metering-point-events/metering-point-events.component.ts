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
import { Component, computed, effect, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { VATER } from '@energinet/watt/vater';
import { WATT_CARD } from '@energinet/watt/card';
import { WATT_SEGMENTED_BUTTONS } from '@energinet/watt/segmented-buttons';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattJsonViewer } from '@energinet/watt/json-viewer';
import { WattTextFieldComponent } from '@energinet/watt/text-field';

import { GetMeteringPointEventsDebugViewDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import {
  dhFormControlToSignal,
  dhIsValidMeteringPointId,
  DhResultComponent,
} from '@energinet-datahub/dh/shared/ui-util';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'dh-metering-point-events',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    VATER,
    WATT_CARD,
    WATT_SEGMENTED_BUTTONS,
    WattButtonComponent,
    WattJsonViewer,
    WattTextFieldComponent,
    DhResultComponent,
  ],
  template: `
    <ng-container *transloco="let t; prefix: 'meteringPointDebug.meteringPointEvents'">
      <vater-flex fill="vertical" gap="m">
        <watt-text-field
          [label]="t('searchLabel')"
          [formControl]="meteringPointIdFormControl"
          [maxLength]="18"
        />
        <vater-stack fill="horizontal" direction="row">
          <watt-segmented-buttons [(selected)]="selected">
            <watt-segmented-button value="meteringPoint">
              {{ t('segments.meteringPoint') }}
            </watt-segmented-button>
            <watt-segmented-button value="events">
              {{ t('segments.events') }}
            </watt-segmented-button>
            <watt-segmented-button value="relations">
              {{ t('segments.relations') }}
            </watt-segmented-button>
          </watt-segmented-buttons>
          <vater-spacer />
          <watt-button icon="down" variant="text" (click)="viewer.expandAll()">
            {{ t('expandAll') }}
          </watt-button>
          <watt-button icon="up" variant="text" (click)="viewer.collapseAll()">
            {{ t('collapseAll') }}
          </watt-button>
        </vater-stack>
        <watt-card vater scrollable fill="both">
          <dh-result
            vater
            [fill]="!debugView.data() ? 'vertical' : undefined"
            [empty]="!debugView.data()"
            [loading]="debugView.loading()"
            [hasError]="debugView.hasError()"
          >
            <watt-json-viewer #viewer [initialExpanded]="true" [json]="json()" />
          </dh-result>
        </watt-card>
      </vater-flex>
    </ng-container>
  `,
})
export class DhMeteringPointEventsComponent {
  meteringPointIdFormControl = new FormControl();
  meteringPointId = dhFormControlToSignal(this.meteringPointIdFormControl);
  debugView = query(GetMeteringPointEventsDebugViewDocument, () => ({
    skip: !dhIsValidMeteringPointId(this.meteringPointId()),
    variables: {
      meteringPointId: this.meteringPointId(),
    },
  }));

  selected = signal<'meteringPoint' | 'events' | 'relations'>('meteringPoint');
  json = computed(() => {
    const data = this.debugView.data()?.eventsDebugView;
    if (!data) return null;
    switch (this.selected()) {
      case 'meteringPoint':
        return JSON.parse(data.meteringPointJson);
      case 'events':
        return data.events.map((e) => ({
          id: e.id,
          timestamp: e.timestamp,
          type: e.type,
          data: JSON.parse(e.dataJson),
        }));
      case 'relations':
        return JSON.parse(data.meteringPointWithRelationsJson ?? 'null');
    }
  });

  constructor() {
    effect(() => {
      if (!dhIsValidMeteringPointId(this.meteringPointId())) {
        this.debugView.reset();
      }
    });
  }
}
