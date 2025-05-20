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
import { effect, inject, Injectable } from '@angular/core';
import {
  RequestMissingMeasurementsLogDocument,
  RequestMissingMeasurementsLogInput,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { mutation, MutationStatus } from '@energinet-datahub/dh/shared/util-apollo';
import { injectToast } from '@energinet-datahub/dh/wholesale/shared';
import { WattToastService } from '@energinet-datahub/watt/toast';

@Injectable()
export class DhRequestMissingMeasurementLogService {
  private readonly toast = injectToast('reports.missingMeasurementsLog.toast');
  private readonly toastService = inject(WattToastService)
  readonly request = mutation(RequestMissingMeasurementsLogDocument);

  toastEffect = effect(() => this.request.status() !== MutationStatus.Resolved ? this.toast(this.request.status()) : this.toastService.dismiss());
  mutate = (input: RequestMissingMeasurementsLogInput) =>
    this.request.mutate({ variables: { input } });
}
