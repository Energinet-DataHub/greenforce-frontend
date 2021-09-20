import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { EnergyTrackAndTraceAppModule } from './app/energy-track-and-trace-app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(EnergyTrackAndTraceAppModule)
  .catch((err) => console.error(err));
