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
import { effect, Injectable } from '@angular/core';
import {
  RequestMissingMeasurementsLogDocument,
  RequestMissingMeasurementsLogInput,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { injectToast } from '@energinet-datahub/dh/wholesale/shared';

@Injectable()
export class DhRequestMissingMeasurementLogService {
  private readonly toast = injectToast('reports.missingMeasurementsLog.toast');
  private readonly request = mutation(RequestMissingMeasurementsLogDocument);

  toastEffect = effect(() => this.toast(this.request.status()));
  mutate = (input: RequestMissingMeasurementsLogInput) =>
    this.request.mutate({ variables: { input } });
}
