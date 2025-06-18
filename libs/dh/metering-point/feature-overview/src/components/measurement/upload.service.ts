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
// import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { injectToast } from '@energinet-datahub/dh/shared/ui-util';
import { MutationStatus } from '@energinet-datahub/dh/shared/util-apollo';

@Injectable()
export class DhMeasurementsUploadService {
  private toast = injectToast('wholesale.calculations.create.toast');
  // private create = mutation(UploadMeasurementDataDocument);
  // toastEffect = effect(() => this.toast(this.create.status()));

  // this.create.mutate({ variables: { input } });
  upload = (input: unknown) => {
    console.log(input);
    this.toast(MutationStatus.Loading);
    setTimeout(() => this.toast(MutationStatus.Resolved), 1000);
  };
}
