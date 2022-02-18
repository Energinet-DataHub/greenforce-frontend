import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EoPrivacyPageShellComponent } from './eo-privacy-page-shell.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      /* {path: '', pathMatch: 'full', component: InsertYourComponentHere} */
    ]),
  ],
  declarations: [
    EoPrivacyPageShellComponent
  ],
})
export class EoPrivacyPolicyShellModule {}
