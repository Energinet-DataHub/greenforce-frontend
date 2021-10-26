import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';

/**
 * Do not import directly. Use `EttMaterialModule.forRoot`.
 */
@NgModule({
  imports: [MatSnackBarModule],
})
export class EttMaterialRootModule {
  constructor(
    @Optional()
    @SkipSelf()
    maybeNgModuleFromParentInjector?: EttMaterialRootModule
  ) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'EttMaterialModule.forRoot registered in multiple injectors. Only call it from the core feature shell module or in the Angular testing module.'
      );
    }
  }
}

/**
 * Do not import directly. Use `EttMaterialModule.forRoot`.
 */
@NgModule()
export class EttMaterialModule {
  /**
   * Registers root-level Angular Material dependencies.
   */
  static forRoot(): ModuleWithProviders<EttMaterialRootModule> {
    return {
      ngModule: EttMaterialRootModule,
    };
  }

  constructor() {
    throw new Error(
      'Do not import EttMaterialModule directly. Use EttMaterialModule.forRoot.'
    );
  }
}
