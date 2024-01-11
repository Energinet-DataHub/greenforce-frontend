import { Routes } from '@angular/router';
import { EovHelpFeatureFaqComponent } from './eov-help-feature-faq/eov-help-feature-faq.component';

export const eovHelpRoutes: Routes = [
  { path: '', pathMatch: 'full', component: EovHelpFeatureFaqComponent }
];
