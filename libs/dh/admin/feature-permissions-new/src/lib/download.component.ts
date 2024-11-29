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
import { HttpClient } from '@angular/common/http';
import { Component, inject, input } from '@angular/core';

import { switchMap } from 'rxjs';
import { translate, TranslocoPipe } from '@ngneat/transloco';

import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

import { Permission } from '@energinet-datahub/dh/admin/data-access-api';
import { exportToCSV, streamToFile } from '@energinet-datahub/dh/shared/ui-util';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

@Component({
  standalone: true,
  selector: 'dh-permissions-download',
  imports: [TranslocoPipe, WattButtonComponent, DhPermissionRequiredDirective],
  template: `
    <watt-button icon="download" variant="text" (click)="exportAsCsv()">
      {{ 'shared.download' | transloco }}
    </watt-button>

    <watt-button
      *dhPermissionRequired="['user-roles:manage']"
      icon="download"
      variant="text"
      (click)="downloadRelationCSV(url())"
    >
      {{ 'shared.downloadreport' | transloco }}
    </watt-button>
  `,
})
export class DhPermissionsDownloadComponent {
  private httpClient = inject(HttpClient);
  private toastService = inject(WattToastService);

  url = input.required<string>();
  permissions = input.required<Permission[]>();

  exportAsCsv(): void {
    const basePath = 'admin.userManagement.permissionsTab.';
    const headers = [
      `"${translate(basePath + 'permissionName')}"`,
      `"${translate(basePath + 'permissionDescription')}"`,
    ];

    const lines = this.permissions().map((x) => [`"${x.name}"`, `"${x.description}"`]);

    exportToCSV({ headers, lines });
  }

  downloadRelationCSV(url: string) {
    this.toastService.open({
      type: 'loading',
      message: translate('shared.downloadStart'),
    });

    const fileOptions = {
      name: 'permissions-relation-report',
      type: 'text/csv',
    };

    this.httpClient
      .get(url, { responseType: 'text' })
      .pipe(switchMap(streamToFile(fileOptions)))
      .subscribe({
        complete: () => this.toastService.dismiss(),
        error: () => {
          this.toastService.open({
            type: 'danger',
            message: translate('shared.downloadFailed'),
          });
        },
      });
  }
}
