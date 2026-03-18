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
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  output,
  signal,
  untracked,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
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
import { dhFormControlToSignal, dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';

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
  styles: `
    .search-button {
      margin-top: var(--watt-space-xs);
    }
  `,
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
          [formControl]="searchControl"
          [label]="t('meteringPointIdLabel')"
        >
          @if (searchControl.hasError('notFound')) {
            <watt-field-error>{{ t('meteringPointInfo.notFound') }}</watt-field-error>
          } @else {
            <watt-field-error>{{ t('meteringPointInfo.notValidated') }}</watt-field-error>
          }
        </watt-text-field>
        <watt-button icon="search" variant="secondary" (click)="search()" class="search-button" />
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
              [value]="tBase('meteringPointType.' + info.metadata?.type)"
            />
          </watt-description-list>
        </vater-stack>
      } @else if (loading()) {
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
export class DhActorConversationMeteringPointSearchComponent {
  /** Emits the validated metering point ID, or `undefined` when the search is cleared. */
  readonly meteringPointIdValidated = output<string | undefined>();

  readonly searchControl = dhMakeFormControl<string>('');

  private readonly searchControlValue = dhFormControlToSignal(() => this.searchControl);
  private readonly searchedId = signal<string | undefined>(undefined);
  private _validated = false;

  private readonly infoQuery = lazyQuery(GetMeteringPointNewConversationInfoDocument);

  private readonly fetchMeteringPointInfo = effect(() => {
    const meteringPointId = this.searchedId();
    if (!meteringPointId) return;
    this.infoQuery.query({ variables: { meteringPointId } });
  });

  readonly meteringPointInfo = computed(() => {
    if (!this.searchedId()) return undefined;
    return this.infoQuery.data()?.meteringPoint ?? undefined;
  });

  readonly loading = this.infoQuery.loading;

  private readonly clearOnSearchValueChange = effect(() => {
    this.searchControlValue();
    untracked(() => {
      this._validated = false;
      this.searchedId.set(undefined);
      this.searchControl.setErrors(null);
      this.searchControl.markAsUntouched();
      this.meteringPointIdValidated.emit(undefined);
    });
  });

  private readonly onInfoChange = effect(() => {
    const id = this.searchedId();
    const meteringPoint = this.infoQuery.data()?.meteringPoint;
    const isLoading = this.infoQuery.loading();

    if (!id || isLoading) return;

    if (meteringPoint) {
      this._validated = true;
      this.searchControl.setErrors(null);
      this.meteringPointIdValidated.emit(meteringPoint.meteringPointId);
    } else {
      this._validated = false;
      this.meteringPointIdValidated.emit(undefined);
      this.searchControl.setErrors({ notFound: true });
      this.searchControl.markAsTouched();
    }
  });

  /** Returns whether the current value has been validated via a successful search. */
  get isValidated(): boolean {
    return this._validated;
  }

  /** Marks the field as not-yet-validated (call when the parent form is submitted without a prior search). */
  markNotValidated(): void {
    this.searchControl.setErrors({ notValidated: true });
    this.searchControl.markAsTouched();
  }

  search(): void {
    const value = this.searchControl.value;
    if (value) {
      this.searchControl.setErrors(null);
      this.searchedId.set(value);
    }
  }
}
