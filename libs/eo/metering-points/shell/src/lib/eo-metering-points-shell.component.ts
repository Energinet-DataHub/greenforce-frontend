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
import { Component, NgModule } from '@angular/core';
import { LetModule } from '@rx-angular/template';
import { EoMeteringPointsStore } from './eo-metering-points.store';

@Component({
  selector: 'eo-metering-points-shell',
  styles: [
    `
      :host {
        display: block;
      }

      .grey-color {
        color: var(--watt-color-neutral-grey-900);
      }
    `,
  ],
  template: `<ng-container *rxLet="meteringPoints$ as meteringPoints">
    <p class="grey-color" *ngIf="meteringPoints.length < 1">
      You do not have any metering points.
    </p>
    <p
      class="grey-color watt-space-stack-m"
      *ngFor="let point of meteringPoints"
    >
      {{ point.gsrn }}
    </p>
  </ng-container>`,
  viewProviders: [EoMeteringPointsStore],
})
export class EoMeteringPointsShellComponent {
  meteringPoints$ = this.meteringPointsStore.meteringPoints$;

  constructor(private meteringPointsStore: EoMeteringPointsStore) {}
}

@NgModule({
  declarations: [EoMeteringPointsShellComponent],
  exports: [EoMeteringPointsShellComponent],
  imports: [CommonModule, LetModule],
})
export class EoMeteringPointsShellScam {}
