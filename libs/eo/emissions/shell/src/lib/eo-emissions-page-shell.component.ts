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
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EoPopupMessageComponent } from '@energinet-datahub/eo/shared/atomic-design/feature-molecules';
import { EoStackComponent } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import { LetModule } from '@rx-angular/template/let';
import { EoEmissionsPageCo2ReductionComponent } from './eo-emissions-page-co2-reduction';
import { EoEmissionsPageGreenhouseGassesComponent } from './eo-emissions-page-greenhouse-gasses.component';
import { EoEmissionsPageInfoComponent } from './eo-emissions-page-info.component';
import { EoEmissionsPageLeadByExampleComponent } from './eo-emissions-page-lead-by-example.component';
import { EoEmissionsPageTipComponent } from './eo-emissions-page-tip.component';
import { EoEmissionsStore } from './eo-emissions.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    LetModule,
    CommonModule,
    EoPopupMessageComponent,
    EoEmissionsPageInfoComponent,
    EoEmissionsPageCo2ReductionComponent,
    EoEmissionsPageTipComponent,
    EoEmissionsPageGreenhouseGassesComponent,
    EoEmissionsPageLeadByExampleComponent,
    EoStackComponent,
  ],
  selector: 'eo-emissions-page-shell',
  styles: [
    `
      .content {
        display: grid;
        grid-template-columns: 354px 578px; // Magic numbers by designer
        grid-gap: var(--watt-space-l);
      }
    `,
  ],
  template: `
    <ng-container *rxLet="error$ as error">
      <eo-popup-message *ngIf="error" [errorMessage]="error">
      </eo-popup-message>
    </ng-container>
    <div class="content">
      <eo-stack size="L">
        <eo-emissions-page-info></eo-emissions-page-info>
        <eo-emissions-page-co2-reduction></eo-emissions-page-co2-reduction>
        <eo-emissions-page-tip></eo-emissions-page-tip>
      </eo-stack>
      <eo-stack size="L">
        <eo-emissions-page-greenhouse-gasses></eo-emissions-page-greenhouse-gasses>
        <eo-emissions-page-lead-by-example></eo-emissions-page-lead-by-example>
      </eo-stack>
    </div>
  `,
})
export class EoEmissionsPageShellComponent {
  error$ = this.emissionsStore.error$;

  constructor(private emissionsStore: EoEmissionsStore) {}
}
