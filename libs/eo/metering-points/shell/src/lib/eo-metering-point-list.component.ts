import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, NgModule } from '@angular/core';
import { LetModule } from '@rx-angular/template';
import { EoMeteringPointsStore } from './eo-metering-points.store';

@Component({
  selector: 'eo-metering-points-list',
  template: `<ng-container *rxLet="meteringPoints$ as meteringPoints">
    <p class="metering-point" *ngIf="meteringPoints?.length === 0">
      You do not have any metering points.
    </p>
    <p
      class="metering-point watt-space-stack-m"
      *ngFor="let point of meteringPoints"
    >
      {{ point.gsrn }}
    </p>
  </ng-container>`,
  styles: [
    `
      :host {
        display: block;
      }

      .metering-point {
        color: var(--watt-color-neutral-grey-900);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [EoMeteringPointsStore],
})
export class EoMeteringPointListComponent {
  meteringPoints$ = this.meteringPointsStore.meteringPoints$;

  constructor(private meteringPointsStore: EoMeteringPointsStore) {}
}

@NgModule({
  declarations: [EoMeteringPointListComponent],
  exports: [EoMeteringPointListComponent],
  imports: [CommonModule, LetModule],
})
export class EoMeteringPointListScam {}
