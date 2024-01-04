import { Routes } from '@angular/router';
import { EovOverviewShellComponent } from './eov-overview-shell.component';

export const eovOverviewRoutes: Routes = [
  { path: '', pathMatch: 'full', component: EovOverviewShellComponent }
];
