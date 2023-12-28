import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterModule,
  ],
  selector: 'eov-shell',
  styles: [
    `
    `,
  ],
  template: `<router-outlet />`,
})
export class EovShellComponent {
}
