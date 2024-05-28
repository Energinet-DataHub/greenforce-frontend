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
import { Directive, TemplateRef, ViewContainerRef, inject, input, effect } from '@angular/core';

import { DhActorExtended } from '@energinet-datahub/dh/market-participant/actors/domain';
import { EicFunction } from '@energinet-datahub/dh/shared/domain/graphql';

@Directive({
  selector: '[dhCanDelegateFor]',
  standalone: true,
})
export class DhCanDelegateForDirective {
  private templateRef = inject<TemplateRef<unknown>>(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);

  private canDelegateForMarketRoles: EicFunction[] = [
    EicFunction.GridAccessProvider,
    EicFunction.BalanceResponsibleParty,
    EicFunction.EnergySupplier,
  ];

  dhCanDelegateFor = input.required<DhActorExtended['marketRole']>();

  constructor() {
    effect(
      () => {
        this.viewContainerRef.clear();

        if (
          this.canDelegateForMarketRoles.includes(this.dhCanDelegateFor() ?? ('' as EicFunction))
        ) {
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
      },
      { allowSignalWrites: true }
    );
  }
}
