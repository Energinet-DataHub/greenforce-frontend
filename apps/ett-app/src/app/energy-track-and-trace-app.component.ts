import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'ett-app',

  styles: [':host { display: block; }'],
  template: `<h1>Energy Track and Trace</h1>`,
})
export class EnergyTrackAndTraceAppComponent {}

@NgModule({
  declarations: [EnergyTrackAndTraceAppComponent],
})
export class EnergyTrackAndTraceAppScam {}
