import { ModuleWithProviders, NgModule, Optional, SkipSelf } from "@angular/core";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { WattToastComponent } from "./watt-toast.component";

@NgModule({
  imports: [MatSnackBarModule, WattToastComponent],
})
export class WattToastRootModule {
  constructor(
    @Optional()
    @SkipSelf()
    maybeNgModuleFromParentInjector?: WattToastRootModule
  ) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'WattDanishDatetimeRootModule.forRoot registered in multiple injectors. Only call it from the core feature shell module or in the Angular testing module.'
      );
    }
  }
}

/**
 * Do not import directly. Use `WattToastModule.forRoot`.
 */
@NgModule()
export class WattToastModule {
  /**
   * Registers root-level dependencies.
   */
  static forRoot(): ModuleWithProviders<WattToastModule> {
    return {
      ngModule: WattToastRootModule,
    };
  }

  constructor() {
    throw new Error(
      'Do not import WattToastModule directly. Use WattToastModule.forRoot.'
    );
  }
}
