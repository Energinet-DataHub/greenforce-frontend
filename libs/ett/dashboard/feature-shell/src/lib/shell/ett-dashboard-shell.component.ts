import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'ett-dashboard-shell',

  styles: [':host { display: block; }'],
  template: `
    <h2>Dashboard</h2>

    <router-outlet></router-outlet>
  `,
})
export class EttDashboardShellComponent {}

@NgModule({
  declarations: [EttDashboardShellComponent],
  imports: [RouterModule],
})
export class EttDashboardShellScam {}
