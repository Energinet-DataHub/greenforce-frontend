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

        const canDelegateFor = this.dhCanDelegateFor();

        if (canDelegateFor && this.canDelegateForMarketRoles.includes(canDelegateFor)) {
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
      },
      { allowSignalWrites: true }
    );
  }
}
