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
import { computed, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { dayjs } from '@energinet-datahub/watt/date';
import {
  DocumentType,
  BusinessReason,
  GetArchivedMessagesQueryVariables,
  GetActorsDocument,
  GetSelectedActorDocument,
  EicFunction,
} from '@energinet-datahub/dh/shared/domain/graphql';
import {
  dhEnumToWattDropdownOptions,
  dhMakeFormControl,
} from '@energinet-datahub/dh/shared/ui-util';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { exists, keyExists } from '@energinet-datahub/dh/shared/util-operators';
import { query } from '@energinet-datahub/dh/shared/util-apollo';

@Injectable()
export class DhMessageArchiveSearchFormService {
  private actorsQuery = query(GetActorsDocument);
  private actors = computed(() => this.actorsQuery.data()?.actors ?? []);
  private selectedActorQuery = query(GetSelectedActorDocument);
  private marketRole = computed(() => this.selectedActorQuery.data()?.selectedActor?.marketRole);
  private form = new FormGroup({
    includeRelated: dhMakeFormControl<boolean>(null),
    documentTypes: dhMakeFormControl<DocumentType[]>(),
    businessReasons: dhMakeFormControl<BusinessReason[]>(),
    senderId: dhMakeFormControl<string>(),
    receiverId: dhMakeFormControl<string>(),
    start: dhMakeFormControl(dayjs().startOf('day').toDate()),
    end: dhMakeFormControl(dayjs().endOf('day').toDate()),
  });

  root = this.form;
  controls = this.form.controls;
  documentTypeOptions = dhEnumToWattDropdownOptions(DocumentType);
  businessReasonOptions = dhEnumToWattDropdownOptions(BusinessReason);
  actorOptions = computed(() =>
    this.actors().map((actor) => ({
      value: actor.id,
      displayValue: actor.name || actor.glnOrEicNumber,
    }))
  );

  isActorControlsEnabled = computed(() => this.marketRole() === EicFunction.DataHubAdministrator);

  values = toSignal<GetArchivedMessagesQueryVariables>(
    this.form.valueChanges.pipe(
      filter(() => this.emitEvent),
      startWith(null),
      map(() => this.form.getRawValue()),
      exists(),
      keyExists('start'),
      map(({ start, end, ...variables }) => ({ ...variables, created: { start, end } }))
    ),
    { requireSync: true }
  );

  // Workaround for `emitEvent: false` on reset function not working
  emitEvent = true;

  reset = () => {
    this.emitEvent = false;
    this.form.reset();
    this.emitEvent = true;
  };

  getDocumentTypeIdentifier = (documentType: DocumentType) => {
    switch (documentType as DocumentType) {
      case DocumentType.NotifyAggregatedMeasureData:
        return 'RSM-014';
      case DocumentType.RejectRequestAggregatedMeasureData:
        return 'RSM-016';
      case DocumentType.RequestAggregatedMeasureData:
        return 'RSM-016';
      case DocumentType.B2CRequestAggregatedMeasureData:
        return 'RSM-016';
      case DocumentType.RejectRequestWholesaleSettlement:
        return 'RSM-017';
      case DocumentType.RequestWholesaleSettlement:
        return 'RSM-017';
      case DocumentType.B2CRequestWholesaleSettlement:
        return 'RSM-017';
      case DocumentType.NotifyWholesaleServices:
        return 'RSM-019';
    }
  };
}
