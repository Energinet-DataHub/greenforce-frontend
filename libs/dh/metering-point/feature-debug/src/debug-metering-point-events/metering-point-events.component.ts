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
import { WattSlideToggleComponent } from '@energinet/watt/slide-toggle';
import { WattTextFieldComponent } from '@energinet/watt/text-field';

import {
  GetMeteringPointDebugJsonDocument,
  GetOperationToolsMeteringPointDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import {
  dhFormControlToSignal,
  dhIsValidMeteringPointId,
  DhResultComponent,
} from '@energinet-datahub/dh/shared/ui-util';
import { TranslocoDirective } from '@jsverse/transloco';

/** Keys whose values are timestamps that should be truncated to second precision. */
const timestampKeys = new Set(['validFrom', 'validTo']);

/** Truncate fractional seconds and normalize timezone offset for a timestamp string. */
function truncateTimestamp(value: string): string {
  return value.replace(/\.\d+/, '').replace(/\+00:00$/, 'Z');
}

/** EM1 isActual string values mapped to EM2 booleans. */
const isActualMapping: Record<string, boolean> = {
  Washable: true,
  NotWashable: false,
};

/** EM1 disconnectionType values mapped to EM2 equivalents. */
const disconnectionTypeMapping: Record<string, string> = {
  ManualDisconnection: 'Manual',
  RemoteDisconnection: 'Remote',
};

/** EM1 timeResolution values mapped to EM2 equivalents. */
const timeResolutionMapping: Record<string, string> = {
  PT15M: 'QuarterHourly',
  PT1H: 'Hourly',
  P1M: 'Monthly',
  ANDET: 'Other',
};

/** EM1 relationType values mapped to EM2 equivalents. */
const relationTypeMapping: Record<string, string> = {
  Contact1: 'Technical',
  Contact4: 'Juridical',
  Secondary: 'Secondary',
};

/** EM1 settlementGroup number values mapped to EM2 string equivalents. */
const settlementGroupMapping: Record<number, string> = {
  1: 'One',
  2: 'Two',
  3: 'Three',
  4: 'Four',
  5: 'Five',
  6: 'Six',
  99: 'NinetyNine',
  0: 'None',
};

/** Keys that only exist in EM2 and should be stripped when comparing. */
const em2OnlyKeys = new Set([
  'id',
  'parentMeteringPointIds',
  'currentType',
  'currentConnectionState',
  'relationType',
  'currentParentId',
  'currentPowerPlantGsrn',
]);

/** Recursively strip EM2-only keys from an object for cleaner comparison. */
function normalizeEm2(value: unknown, isRoot = true): unknown {
  if (Array.isArray(value)) return value.map((v) => normalizeEm2(v, false));
  if (typeof value === 'object' && value !== null) {
    const result: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(value)) {
      if (key === 'id' || key === 'createdAt' || (isRoot && em2OnlyKeys.has(key))) continue;
      result[key] =
        timestampKeys.has(key) && typeof child === 'string'
          ? truncateTimestamp(child)
          : normalizeEm2(child, false);
    }
    return result;
  }
  return value;
}

/** Recursively normalize an EM1 object to align with EM2 format. */
function normalizeEm1(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalizeEm1);
  if (typeof value === 'object' && value !== null) {
    const result: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(value)) {
      // Unwrap single-element address arrays to match EM2's object shape
      if (key === 'address' && Array.isArray(child) && child.length === 1) {
        result[key] = normalizeEm1(child[0]);
      } else if (timestampKeys.has(key) && typeof child === 'string') {
        result[key] = truncateTimestamp(child);
      } else if (key === 'isActual' && typeof child === 'string') {
        result[key] = isActualMapping[child] ?? child;
      } else if (key === 'disconnectionType' && typeof child === 'string') {
        result[key] = disconnectionTypeMapping[child] ?? child;
      } else if (key === 'timeResolution' && typeof child === 'string') {
        result[key] = timeResolutionMapping[child] ?? child;
      } else if (key === 'relationType' && typeof child === 'string') {
        result[key] = relationTypeMapping[child] ?? child;
      } else if (key === 'assetCapacity' && typeof child === 'string') {
        result[key] = Number(child);
      } else if (key === 'settlementGroup' && typeof child === 'number') {
        result[key] = settlementGroupMapping[child];
      } else {
        result[key] = normalizeEm1(child);
      }
    }
    return result;
  }
  return value;
}

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
    WattSlideToggleComponent,
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
        <vater-stack fill="horizontal" direction="row" gap="m">
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
          @if (selected() === 'meteringPoint') {
            <watt-slide-toggle [formControl]="compareEm1Toggle">
              {{ t('compareEm1') }}
            </watt-slide-toggle>
          }
          <vater-spacer />
          @if (compareEm1() && selected() === 'meteringPoint') {
            <watt-button icon="matchCase" variant="text" (click)="matchCase.set(!matchCase())">
              {{ matchCase() ? t('ignoreCase') : t('matchCase') }}
            </watt-button>
          }
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
            [fill]="
              !operationToolsMeteringPoint.data()?.operationToolsMeteringPoint ||
              debugJsonQuery.loading()
                ? 'vertical'
                : undefined
            "
            [empty]="!operationToolsMeteringPoint.data()?.operationToolsMeteringPoint"
            [loading]="operationToolsMeteringPoint.loading() || debugJsonQuery.loading()"
            [hasError]="operationToolsMeteringPoint.hasError()"
          >
            <watt-json-viewer
              #viewer
              [initialExpanded]="true"
              [json]="em1Json() ? em2Json() : json()"
              [compare]="em1Json()"
              [ignoreCase]="!matchCase()"
            />
          </dh-result>
        </watt-card>
      </vater-flex>
    </ng-container>
  `,
})
export class DhMeteringPointEventsComponent {
  meteringPointIdFormControl = new FormControl();
  compareEm1Toggle = new FormControl(false);
  matchCase = signal(false);
  meteringPointId = dhFormControlToSignal(this.meteringPointIdFormControl);
  compareEm1 = dhFormControlToSignal(this.compareEm1Toggle);
  operationToolsMeteringPoint = query(GetOperationToolsMeteringPointDocument, () => ({
    skip: !dhIsValidMeteringPointId(this.meteringPointId()),
    variables: {
      id: this.meteringPointId(),
    },
  }));

  debugJsonQuery = query(GetMeteringPointDebugJsonDocument, () => ({
    skip: !this.compareEm1() || !dhIsValidMeteringPointId(this.meteringPointId()),
    variables: {
      id: this.meteringPointId(),
    },
  }));

  selected = signal<'meteringPoint' | 'events' | 'relations'>('meteringPoint');
  json = computed(() => {
    const data = this.operationToolsMeteringPoint.data()?.operationToolsMeteringPoint;
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

  em2Json = computed(() => {
    const json = this.json();
    return json ? normalizeEm2(json) : null;
  });

  em1Json = computed(() => {
    if (!this.compareEm1() || this.selected() !== 'meteringPoint') return undefined;
    const raw = this.debugJsonQuery.data()?.meteringPointDebugJson;
    if (!raw) return undefined;
    try {
      return normalizeEm1(JSON.parse(raw));
    } catch {
      return undefined;
    }
  });

  constructor() {
    effect(() => {
      if (!dhIsValidMeteringPointId(this.meteringPointId())) {
        this.operationToolsMeteringPoint.reset();
      }
    });
  }
}
