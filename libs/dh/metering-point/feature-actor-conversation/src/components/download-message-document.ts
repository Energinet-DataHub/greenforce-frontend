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
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

import { dhApiEnvironmentToken } from '@energinet-datahub/dh/shared/environments';
import { toFile } from '@energinet-datahub/dh/shared/ui-util';

const downloadPath = '/v1/ActorConversation/DownloadMessageDocument';

export function injectDownloadMessageDocument() {
  const http = inject(HttpClient);
  const apiEnvironment = inject(dhApiEnvironmentToken);

  return (documentId: string, documentName: string): void => {
    http
      .get(`${apiEnvironment.apiBase}${downloadPath}/${documentId}`, {
        responseType: 'blob',
      })
      .subscribe((blob) => {
        toFile({ name: documentName, type: blob.type, data: blob });
      });
  };
}
