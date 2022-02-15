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

 import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
 import { CommonModule } from '@angular/common';
 import { ChangeDetectionStrategy, Component, NgModule } from "@angular/core";
 import {
  WattButtonModule,
  WattFormFieldModule,
  WattIconModule,
  WattInputModule,
 } from '@energinet-datahub/watt';

 @Component({
   changeDetection: ChangeDetectionStrategy.OnPush,
   selector: 'dh-message-archive-log-search',
   styleUrls: ['./dh-message-archive-log-search.component.scss'],
   templateUrl: './dh-message-archive-log-search.component.html',
 })
 export class DhMessageArchiveLogSearchComponent {
   searchResult$: string[] = ["result1", "result2", "result3"];
   searchControl = new FormControl();

   onSubmit() {
     console.log("Triggerd");
   }
 }
 @NgModule({
   imports: [
    WattFormFieldModule,
    WattInputModule,
    WattButtonModule,
    WattIconModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
   ],
   declarations: [DhMessageArchiveLogSearchComponent],
 })
 export class DhMessageArchiveLogSearchScam {}
