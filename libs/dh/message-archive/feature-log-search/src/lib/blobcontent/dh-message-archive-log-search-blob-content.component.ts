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
 import { CommonModule } from "@angular/common";
 import { ChangeDetectionStrategy, Component, NgModule } from "@angular/core";
 import { DhMessageArchiveDataAccessApiModule } from "@energinet-datahub/dh/message-archive/data-access-api";
 import { TranslocoModule } from '@ngneat/transloco';
 import { LetModule } from '@rx-angular/template';

@Component({
changeDetection: ChangeDetectionStrategy.OnPush,
selector: "dh-message-archive-log-search-blob-content",
templateUrl: "./dh-message-archive-log-search-blob-content.component.html",
styleUrls: ['./dh-message-archive-log-search-blob-content.component.scss'],
})
export class DhMessageArchiveLogSearchBlolbContentComponent {

  constructor(private store: DhMessageArchiveDataAccessApiModule) {

  }

}

@NgModule({
  declarations: [DhMessageArchiveLogSearchBlolbContentComponent],
  exports: [DhMessageArchiveLogSearchBlolbContentComponent],
  imports: [
    CommonModule,
    TranslocoModule,
    LetModule,
  ],
})
export class DhMessageArchiveLogSearchBlolbContentScam {}
