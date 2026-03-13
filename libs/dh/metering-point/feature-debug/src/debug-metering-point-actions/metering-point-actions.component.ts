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
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { VATER } from '@energinet/watt/vater';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattCardComponent } from '@energinet/watt/card';
import { WattDropdownComponent } from '@energinet/watt/dropdown';
import { WattHeadingComponent } from '@energinet/watt/heading';
import { WattTextFieldComponent } from '@energinet/watt/text-field';

import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import {
  RebuildProjectionsDocument,
  DeleteAllEventSourcingDataDocument,
  ProjectionType,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';

@Component({
  selector: 'dh-metering-point-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    VATER,
    WattButtonComponent,
    WattCardComponent,
    WattDropdownComponent,
    WattHeadingComponent,
    WattTextFieldComponent,
  ],
  styles: `
    .result-box {
      padding: var(--watt-space-m);
      background-color: var(--watt-color-neutral-grey-100);
      border-radius: var(--watt-space-xs);
      font-family: monospace;
    }

    .danger-zone {
      border: 2px solid var(--watt-color-state-danger);
      padding: var(--watt-space-m);
      border-radius: var(--watt-space-xs);
    }
  `,
  template: `
    <vater-grid inset="ml" columns="1fr 1fr" rows="auto 1fr" gap="ml">
      <watt-card>
        <vater-flex direction="column" gap="m">
          <h3 watt-heading>Rebuild Projection</h3>

          <watt-dropdown
            [formControl]="projectionTypeControl"
            [options]="projectionTypeOptions"
            placeholder="Select projection type"
          />

          <watt-text-field label="Timeout (seconds)" type="number" [formControl]="timeoutControl" />

          <watt-button
            variant="secondary"
            [loading]="rebuildProjectionsMutation.loading()"
            [disabled]="!projectionTypeControl.value"
            (click)="rebuildProjections()"
          >
            Rebuild Projection
          </watt-button>

          @if (rebuildResult()) {
            <div class="result-box"><strong>Result:</strong> {{ rebuildResult() }}</div>
          }
        </vater-flex>
      </watt-card>

      <vater-grid-area column="1 / 3" row="2">
        <watt-card>
          <vater-flex direction="column" gap="m">
            <h3 watt-heading>Danger Zone</h3>

            <div class="danger-zone">
              <vater-flex direction="column" gap="m">
                <div>
                  <strong>Warning:</strong> This action will delete ALL event sourcing data. This
                  cannot be undone!
                </div>

                <watt-button
                  variant="secondary"
                  [loading]="deleteAllDataMutation.loading()"
                  (click)="deleteAllEventSourcingData()"
                >
                  Delete All Event Sourcing Data
                </watt-button>

                @if (deleteResult()) {
                  <div class="result-box"><strong>Result:</strong> {{ deleteResult() }}</div>
                }
              </vater-flex>
            </div>
          </vater-flex>
        </watt-card>
      </vater-grid-area>
    </vater-grid>
  `,
})
export class DhMeteringPointActionsComponent {
  rebuildProjectionsMutation = mutation(RebuildProjectionsDocument);
  deleteAllDataMutation = mutation(DeleteAllEventSourcingDataDocument);

  projectionTypeControl = new FormControl<ProjectionType | null>(null);
  timeoutControl = new FormControl('5');

  projectionTypeOptions = [
    { value: ProjectionType.MeteringPoint, displayValue: 'Metering Point' },
    {
      value: ProjectionType.MeteringPointWithRelations,
      displayValue: 'Metering Point With Relations',
    },
  ];

  rebuildResult = signal<string | null>(null);
  deleteResult = signal<string | null>(null);

  rebuildProjections(): void {
    const projection = this.projectionTypeControl.value;
    const timeout = parseInt(this.timeoutControl.value || '5');
    assertIsDefined(projection);
    this.rebuildProjectionsMutation.mutate({
      variables: { input: { projection, timeout } },
      onCompleted: (data) => {
        const success = data.rebuildProjections.success;
        this.rebuildResult.set(success ? 'Success' : 'Failed');
      },
      onError: (error) => {
        this.rebuildResult.set(`Error: ${error.message}`);
      },
    });
  }

  deleteAllEventSourcingData(): void {
    if (
      !confirm('Are you sure you want to delete ALL event sourcing data? This cannot be undone!')
    ) {
      return;
    }

    this.deleteAllDataMutation.mutate({
      onCompleted: (data) => {
        const success = data.deleteAllEventSourcingData.success;
        this.deleteResult.set(success ? 'Success' : 'Failed');
      },
      onError: (error) => {
        this.deleteResult.set(`Error: ${error.message}`);
      },
    });
  }
}
