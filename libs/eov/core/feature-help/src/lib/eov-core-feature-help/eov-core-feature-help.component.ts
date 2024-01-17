import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WattExpandableCardComponent, WattExpandableCardTitleComponent } from '@energinet-datahub/watt/expandable-card';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'eov-eov-core-feature-help',
  standalone: true,
  imports: [
    CommonModule,
    WattExpandableCardComponent,
    WattExpandableCardTitleComponent,
    TranslocoModule,
  ],
  templateUrl: './eov-core-feature-help.component.html',
  styleUrl: './eov-core-feature-help.component.scss',
})
export class EovCoreFeatureHelpComponent {}
