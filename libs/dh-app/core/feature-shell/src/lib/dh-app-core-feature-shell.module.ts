import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ShellComponent } from './shell/shell.component';
import { ShellModule } from './shell/shell.module';

const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      // Lazy feature routes
    ],
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes), ShellModule],
})
export class DhAppCoreFeatureShellModule {}
