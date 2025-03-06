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
import { Component, computed, effect } from '@angular/core';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { DhMeteringPointsMasterDataUploaderComponent } from './file-uploader/dh-metering-points-master-data-uploader.component';
import { TranslocoPipe } from '@ngneat/transloco';
import { DhFeatureFlagDirective } from '@energinet-datahub/dh/shared/feature-flags';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { GetMeteringPointDebugViewDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhResultComponent } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-metering-point',
  imports: [
    ReactiveFormsModule,
    TranslocoPipe,
    WattButtonComponent,
    DhFeatureFlagDirective,
    DhPermissionRequiredDirective,
    DhMeteringPointsMasterDataUploaderComponent,
    VaterFlexComponent,
    WattTextFieldComponent,
    DhResultComponent,
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
      padding: var(--watt-space-ml);
    }
  `,
  template: `
    <vater-flex fill="both" gap="l" *dhFeatureFlag="'metering-points-master-data-upload'">
      <dh-metering-points-master-data-uploader #uploader />

      <watt-button *dhPermissionRequired="['fas']" (click)="uploader.selectFile()">
        {{ 'electricityMarket.table.uploadButton' | transloco }}
      </watt-button>
      <watt-text-field label="MeteringPointId" [formControl]="meteringPointIdFormControl" />

      <dh-result [loading]="query.loading()" [hasError]="query.hasError()">
        <textarea spellcheck="false" wrap="off">{{ debugView() }}</textarea>
      </dh-result>
    </vater-flex>
  `,
})
export class DhMeteringPointComponent {
  query = lazyQuery(GetMeteringPointDebugViewDocument);

  debugView = computed(() => this.query.data()?.debugView);

  meteringPointIdFormControl = new FormControl();

  meteringPointId = toSignal(this.meteringPointIdFormControl.valueChanges);

  constructor() {
    effect(() => {
      const meteringPointId = this.meteringPointId();
      if (!meteringPointId) return;
      this.query.query({
        variables: { meteringPointId: this.meteringPointId() },
      });
    });
  }
}
