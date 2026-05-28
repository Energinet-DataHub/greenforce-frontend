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
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { TranslocoDirective } from '@jsverse/transloco';

import { VATER } from '@energinet/watt/vater';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattCardComponent } from '@energinet/watt/card';
import { WattDropdownComponent } from '@energinet/watt/dropdown';
import { WattHeadingComponent } from '@energinet/watt/heading';
import { WattTextFieldComponent } from '@energinet/watt/text-field';
import { WATT_MODAL } from '@energinet/watt/modal';

import { mutation, lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import {
  RebuildProjectionsDocument,
  ProjectionType,
  GetProjectionsStatusDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
  dhMakeFormControl,
} from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-metering-point-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    VATER,
    WATT_MODAL,
    WattButtonComponent,
    WattCardComponent,
    WattDropdownComponent,
    WattHeadingComponent,
    WattTextFieldComponent,
    DhDropdownTranslatorDirective,
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
    <ng-container *transloco="let t; prefix: 'meteringPointDebug.actions'">
      <vater-grid columns="1fr 1fr" gap="ml">
        <watt-card>
          <vater-flex direction="column" gap="m">
            <h3 watt-heading>{{ t('dangerZone.title') }}</h3>

            <vater-flex class="danger-zone" direction="column" gap="m">
              <h4 watt-heading>{{ t('rebuildProjection.title') }}</h4>

              <watt-dropdown
                [formControl]="projectionTypeControl"
                [options]="projectionTypeOptions"
                [placeholder]="t('rebuildProjection.selectPlaceholder')"
                dhDropdownTranslator
                translateKey="meteringPointDebug.actions.rebuildProjection.projectionTypes"
              />

              <watt-text-field
                [label]="t('rebuildProjection.timeout')"
                type="number"
                [formControl]="timeoutControl"
              />

              <watt-button
                variant="secondary"
                [loading]="rebuildProjections.loading()"
                [disabled]="!projectionTypeControl.value"
                (click)="rebuildModal.open()"
              >
                {{ t('rebuildProjection.button') }}
              </watt-button>

              @if (rebuildProjections.data(); as data) {
                <div class="result-box">
                  <strong>{{ t('result') }}</strong>
                  {{ data.rebuildProjections.success ? t('success') : t('failed') }}
                </div>
              }

              @if (rebuildProjections.error(); as error) {
                <div class="result-box">
                  <strong>{{ t('error') }}</strong> {{ error.message }}
                </div>
              }
            </vater-flex>
          </vater-flex>
        </watt-card>

        <watt-card style="grid-column: 1 / -1">
          <vater-flex direction="column" gap="m">
            <h3 watt-heading>{{ t('projectionsStatus.title') }}</h3>

            <watt-button
              variant="secondary"
              [loading]="projectionsStatusQuery.loading()"
              (click)="getProjectionsStatus()"
            >
              {{ t('projectionsStatus.button') }}
            </watt-button>

            @if (projectionsStatusJson()) {
              <pre class="result-box">{{ projectionsStatusJson() }}</pre>
            }

            @if (projectionsStatusQuery.error(); as error) {
              <div class="result-box">
                <strong>{{ t('error') }}</strong> {{ error.message }}
              </div>
            }
          </vater-flex>
        </watt-card>
      </vater-grid>

      <watt-modal
        #rebuildModal
        size="small"
        [title]="t('rebuildProjection.modal.title')"
        (closed)="onConfirmRebuild($event)"
      >
        {{ t('rebuildProjection.modal.message') }}
        <watt-modal-actions>
          <watt-button variant="secondary" (click)="rebuildModal.close(false)">
            {{ t('modal.cancel') }}
          </watt-button>
          <watt-button (click)="rebuildModal.close(true)">
            {{ t('modal.confirm') }}
          </watt-button>
        </watt-modal-actions>
      </watt-modal>
    </ng-container>
  `,
})
export class DhMeteringPointActionsComponent {
  rebuildProjections = mutation(RebuildProjectionsDocument);
  projectionTypeControl = dhMakeFormControl<ProjectionType>();
  timeoutControl = dhMakeFormControl('30');
  projectionTypeOptions = dhEnumToWattDropdownOptions(ProjectionType);
  projectionsStatusQuery = lazyQuery(GetProjectionsStatusDocument);
  projectionsStatusJson = computed(() => {
    const data = this.projectionsStatusQuery.data()?.projectionsStatus;
    if (!data) return null;
    return JSON.stringify(data, (key, value) => (key === '__typename' ? undefined : value), 2);
  });

  onConfirmRebuild(confirmed: boolean): void {
    if (!confirmed) return;
    const projection = this.projectionTypeControl.value;
    const timeout = parseInt(this.timeoutControl.value || '5');
    assertIsDefined(projection);
    this.rebuildProjections.mutate({ variables: { input: { projection, timeout } } });
  }

  getProjectionsStatus(): void {
    this.projectionsStatusQuery.query({ fetchPolicy: 'network-only' });
  }
}
