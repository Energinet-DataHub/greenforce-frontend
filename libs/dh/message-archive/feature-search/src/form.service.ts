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
import { computed, Injectable, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { map, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { dayjs, WattRange } from '@energinet/watt/date';
import {
  ArchivedMessageDocumentType,
  BusinessReason,
  GetMarketParticipantsDocument,
  GetSelectedMarketParticipantDocument,
  EicFunction,
} from '@energinet-datahub/dh/shared/domain/graphql';
import {
  dhEnumToWattDropdownOptions,
  dhMakeFormControl,
} from '@energinet-datahub/dh/shared/ui-util';
import { exists, keyExists } from '@energinet-datahub/dh/shared/util-operators';
import { query } from '@energinet-datahub/dh/shared/util-apollo';

@Injectable()
export class DhMessageArchiveSearchFormService {
  private marketParticipantsQuery = query(GetMarketParticipantsDocument);
  private marketParticipants = computed(
    () => this.marketParticipantsQuery.data()?.marketParticipants ?? []
  );
  private selectedMarketParticipantQuery = query(GetSelectedMarketParticipantDocument);
  private marketRole = computed(
    () => this.selectedMarketParticipantQuery.data()?.selectedMarketParticipant?.marketRole
  );
  private form = new FormGroup({
    includeRelated: dhMakeFormControl<boolean>(null),
    documentTypes: dhMakeFormControl<ArchivedMessageDocumentType[]>(),
    businessReasons: dhMakeFormControl<BusinessReason[]>(),
    senderId: dhMakeFormControl<string>(),
    receiverId: dhMakeFormControl<string>(),
    created: dhMakeFormControl<WattRange<Date>>({
      start: dayjs().startOf('day').toDate(),
      end: dayjs().endOf('day').toDate(),
    }),
  });

  readonly submitted = signal(false);

  root = this.form;
  controls = this.form.controls;
  documentTypeOptions = dhEnumToWattDropdownOptions(ArchivedMessageDocumentType);
  businessReasonOptions = dhEnumToWattDropdownOptions(BusinessReason);
  actorOptions = computed(() =>
    this.marketParticipants().map((actor) => ({
      value: actor.id,
      displayValue: actor.displayName,
    }))
  );

  isActorControlsEnabled = computed(() => this.marketRole() === EicFunction.DataHubAdministrator);

  values = toSignal(
    this.form.valueChanges.pipe(
      startWith(null),
      map(() => this.form.getRawValue()),
      exists(),
      keyExists('created')
    ),
    { requireSync: true }
  );

  reset = () => this.form.reset();

  submit = () => {
    this.submitted.set(true);
    this.synchronize();
  };

  ready = () => {
    this.submitted.set(false);
    this.synchronize();
  };

  synchronize = () => this.form.patchValue(this.values());
}
