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
import { Injectable } from '@angular/core';
import { Observable, exhaustMap } from 'rxjs';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { MessageArchiveHttp, Stream } from '@energinet-datahub/dh/shared/domain';


@Injectable()
export class DhMessageArchiveDocumentApiStore extends ComponentStore<object> {
  constructor(private httpClient: MessageArchiveHttp) {
    super();
  }

  readonly getDocument = this.effect(
    (
      trigger$: Observable<{
        id: string;
        onSuccessFn: (id: string, data: Stream) => void;
        onErrorFn: () => void;
      }>
    ) => {
      return trigger$.pipe(
        exhaustMap(({ id, onSuccessFn, onErrorFn }) =>
        this.httpClient
        .v1MessageArchiveIdDocumentGet(id).pipe(
            tapResponse(
              (data) => {
                onSuccessFn(id, data);
              },
              () => {
                onErrorFn();
              }
            )
          )
        )
      );
    }
  );
}
