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
import { Component, input } from '@angular/core';

import { translate, TranslocoPipe } from '@jsverse/transloco';

import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

import { Permission } from '@energinet-datahub/dh/admin/data-access-api';
import { GenerateCSV } from '@energinet-datahub/dh/shared/ui-util';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

@Component({
  selector: 'dh-permissions-download',
  imports: [TranslocoPipe, WattButtonComponent, VaterStackComponent, DhPermissionRequiredDirective],
  template: `
    <vater-stack direction="row" gap="m">
      <watt-button icon="download" variant="text" (click)="exportAsCsv()">
        {{ 'shared.download' | transloco }}
      </watt-button>

      <watt-button
        *dhPermissionRequired="['user-roles:manage']"
        icon="download"
        variant="text"
        (click)="downloadRelationCSV()"
      >
        {{ 'shared.downloadreport' | transloco }}
      </watt-button>
    </vater-stack>
  `,
})
export class DhPermissionsDownloadComponent {
  url = input.required<string>();
  permissions = input.required<Permission[]>();

  private generateCSVFromStream = GenerateCSV.fromStream(() => this.url());
  private generateCSVSignalArray = GenerateCSV.fromSignalArray(this.permissions);

  exportAsCsv(): void {
    const basePath = 'admin.userManagement.permissionsTab.';

    this.generateCSVSignalArray
      .addHeaders([
        `"${translate(basePath + 'permissionName')}"`,
        `"${translate(basePath + 'permissionDescription')}"`,
      ])
      .mapLines((data) => data.map((x) => [`"${x.name}"`, `"${x.description}"`]))
      .generate(`${basePath}fileName`);
  }

  downloadRelationCSV() {
    this.generateCSVFromStream.generate(
      'admin.userManagement.permissionsTab.relationReportFilename'
    );
  }
}
