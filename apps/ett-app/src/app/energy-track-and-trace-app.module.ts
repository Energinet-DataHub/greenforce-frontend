import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { EnergyTrackAndTraceAppComponent, EnergyTrackAndTraceAppScam } from './energy-track-and-trace-app.component';

@NgModule({
  bootstrap: [EnergyTrackAndTraceAppComponent],
  imports: [BrowserModule, EnergyTrackAndTraceAppScam],
})
export class EnergyTrackAndTraceAppModule {}
