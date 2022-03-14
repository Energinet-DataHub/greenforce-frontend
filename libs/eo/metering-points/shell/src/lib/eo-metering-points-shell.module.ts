import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EoMeteringPointsShellScam, EoMeteringPointsShellComponent} from './eo-metering-points-shell.component';

const routes: Routes = [
  {
    path: '',
    component: EoMeteringPointsShellComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    EoMeteringPointsShellScam
  ],
})
export class EoMeteringPointsShellModule {}
