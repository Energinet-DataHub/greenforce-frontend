import { Injectable, makeEnvironmentProviders } from '@angular/core';

export function provideHotToastConfig() {
  return makeEnvironmentProviders([]);
}

@Injectable({
  providedIn: 'root',
})
export class HotToastService {}
