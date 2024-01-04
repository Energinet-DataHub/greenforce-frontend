import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'eov-landing-page-shell',
  templateUrl: './eov-landing-page-shell.component.html',
  styleUrls: ['./eov-landing-page-shell.component.scss']
})
export class EovLandingPageShellComponent {

}
