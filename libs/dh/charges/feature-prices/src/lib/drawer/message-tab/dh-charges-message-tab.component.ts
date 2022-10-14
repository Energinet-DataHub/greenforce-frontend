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
import { Component, NgModule } from '@angular/core';
//import { DhDrawerDatepickerScam } from '../drawer-datepicker/dh-drawer-datepicker.component';

@Component({
  selector: 'dh-charges-prices-message-tab',
  templateUrl: './dh-charges-message-tab.component.html',
  styleUrls: ['./dh-charges-message-tab.component.scss']
})
export class DhChargesMessageTabComponent {}

@NgModule({
  declarations: [DhChargesMessageTabComponent],
  exports: [DhChargesMessageTabComponent],
  //imports: [DhDrawerDatepickerScam],
})

export class DhChargesMessageTabScam {}
