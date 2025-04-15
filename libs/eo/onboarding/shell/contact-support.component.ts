import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { translations } from '@energinet-datahub/eo/translations';
import { WindTurbineComponent } from './wind-turbine.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'eo-contact-support',
  standalone: true,
  imports: [RouterModule, TranslocoPipe, WindTurbineComponent],
  styles: [
    `
      eo-contact-support li {
        margin-bottom: var(--watt-space-m);
      }

      .support-block {
        margin-top: var(--watt-space-l);
        margin-left: var(--watt-space-m);
        text-align: left;
        max-width: 40rem;
        overflow-wrap: break-word;
        word-wrap: break-word;
      }

      .support-block h2 {
        margin-top: 0;
      }

      .support-block p {
        margin-top: var(--watt-space-m);
      }

      .contact-info p {
        margin-bottom: var(--watt-space-s);
      }
    `,
  ],
  template: `
    <div class="support-block">
      <h2>{{ translations.shared.notWhitelistedError.title | transloco }}</h2>
      <p>{{ translations.shared.notWhitelistedError.message | transloco }}</p>
      <eo-wind-turbine [height]="300" [width]="200" [rotationSpeed]="5" />
    </div>
  `,
})
export class ContactSupportComponent {
  private transloco = inject(TranslocoService);

  protected translations = translations;
}
