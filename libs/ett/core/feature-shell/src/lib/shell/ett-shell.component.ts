import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShellModule } from '@energinet-datahub/watt';

@Component({
  selector: 'ett-shell',

  styles: [':host { display: block; }'],
  template: `
    <watt-shell>
      <ng-container watt-shell-sidenav>
        <h1>Energy Track and Trace</h1>
      </ng-container>

      <ng-container watt-shell-toolbar>
        <p>Toolbar</p>
      </ng-container>

      <router-outlet></router-outlet>
    </watt-shell>
  `,
})
export class EttShellComponent {}

@NgModule({
  declarations: [EttShellComponent],
  imports: [RouterModule, ShellModule],
})
export class EttShellScam {}
