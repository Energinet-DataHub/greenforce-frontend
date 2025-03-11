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
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WattDataIntlService {
  readonly changes: Subject<void> = new Subject<void>();
  search = 'Search';
  emptyTitle = 'No results found';
  emptyText = 'Try changing the search criteria.';
  emptyRetry = 'Retry';
  errorTitle = 'An unexpected error occured';
  errorText = 'Unfortunately, an error occurred while retrieving the necessary information.';
  defaultTitle = 'An unexpected error occured';
  defaultText = 'Unfortunately, an error occurred while retrieving the necessary information.';
}
