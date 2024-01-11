import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WattExpandableCardComponent, WattExpandableCardTitleComponent } from '@energinet-datahub/watt/expandable-card';

@Component({
  selector: 'eov-eov-help-feature-faq',
  standalone: true,
  imports: [
    CommonModule,
    WattExpandableCardComponent,
    WattExpandableCardTitleComponent
  ],
  templateUrl: './eov-help-feature-faq.component.html',
  styleUrl: './eov-help-feature-faq.component.scss',
})
export class EovHelpFeatureFaqComponent {

}
