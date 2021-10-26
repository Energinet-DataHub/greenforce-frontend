import { HttpClientModule } from '@angular/common/http';
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import {
  ettAuthenticationInterceptorProvider,
  ettAuthorizationInterceptorProvider,
} from '@energinet-datahub/ett/auth/data-access';

@NgModule({
  imports: [HttpClientModule],
  providers: [
    ettAuthenticationInterceptorProvider,
    ettAuthorizationInterceptorProvider,
  ],
})
export class EttHttpRootModule {
  constructor(
    @Optional()
    @SkipSelf()
    maybeNgModuleFromParentInjector?: EttHttpRootModule
  ) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'EttHttpRootModule.forRoot registered in multiple injectors. Only call it from the core feature shell module or in the Angular testing module.'
      );
    }
  }
}

@NgModule()
export class EttHttpModule {
  static forRoot(): ModuleWithProviders<EttHttpRootModule> {
    return {
      ngModule: EttHttpRootModule,
    };
  }

  constructor() {
    throw new Error(
      'Do not import EttHttpModule directly. Use EttHttpModule.forRoot.'
    );
  }
}
