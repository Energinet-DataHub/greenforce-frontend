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
import { Component, computed } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { DhFeatureFlagDirective } from '@energinet-datahub/dh/shared/feature-flags';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { VaterFlexComponent, VaterUtilityDirective } from '@energinet/watt/vater';
import { WattCardComponent } from '@energinet/watt/card';
import { WattTextFieldComponent } from '@energinet/watt/text-field';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { GetMeteringPointDebugViewDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import {
  dhFormControlToSignal,
  dhIsValidMeteringPointId,
  DhResultComponent,
} from '@energinet-datahub/dh/shared/ui-util';

import { DhMeteringPointsMasterDataUploaderComponent } from './file-uploader/dh-metering-points-master-data-uploader.component';

@Component({
  selector: 'dh-metering-point',
  imports: [
    ReactiveFormsModule,
    DhFeatureFlagDirective,
    DhPermissionRequiredDirective,
    DhMeteringPointsMasterDataUploaderComponent,
    VaterFlexComponent,
    VaterUtilityDirective,
    WattTextFieldComponent,
    DhResultComponent,
    WattCardComponent,
  ],
  styles: `
    textarea {
      font:
        16px 'Courier New',
        monospace;
      width: 100%;
      height: 100%;
      resize: none;
      font-size: 16px;
      outline: none;
      border: 0;
      box-sizing: border-box; /* Ensures padding stays */
      scrollbar-width: thin;
      background: transparent;
    }

    textarea:focus {
      outline: none;
    }

    :host {
      display: block;
      height: 100%;
      width: 100%;
    }
  `,
  template: `
    <div vater inset="ml">
      <watt-card vater fill="vertical">
        <vater-flex autoSize fill="both" gap="m">
          <ng-container *dhFeatureFlag="'metering-points-master-data-upload'">
            <dh-metering-points-master-data-uploader *dhPermissionRequired="['fas']" />
          </ng-container>

          <watt-text-field
            label="MeteringPointId"
            [formControl]="meteringPointIdFormControl"
            [maxLength]="18"
          />

          <dh-result
            vater
            fill="vertical"
            [loading]="query.loading()"
            [hasError]="query.hasError()"
          >
            <textarea spellcheck="false" wrap="off">{{ debugView() }}</textarea>
          </dh-result>
        </vater-flex>
      </watt-card>
    </div>
  `,
})
export class DhMeteringPointComponent {
  meteringPointIdFormControl = new FormControl();
  meteringPointId = dhFormControlToSignal(this.meteringPointIdFormControl);
  query = query(GetMeteringPointDebugViewDocument, () => {
    const meteringPointId = this.meteringPointId();
    return dhIsValidMeteringPointId(meteringPointId)
      ? { variables: { meteringPointId } }
      : { skip: true };
  });

  debugView = computed(() => this.query.data()?.debugView);
}
