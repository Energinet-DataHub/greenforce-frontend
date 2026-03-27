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
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { VATER } from '@energinet/watt/vater';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattTextFieldComponent } from '@energinet/watt/text-field';
import { WattFieldErrorComponent } from '@energinet/watt/field';
import { WattSeparatorComponent } from '@energinet/watt/separator';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet/watt/description-list';
import { WattSkeletonComponent } from '@energinet/watt/skeleton';
import { GetMeteringPointNewConversationInfoDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';

@Component({
  selector: 'dh-actor-conversation-metering-point-search',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    VATER,
    WattButtonComponent,
    WattTextFieldComponent,
    WattFieldErrorComponent,
    WattSeparatorComponent,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    WattSkeletonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'width: 100%' },
  template: `
    <vater-stack
      direction="column"
      gap="m"
      align="start"
      *transloco="let t; prefix: 'meteringPoint.actorConversation'"
    >
      <vater-stack direction="row" gap="s" align="center" fill="horizontal">
        <watt-text-field
          maxLength="18"
          [formControl]="searchControl()"
          [label]="t('meteringPointIdLabel')"
          (keydown.enter)="search()"
        >
          <watt-button icon="search" variant="icon" (click)="search()" />
          @if (searchControl().hasError('meteringPointIdLength')) {
            <watt-field-error>{{ t('meteringPointInfo.invalidLength') }}</watt-field-error>
          } @else if (searchControl().hasError('containsLetters')) {
            <watt-field-error>{{ t('meteringPointInfo.notValidated') }}</watt-field-error>
          } @else if (searchControl().hasError('notFound')) {
            <watt-field-error>{{ t('meteringPointInfo.notFound') }}</watt-field-error>
          }
        </watt-text-field>
      </vater-stack>

      @if (meteringPointInfo(); as info) {
        <vater-stack direction="row" gap="m">
          <watt-separator orientation="vertical" />
          <watt-description-list [groupsPerRow]="1" *transloco="let tBase">
            <watt-description-list-item
              [label]="t('meteringPointInfo.address')"
              [value]="
                info.metadata.installationAddress?.streetName +
                ' ' +
                info.metadata.installationAddress?.buildingNumber +
                ', ' +
                info.metadata.installationAddress?.cityName
              "
            />
            <watt-description-list-item
              [label]="t('meteringPointInfo.type')"
              [value]="tBase('meteringPointType.' + info.metadata.type)"
            />
          </watt-description-list>
        </vater-stack>
      } @else if (query.loading()) {
        <vater-stack direction="row">
          <watt-separator orientation="vertical" />
          <vater-stack gap="ml" class="watt-space-inset-m">
            <vater-stack gap="xs">
              <watt-skeleton width="150px" height="18px" />
              <watt-skeleton width="150px" height="18px" />
            </vater-stack>
            <vater-stack gap="xs">
              <watt-skeleton width="150px" height="18px" />
              <watt-skeleton width="150px" height="18px" />
            </vater-stack>
          </vater-stack>
        </vater-stack>
      }
    </vater-stack>
  `,
})
export class DhActorConversationMeteringPointSearch {
  readonly meteringPointIdValidated = output<string | null>();

  readonly searchControl = input.required<FormControl<string | null>>();

  readonly query = lazyQuery(GetMeteringPointNewConversationInfoDocument);

  readonly meteringPointInfo = computed(() => this.query.data()?.meteringPoint);

  async search() {
    const searchControl = this.searchControl();

    const { valid, value } = searchControl;
    if (value && valid) {
      searchControl.setErrors(null);
      const meteringPoint = await this.query.refetch({ meteringPointId: value });
      const meteringPointId = meteringPoint.data?.meteringPoint?.meteringPointId;

      this.meteringPointIdValidated.emit(value);

      if (!meteringPointId) {
        searchControl.setErrors({ notFound: true });
      }
    }
  }
}
