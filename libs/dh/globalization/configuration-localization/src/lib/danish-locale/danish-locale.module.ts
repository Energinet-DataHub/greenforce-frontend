import { NgModule } from '@angular/core';

import { danishLocaleInitializer } from './danish-locale.initializer';
import { danishLocaleProvider } from './danish-locale.provider';

@NgModule({
  providers: [danishLocaleProvider, danishLocaleInitializer],
})
export class DanishLocaleModule {}
