import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    WattButtonComponent,
  ],
  selector: 'eov-landing-page-shell',
  templateUrl: './eov-landing-page-shell.component.html',
  styleUrls: ['./eov-landing-page-shell.component.scss']
})
export class EovLandingPageShellComponent {

}
